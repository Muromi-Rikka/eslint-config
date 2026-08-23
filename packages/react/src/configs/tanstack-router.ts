import type { OptionsOverrides, TypedFlatConfigItem } from '@renton/eslint-config'
import { interopDefault } from '@renton/eslint-config/utils'

export async function tanstackRouter(options: OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
  } = options

  const pluginTanstackRouter = await interopDefault(import('@tanstack/eslint-plugin-router'))
  const recommendedRules = pluginTanstackRouter.configs['flat/recommended'][0].rules

  return [
    {
      name: 'renton/tanstack-router/setup',
      plugins: {
        '@tanstack/router': pluginTanstackRouter,
      },
    },
    {
      name: 'renton/tanstack-router/rules',
      rules: {
        ...recommendedRules,
        ...overrides,
      },
    },
  ]
}
