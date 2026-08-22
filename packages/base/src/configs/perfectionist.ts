import type { OptionsOverrides, TypedFlatConfigItem } from '../types'
import { interopDefault } from '../utils'

export async function perfectionist(options: OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
  } = options

  const pluginPerfectionist = await interopDefault(import('eslint-plugin-perfectionist'))

  return [
    {
      name: 'renton/perfectionist/rules',
      plugins: {
        perfectionist: pluginPerfectionist,
      },
      rules: {
        'perfectionist/sort-exports': ['error', { order: 'asc', type: 'natural' }],
        'perfectionist/sort-imports': ['error', {
          groups: [
            ['builtin', 'external'],
            'internal',
            ['parent', 'sibling', 'index'],
            'side-effect',
            'style',
            'type',
            'object',
          ],
          newlinesBetween: 'ignore',
          order: 'asc',
          type: 'natural',
        }],
        'perfectionist/sort-named-exports': ['error', { order: 'asc', type: 'natural' }],
        'perfectionist/sort-named-imports': ['error', { order: 'asc', type: 'natural' }],
        ...overrides,
      },
    },
  ]
}
