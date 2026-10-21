import { Linter } from "eslint";
import { it } from "vitest";
import { rentonReact } from "../src/factory";

const NAMING_RULES: Record<string, true> = {
  "react/naming-convention-ref-name": true,
  "unicorn/name-replacements": true,
};

async function lintNamingMessages(source: string) {
  const config = await rentonReact({});
  const linter = new Linter({ configType: "flat" });
  return linter
    .verify(source, config, { filename: "src/demo.jsx" })
    .filter(message => message.ruleId !== null && NAMING_RULES[message.ruleId])
    .map(message => `${message.ruleId}: ${message.message}`);
}

it("leaves expanded ref names alone (no react/naming-convention-ref-name)", async ({ expect }) => {
  const messages = await lintNamingMessages(`import { useRef } from "react";

export function demo() {
  const containerReference = useRef(null);
  const reference = useRef(null);
  const lastPosition = useRef(0);
  return [containerReference, reference, lastPosition];
}
`);
  expect(messages).toEqual([]);
}, 60_000);

it("reports `*Ref` names only through unicorn/name-replacements", async ({ expect }) => {
  const messages = await lintNamingMessages(`import { useRef } from "react";

export function demo() {
  const containerRef = useRef(null);
  return containerRef;
}
`);
  expect(messages).toEqual([
    expect.stringContaining("unicorn/name-replacements"),
  ]);
}, 60_000);
