import type { OptionsOverrides, TypedFlatConfigItem } from '@renton/eslint-config'
import { interopDefault } from '@renton/eslint-config/utils'

export async function tanstackQuery(options: OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
  } = options

  const pluginTanstackQuery = await interopDefault(import('@tanstack/eslint-plugin-query'))
  const recommendedRules = pluginTanstackQuery.configs['flat/recommended'][0].rules

  return [
    {
      name: 'renton/tanstack-query/setup',
      plugins: {
        '@tanstack/query': pluginTanstackQuery,
      },
    },
    {
      name: 'renton/tanstack-query/rules',
      rules: {
        ...recommendedRules,
        ...overrides,
      },
    },
  ]
}
