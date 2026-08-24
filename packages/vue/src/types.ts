import type { OptionsConfig } from "@renton/eslint-config";

export interface OptionsVue extends OptionsConfig {
  tailwindcss?: boolean;
  tailwindcssConfigPath?: string;
  vue?: boolean;
  vueI18n?: boolean;
  vueI18nLocaleDir?: string;
  vueVersion?: 2 | 3;
}

export { type TypedFlatConfigItem } from "@renton/eslint-config";
