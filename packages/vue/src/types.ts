import type { OptionsConfig, TypedFlatConfigItem } from '@renton/eslint-config'

export interface OptionsVue extends OptionsConfig {
  vue?: boolean
  vueVersion?: 2 | 3
}

export type { TypedFlatConfigItem }
