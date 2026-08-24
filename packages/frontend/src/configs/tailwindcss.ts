import type { OptionsOverrides, TypedFlatConfigItem } from "@renton/eslint-config";
import { interopDefault } from "@renton/eslint-config/utils";

export interface OptionsTailwindcssConfig extends OptionsOverrides {
  cssConfigPath: string;
}

export async function tailwindcss(options: OptionsTailwindcssConfig): Promise<TypedFlatConfigItem[]> {
  const {
    cssConfigPath,
    overrides = {},
  } = options;

  const pluginTailwindcss = await interopDefault(import("eslint-plugin-tailwindcss"));

  const recommendedConfig = pluginTailwindcss.configs.recommended as TypedFlatConfigItem;

  return [
    {
      ...recommendedConfig,
      name: "renton/tailwindcss/setup",
      settings: {
        ...recommendedConfig.settings,
        tailwindcss: {
          ...(recommendedConfig.settings as any)?.tailwindcss,
          cssConfig: cssConfigPath,
        },
      },
    },
    {
      name: "renton/tailwindcss/rules",
      rules: {
        ...overrides,
      },
    },
  ];
}
