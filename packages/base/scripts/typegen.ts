import { flatConfigsToRulesDTS } from "eslint-typegen/core";
import { builtinRules } from "eslint/use-at-your-own-risk";
import fs from "node:fs/promises";
import { renton } from "../src/factory";

const configs: any[] = [
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

const configNames = configs.map(index => index.name).filter(Boolean) as string[];

let dts = await flatConfigsToRulesDTS(configs, {
  exportTypeName: "Rules",
  filterPlugin(name) {
    return name !== "renton";
  },
  includeAugmentation: false,
});

// Fix duplicate interface declarations
const duplicateInterfacePattern = /interface\s+(\w+)\s*\{[^}]*\}\s*interface\s+\1\s*\{[^}]*\}/g;
dts = dts.replaceAll(duplicateInterfacePattern, (match, interfaceName) => {
  // Keep only the first declaration
  const firstDeclaration = match.match(new RegExp(String.raw`interface\s+${interfaceName}\s*\{[^}]*\}`))?.[0];
  return firstDeclaration || match;
});

// Fix types with conflicting index signatures (e.g., TestValidTitle)
// The issue is that specific properties like `ignoreTypeOfDescribeName?: boolean`
// conflict with `[k: string]: string | [string] | ...` index signature
dts = dts.replaceAll(
  /type\s+TestValidTitle\s*=\s*\[\]\s*\|\s*\[\{[\s\S]*?\}\],?\n/g,
  `type TestValidTitle = []|[{
  ignoreTypeOfDescribeName?: boolean
  allowArguments?: boolean
  disallowedWords?: string[]
}]
`,
);

// Add index signature to Rules interface for compatibility with Linter.Config
dts = dts.replace(
  /export interface Rules \{/,
  `export interface Rules {
  [k: string]: Linter.RuleEntry<any> | undefined`,
);

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map(index => `'${index}'`).join(" | ")}
`;

await fs.writeFile("src/typegen.ts", dts);

console.log("Type definitions generated!");
