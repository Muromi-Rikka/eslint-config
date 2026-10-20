import { ESLint } from "eslint";
import { it } from "vitest";
import { rentonVue } from "../src/factory";

const tsSfc = `<script setup lang="ts">
interface TechItem {
  id: string;
}
const item: TechItem = { id: "vue" };
</script>

<template>
  <p>{{ item.id }}</p>
</template>
`;

async function lintSfc(code: string, isTypeScript: boolean) {
  const eslint = new ESLint({
    overrideConfig: await rentonVue({ typescript: isTypeScript }),
    overrideConfigFile: true,
  });
  const [result] = await eslint.lintText(code, { filePath: "src/App.vue" });
  return result;
}

it("parses <script setup lang=\"ts\"> TypeScript syntax without fatal errors", async ({ expect }) => {
  const result = await lintSfc(tsSfc, true);
  expect(result.messages.filter(message => message.fatal)).toEqual([]);
});

it("evaluates TypeScript rules inside SFC script blocks", async ({ expect }) => {
  const result = await lintSfc(tsSfc.replace("const item", "// @ts-ignore\nconst item"), true);
  expect(result.messages.some(message => message.ruleId === "ts/ban-ts-comment")).toBe(true);
});

it("keeps the espree fallback when typescript is disabled", async ({ expect }) => {
  const result = await lintSfc(tsSfc, false);
  expect(result.messages.some(message => message.fatal)).toBe(true);
});
