import type { OptionsOverrides, TypedFlatConfigItem } from '@renton/eslint-config'
import { interopDefault } from '@renton/eslint-config/utils'

export interface OptionsVueI18nConfig extends OptionsOverrides {
  localeDir?: string
  messageSyntaxVersion?: string
}

export async function vueI18n(options: OptionsVueI18nConfig = {}): Promise<TypedFlatConfigItem[]> {
  const {
    localeDir = './locales/*.{json,json5,yaml,yml}',
    messageSyntaxVersion = '^11.0.0',
    overrides = {},
  } = options

  const pluginVueI18n = await interopDefault(import('@intlify/eslint-plugin-vue-i18n'))

  const recommendedConfigs = pluginVueI18n.configs['flat/recommended'] as TypedFlatConfigItem[]

  return [
    ...recommendedConfigs.map((config: TypedFlatConfigItem, index: number) => ({
      ...config,
      name: `renton/vue-i18n/setup/${index}`,
    })),
    {
      name: 'renton/vue-i18n/rules',
      settings: {
        'vue-i18n': {
          localeDir,
          messageSyntaxVersion,
        },
      },
      rules: {
        ...overrides,
      },
    },
  ]
}
