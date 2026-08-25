import { FlatConfigComposer } from "eslint-flat-config-utils";
import { findUpSync } from "find-up-simple";
import type { ConfigNames, OptionsConfig, TypedFlatConfigItem } from "./types";
import { command } from "./configs/command";
import { comments } from "./configs/comments";
import { disables } from "./configs/disables";
import { ignores } from "./configs/ignores";
import { imports } from "./configs/imports";
import { javascript } from "./configs/javascript";
import { jsdoc } from "./configs/jsdoc";
import { jsonc } from "./configs/jsonc";
import { jsx } from "./configs/jsx";
import { markdown } from "./configs/markdown";
import { node } from "./configs/node";
import { perfectionist } from "./configs/perfectionist";
import { pnpm } from "./configs/pnpm";
import { regexp } from "./configs/regexp";
import { sortPackageJson, sortTsconfig } from "./configs/sort";
import { stylistic } from "./configs/stylistic";
import { test } from "./configs/test";
import { typescript } from "./configs/typescript";
import { unicorn } from "./configs/unicorn";
import { yaml } from "./configs/yaml";
import { isInEditorEnv as isInEditorEnvironment } from "./utils";

export const PLUGIN_RENAMING: Record<string, string> = {
  "@eslint-react": "react",
  "@stylistic": "style",
  "@typescript-eslint": "ts",
  "import-lite": "import",
  "n": "node",
  "vitest": "test",
  "yml": "yaml",
};

export async function renton(
  options: OptionsConfig & { overrides?: TypedFlatConfigItem[] } = {},
  ...userConfigs: TypedFlatConfigItem[]
): Promise<TypedFlatConfigItem[]> {
  const {
    command: enableCommand = true,
    disables: enableDisables = true,
    formatters: enableFormatters = false,
    gitignore = true,
    jsdoc: enableJsdoc = true,
    jsonc: enableJsonc = true,
    jsx: enableJsx = true,
    markdown: enableMarkdown = true,
    node: enableNode = true,
    overrides,
    perfectionist: enablePerfectionist = true,
    pnpm: enablePnpm = !!findUpSync("pnpm-workspace.yaml"),
    regexp: enableRegexp = true,
    sort: enableSort = true,
    stylistic: enableStylistic = true,
    test: enableTest = true,
    typeAware = false,
    typescript: enableTypescript = true,
    unicorn: enableUnicorn = true,
    yaml: enableYaml = true,
  } = options;

  const stylisticOptions = typeof enableStylistic === "object" ? enableStylistic : undefined;

  // Enable JSX in stylistic if JSX is enabled
  if (stylisticOptions && !("jsx" in stylisticOptions))
    stylisticOptions.jsx = typeof enableJsx === "object" ? true : enableJsx;

  const isInEditor = isInEditorEnvironment();

  const configs: Promise<TypedFlatConfigItem[]>[] = [];

  // eslint-disable-next-line unicorn/no-immediate-mutation -- local array, not mutating external reference
  configs.push(ignores());

  if (gitignore) {
    const { default: gitignorePlugin } = await import("eslint-config-flat-gitignore");
    configs.push(Promise.resolve([
      {
        ...gitignorePlugin(),
        name: "renton/gitignore",
      },
    ]));
  }

  // Base configs
  configs.push(javascript());
  configs.push(imports());
  configs.push(comments());

  if (enableCommand) {
    configs.push(command());
  }

  if (enablePerfectionist) {
    configs.push(perfectionist());
  }

  if (enableNode) {
    configs.push(node());
  }

  if (enableJsdoc) {
    configs.push(jsdoc());
  }

  if (enableJsx) {
    configs.push(jsx(enableJsx === true ? {} : enableJsx));
  }

  if (enableTypescript) {
    configs.push(typescript({
      overrides: overrides?.find(c => c.name === "renton/typescript/rules")?.rules,
      typeAware,
    }));
  }

  if (enableStylistic) {
    configs.push(stylistic(stylisticOptions));
  }

  if (enableRegexp) {
    configs.push(regexp());
  }

  if (enableTest) {
    configs.push(test({
      isInEditor,
      overrides: overrides?.find(c => c.name === "renton/test/rules")?.rules,
    }));
  }

  if (enableJsonc) {
    configs.push(jsonc());
    if (enableSort) {
      configs.push(Promise.resolve(sortPackageJson()));
      configs.push(Promise.resolve(sortTsconfig()));
    }
  }

  if (enablePnpm) {
    const optionsPnpm = typeof enablePnpm === "object" ? enablePnpm : {};
    configs.push(pnpm({
      isInEditor,
      json: enableJsonc,
      yaml: enableYaml,
      ...optionsPnpm,
    }));
  }

  if (enableYaml) {
    configs.push(yaml());
  }

  if (enableMarkdown) {
    configs.push(markdown());
  }

  if (enableUnicorn) {
    configs.push(unicorn());
  }

  if (enableFormatters) {
    const { formatters: loadFormatters } = await import("./configs/formatters");
    configs.push(loadFormatters(
      enableFormatters === true ? {} : enableFormatters,
      stylisticOptions || {},
    ));
  }

  // Always last — context-aware rule disabling
  if (enableDisables) {
    configs.push(disables());
  }

  const resolvedConfigs = await Promise.all(configs);
  const composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>(...resolvedConfigs);

  composer.renamePlugins(PLUGIN_RENAMING);

  if (userConfigs.length > 0) {
    composer.append(...userConfigs);
  }

  return composer.toConfigs();
}
