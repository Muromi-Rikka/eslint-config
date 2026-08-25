import type { OptionsOverrides, TypedFlatConfigItem } from "@renton/eslint-config";
import { interopDefault } from "@renton/eslint-config/utils";

export interface BaselineOptions {
  available?: "newly" | "widely" | number;
  baseline?: "newly" | "widely" | number;
  ignoreFeatures?: string[];
}

export interface OptionsBaselineConfig extends OptionsOverrides {
  baseline?: BaselineOptions | boolean;
}

export async function baseline(options: OptionsBaselineConfig = {}): Promise<TypedFlatConfigItem[]> {
  const {
    baseline: baselineOptions = {},
    overrides = {},
  } = options;

  const pluginBaseline = await interopDefault(import("eslint-plugin-baseline-js"));

  const resolvedOptions = typeof baselineOptions === "object" ? baselineOptions : {};

  return [
    {
      name: "renton/baseline/setup",
      plugins: {
        "baseline-js": pluginBaseline,
      },
    },
    {
      name: "renton/baseline/rules",
      rules: {
        "baseline-js/use-baseline": [
          "warn",
          {
            ignoreFeatures: ["functions-caller-arguments"],
            includeJsBuiltins: { preset: "auto" },
            includeWebApis: { preset: "auto" },
            ...resolvedOptions,
          },
        ],
        ...overrides,
      },
    },
    {
      files: [
        "**/__tests__/**/*.?([cm])[jt]s?(x)",
        "**/*.spec.?([cm])[jt]s?(x)",
        "**/*.test.?([cm])[jt]s?(x)",
      ],
      name: "renton/baseline/tests",
      rules: {
        "baseline-js/use-baseline": "off",
      },
    },
  ];
}
