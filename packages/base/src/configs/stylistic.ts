import type { StylisticOptions, TypedFlatConfigItem } from "../types";
import { GLOB_SRC } from "../globs";
import { pluginAntfu } from "../plugins";
import { interopDefault } from "../utils";

const defaults: Required<StylisticOptions> = {
  braceStyle: "stroustrup",
  indent: 2,
  jsx: true,
  quotes: "double",
  semi: true,
};

export async function stylistic(options: StylisticOptions = {}): Promise<TypedFlatConfigItem[]> {
  const {
    braceStyle,
    indent,
    quotes,
    semi,
  } = { ...defaults, ...options };

  const pluginStylistic = await interopDefault(import("@stylistic/eslint-plugin"));

  const config = pluginStylistic.configs.customize({
    braceStyle,
    indent,
    jsx: true,
    pluginName: "style",
    quotes,
    semi,
  }) as TypedFlatConfigItem;

  return [
    {
      files: [GLOB_SRC],
      name: "renton/stylistic/rules",
      plugins: {
        antfu: pluginAntfu,
        style: pluginStylistic,
      },
      rules: {
        ...config.rules,

        "antfu/consistent-chaining": "error",
        "antfu/consistent-list-newline": "error",
        "antfu/curly": "error",
        "antfu/if-newline": "error",
        "antfu/top-level-function": "error",

        "style/generator-star-spacing": ["error", { after: true, before: false }],
        "style/yield-star-spacing": ["error", { after: true, before: false }],
      },
    },
  ];
}
