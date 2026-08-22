import type { OptionsOverrides, TypedFlatConfigItem } from '../types'
import { interopDefault } from '../utils'

export async function regexp(options: OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
  } = options

  const pluginRegexp = await interopDefault(import('eslint-plugin-regexp'))

  return [
    {
      name: 'renton/regexp/rules',
      plugins: {
        regexp: pluginRegexp,
      },
      rules: {
        ...pluginRegexp.configs.recommended.rules,
        ...overrides,
      },
    },
  ]
}
