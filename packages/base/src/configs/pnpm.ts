import type { OptionsPnpm, TypedFlatConfigItem } from "../types";
import fs from "node:fs/promises";
import { findUp } from "find-up-simple";
import { interopDefault } from "../utils";

async function detectCatalogUsage(): Promise<boolean> {
  const workspaceFile = await findUp("pnpm-workspace.yaml");
  if (!workspaceFile)
    return false;

  const content = await fs.readFile(workspaceFile, "utf-8");
  return content.includes("catalog:") || content.includes("catalogs:");
}

export async function pnpm(options: OptionsPnpm = {}): Promise<TypedFlatConfigItem[]> {
  const [
    pluginPnpm,
    pluginJsoncParser,
    yamlParser,
  ] = await Promise.all([
    interopDefault(import("eslint-plugin-pnpm")),
    interopDefault(import("jsonc-eslint-parser")),
    interopDefault(import("yaml-eslint-parser")),
  ]);

  const {
    catalogs = await detectCatalogUsage(),
    isInEditor = false,
    json = true,
    yaml = true,
  } = options;

  const configs: TypedFlatConfigItem[] = [];

  if (json) {
    configs.push({
      files: [
        "package.json",
        "**/package.json",
      ],
      languageOptions: {
        parser: pluginJsoncParser,
      },
      name: "renton/pnpm/package-json",
      plugins: {
        pnpm: pluginPnpm,
      },
      rules: {
        ...(catalogs
          ? {
              "pnpm/json-enforce-catalog": [
                "error",
                {
                  autofix: !isInEditor,
                },
              ],
            }
          : {}),
        "pnpm/json-prefer-workspace-settings": [
          "error",
          { autofix: !isInEditor },
        ],
        "pnpm/json-valid-catalog": [
          "error",
          { autofix: !isInEditor },
        ],
      },
    });
  }

  if (yaml) {
    configs.push({
      files: ["pnpm-workspace.yaml"],
      languageOptions: {
        parser: yamlParser,
      },
      name: "renton/pnpm/pnpm-workspace-yaml",
      plugins: {
        pnpm: pluginPnpm,
      },
      rules: {
        "pnpm/yaml-enforce-settings": ["error", {
          settings: {
            shellEmulator: true,
          },
        }],
        "pnpm/yaml-no-duplicate-catalog-item": "error",
        "pnpm/yaml-no-unused-catalog-item": "error",
      },
    });
  }

  return configs;
}
