import type { OptionsConfig, TypedFlatConfigItem } from '@renton/eslint-config'

export interface OptionsReact extends OptionsConfig {
  react?: boolean
  next?: boolean
  reactVersion?: string
  tailwindcss?: boolean
  tailwindcssConfigPath?: string
}

export type { TypedFlatConfigItem }
