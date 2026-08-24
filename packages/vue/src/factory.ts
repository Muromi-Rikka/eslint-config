import { renton } from "@renton/eslint-config";
import { tailwindcss } from "@renton/eslint-config-frontend";
import type { OptionsVue, TypedFlatConfigItem } from "./types";
import { vue } from "./configs/vue";
import { vueI18n } from "./configs/vue-i18n";

export async function rentonVue(
  options: OptionsVue = {},
  ...userConfigs: TypedFlatConfigItem[]
): Promise<TypedFlatConfigItem[]> {
  const {
    tailwindcss: enableTailwindcss = false,
    tailwindcssConfigPath,
    vue: enableVue = true,
    vueI18n: enableVueI18n = false,
    vueI18nLocaleDir,
    vueVersion = 3,
    ...baseOptions
  } = options;

  if (enableTailwindcss && !tailwindcssConfigPath) {
    throw new Error("`tailwindcssConfigPath` is required when `tailwindcss` is enabled");
  }

  const baseConfigs = await renton(baseOptions);

  const vueConfigs = enableVue
    ? await vue({ vueVersion })
    : [];

  const vueI18nConfigs = enableVueI18n
    ? await vueI18n({ localeDir: vueI18nLocaleDir })
    : [];

  const tailwindcssConfigs = enableTailwindcss
    ? await tailwindcss({ cssConfigPath: tailwindcssConfigPath! })
    : [];

  const allConfigs = [...baseConfigs, ...vueConfigs, ...vueI18nConfigs, ...tailwindcssConfigs];

  if (userConfigs.length > 0) {
    allConfigs.push(...userConfigs);
  }

  return allConfigs;
}
