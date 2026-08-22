import type { OptionsOverrides, TypedFlatConfigItem } from '../types'
import { GLOB_TS, GLOB_TSX } from '../globs'
import { interopDefault } from '../utils'

export interface OptionsTypescript extends OptionsOverrides {
  typeAware?: boolean
  tsconfigPath?: string
}

export async function typescript(options: OptionsTypescript = {}): Promise<TypedFlatConfigItem[]> {
  const {
    typeAware = false,
    tsconfigPath,
    overrides = {},
  } = options

  const tseslint = await interopDefault(import('typescript-eslint'))

  const files = [GLOB_TS, GLOB_TSX]

  const typeAwareRules: TypedFlatConfigItem['rules'] = {
    'dot-notation': 'off',
    'no-implied-eval': 'off',
    'no-throw-literal': 'off',
    'ts/await-thenable': 'error',
    'ts/dot-notation': ['error', { allowKeywords: true }],
    'ts/no-floating-promises': 'error',
    'ts/no-for-in-array': 'error',
    'ts/no-implied-eval': 'error',
    'ts/no-misused-promises': ['error', { checksVoidReturn: false }],
    'ts/no-throw-literal': 'error',
    'ts/no-unnecessary-type-assertion': 'error',
    'ts/no-unsafe-argument': 'error',
    'ts/no-unsafe-assignment': 'error',
    'ts/no-unsafe-call': 'error',
    'ts/no-unsafe-member-access': 'error',
    'ts/no-unsafe-return': 'error',
    'ts/restrict-plus-operands': ['error', { allowAny: false, allowBoolean: false, allowNullish: false, allowNumberAndString: false, allowRegExp: false }],
    'ts/restrict-template-expressions': ['error', { allowAny: false, allowBoolean: false, allowNullish: false, allowNumber: true }],
    'ts/unbound-method': 'error',
  }

  return [
    {
      files,
      name: 'renton/typescript/setup',
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
          ecmaFeatures: { jsx: true },
          ecmaVersion: 'latest',
          sourceType: 'module',
          ...(typeAware
            ? { projectService: true, tsconfigRootDir: tsconfigPath }
            : {}),
        },
      },
      plugins: {
        ts: tseslint.plugin as any,
      },
    },
    {
      files,
      name: 'renton/typescript/rules',
      rules: {
        ...tseslint.configs.eslintRecommended.rules,
        ...tseslint.configs.strict.rules,

        'no-dupe-class-members': 'off',
        'no-loss-of-precision': 'off',
        'no-redeclare': 'off',
        'no-unused-vars': 'off',

        'ts/ban-ts-comment': ['error', { 'ts-expect-error': 'allow-with-description', 'ts-ignore': true }],
        'ts/consistent-type-definitions': ['error', 'interface'],
        'ts/consistent-type-imports': ['error', { disallowTypeAnnotations: false, prefer: 'type-imports' }],
        'ts/no-dynamic-delete': 'off',
        'ts/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }],
        'ts/no-explicit-any': 'off',
        'ts/no-non-null-assertion': 'off',
        'ts/no-require-imports': 'off',
        'ts/no-unused-vars': ['error', { args: 'after-used', argsIgnorePattern: '^_', ignoreRestSiblings: true, vars: 'all', varsIgnorePattern: '^_' }],
        'ts/prefer-literal-enum-member': ['error', { allowBitwiseExpressions: true }],

        ...overrides,
      },
    },
    ...(typeAware
      ? [{
          files,
          name: 'renton/typescript/type-aware',
          rules: {
            ...typeAwareRules,
          },
        }]
      : []),
  ]
}
