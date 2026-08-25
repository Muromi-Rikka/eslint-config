import type { OptionsOverrides, Rules, TypedFlatConfigItem } from "../types";
import { GLOB_SRC } from "../globs";
import { interopDefault } from "../utils";

export async function unicorn(options: OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
  } = options;

  const pluginUnicorn = await interopDefault(import("eslint-plugin-unicorn"));

  return [
    {
      files: [GLOB_SRC],
      name: "renton/unicorn/rules",
      plugins: {
        unicorn: pluginUnicorn,
      },
      rules: {
        ...pluginUnicorn.configs.recommended.rules,

        "unicorn/consistent-destructuring": "off",
        "unicorn/no-array-for-each": "off",
        "unicorn/no-array-reduce": "off",
        "unicorn/no-await-expression-member": "off",
        "unicorn/no-null": "off",
        "unicorn/no-process-exit": "off",
        "unicorn/numeric-separators-style": "off",
        "unicorn/prefer-at": "off",
        "unicorn/prefer-module": "off",
        "unicorn/prefer-top-level-await": "off",
        "unicorn/prevent-abbreviations": "off",

        ...overrides,
      } as Rules,
    },
  ];
}
