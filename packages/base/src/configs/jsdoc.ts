import type { OptionsOverrides, TypedFlatConfigItem } from '../types'
import { interopDefault } from '../utils'

export async function jsdoc(options: OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
  } = options

  const pluginJsdoc = await interopDefault(import('eslint-plugin-jsdoc'))

  return [
    {
      name: 'renton/jsdoc/rules',
      plugins: {
        jsdoc: pluginJsdoc,
      },
      rules: {
        'jsdoc/check-access': 'error',
        'jsdoc/check-param-names': 'error',
        'jsdoc/check-property-names': 'error',
        'jsdoc/check-tag-names': 'error',
        'jsdoc/check-types': 'error',
        'jsdoc/empty-tags': 'error',
        'jsdoc/implements-on-classes': 'error',
        'jsdoc/no-defaults': 'error',
        'jsdoc/no-multi-asterisks': 'error',
        'jsdoc/require-asterisk-prefix': 'error',
        'jsdoc/require-description': 'error',
        'jsdoc/require-jsdoc': 'off',
        'jsdoc/require-param': 'off',
        'jsdoc/require-param-description': 'off',
        'jsdoc/require-param-type': 'off',
        'jsdoc/require-property': 'off',
        'jsdoc/require-property-description': 'off',
        'jsdoc/require-property-type': 'off',
        'jsdoc/require-returns': 'off',
        'jsdoc/require-returns-check': 'error',
        'jsdoc/require-returns-description': 'off',
        'jsdoc/require-returns-type': 'off',
        'jsdoc/require-throws': 'error',
        'jsdoc/require-yields': 'off',
        'jsdoc/require-yields-check': 'error',
        'jsdoc/tag-lines': ['error', 'any', { startLines: 1 }],
        ...overrides,
      },
    },
  ]
}
