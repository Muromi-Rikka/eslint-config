import fs from "node:fs/promises";
import { flatConfigsToRulesDTS } from "eslint-typegen/core";
// @ts-ignore -- internal API
import { builtinRules } from "eslint/use-at-your-own-risk";
import { renton } from "../src/factory.ts";

const configs = [
  ...(await renton({
    command: true,
    disables: true,
    formatters: false,
    gitignore: false,
    jsdoc: true,
    jsonc: true,
    jsx: true,
    markdown: true,
    node: true,
    perfectionist: true,
    pnpm: true,
    regexp: true,
    sort: true,
    stylistic: true,
    test: true,
    typeAware: false,
    typescript: true,
    unicorn: true,
    yaml: true,
  })),
  {
    plugins: {
      "": {
        rules: Object.fromEntries(builtinRules.entries()),
      },
    },
  },
];

const configNames = configs.map(i => i.name).filter(Boolean) as string[];

let dts = await flatConfigsToRulesDTS(configs, {
  exportTypeName: "Rules",
  filterPlugin(name) {
    return name !== "renton";
  },
  includeAugmentation: false,
});

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map(i => `'${i}'`).join(" | ")}
`;

await fs.writeFile("src/typegen.ts", dts);

console.log("Type definitions generated!");
