import type { OptionsConfig } from "@renton/eslint-config";

export interface OptionsReact extends OptionsConfig {
  next?: boolean;
  react?: boolean;
  tailwindcss?: boolean;
  tailwindcssConfigPath?: string;
  tanstackQuery?: boolean;
  tanstackRouter?: boolean;
}

export { type TypedFlatConfigItem } from "@renton/eslint-config";
