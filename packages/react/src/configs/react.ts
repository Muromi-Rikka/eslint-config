import type { OptionsOverrides, TypedFlatConfigItem } from "@renton/eslint-config";
import { interopDefault } from "@renton/eslint-config/utils";
import { GLOB_REACT, GLOB_REACT_TS } from "../globs";

export async function react(options: OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
  } = options;

  const pluginReact = await interopDefault(import("@eslint-react/eslint-plugin"));
  const pluginReactHooks = await interopDefault(import("eslint-plugin-react-hooks"));
  const pluginReactRefresh = await interopDefault(import("eslint-plugin-react-refresh"));

  const files = [GLOB_REACT, GLOB_REACT_TS];

  return [
    {
      files,
      name: "renton/react/setup",
      plugins: {
        "react": pluginReact,
        "react-hooks": pluginReactHooks,
        "react-refresh": pluginReactRefresh,
      },
      settings: {
        react: {
          version: "detect",
        },
      },
    },
    {
      files,
      name: "renton/react/rules",
      rules: {
        ...pluginReact.configs.recommended.rules,
        "react-hooks/exhaustive-deps": "warn",
        "react-hooks/rules-of-hooks": "error",
        "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
        ...overrides,
      },
    },
    {
      files,
      name: "renton/react/perfectionist",
      rules: {
        "perfectionist/sort-jsx-props": ["error", { order: "asc", type: "natural" }],
      },
    },
  ];
}
