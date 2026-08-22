# @renton/eslint-config 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建一个 monorepo 架构的 ESLint flat config 预设集合，包含 base（TypeScript 地基）、react、vue 三个包。

**Architecture:** 使用 pnpm workspaces 管理 monorepo，每个包独立构建。base 包提供完整的 TypeScript + ESLint Stylistic 配置，react/vue 包通过 peerDependencies 依赖 base 包并扩展框架特定规则。所有包使用 `FlatConfigComposer` 组合配置，支持插件重命名。

**Tech Stack:** TypeScript, ESLint 9 flat config, pnpm workspaces, tsdown, ESLint Stylistic, `eslint-flat-config-utils`

**Spec:** `docs/superpowers/specs/2026-08-22-eslint-config-design.md`

## Global Constraints

- ESM only 格式输出
- 所有包使用 `renton/<category>` 命名 config
- 插件重命名：`@typescript-eslint` → `ts`, `@stylistic` → `style`, `n` → `node`, `yml` → `yaml`, `import-lite` → `import`
- 每个 config 模块导出 async 函数，返回 `Promise<TypedFlatConfigItem[]>`
- 使用 `interopDefault` 处理 ESM/CJS 模块兼容

---

### Task 1: Monorepo 根目录脚手架

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.json`
- Create: `.gitignore`

**Interfaces:**
- Produces: workspace 根配置，后续所有任务依赖此结构

- [ ] **Step 1: 创建根 package.json**

```json
{
  "name": "@renton/eslint-config-monorepo",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@10.15.0",
  "scripts": {
    "build": "pnpm -r run build",
    "lint": "pnpm -r run lint",
    "release": "pnpm -r run release"
  },
  "devDependencies": {
    "tsdown": "^0.22.14",
    "typescript": "^7.0.2"
  }
}
```

- [ ] **Step 2: 创建 pnpm-workspace.yaml**

```yaml
packages:
  - packages/*
```

- [ ] **Step 3: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 4: 创建 .gitignore**

```
node_modules
dist
*.local
.DS_Store
```

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-workspace.yaml tsconfig.json .gitignore
git commit -m "chore: initialize monorepo scaffolding"
```

---

### Task 2: Base 包基础文件

**Files:**
- Create: `packages/base/package.json`
- Create: `packages/base/tsdown.config.ts`
- Create: `packages/base/tsconfig.json`
- Create: `packages/base/src/types.ts`
- Create: `packages/base/src/globs.ts`
- Create: `packages/base/src/utils.ts`
- Create: `packages/base/src/plugins.ts`

**Interfaces:**
- Produces: `TypedFlatConfigItem`, `OptionsConfig`, `StylisticOptions` 类型定义
- Produces: `GLOB_*` 常量
- Produces: `interopDefault`, `renameRules`, `renamePluginInConfigs` 工具函数
- Produces: 所有插件的统一导出

- [ ] **Step 1: 创建 packages/base/package.json**

```json
{
  "name": "@renton/eslint-config",
  "version": "0.0.0",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs"
    },
    "./utils": {
      "types": "./dist/utils.d.ts",
      "import": "./dist/utils.mjs"
    }
  },
  "main": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsdown",
    "lint": "eslint ."
  },
  "dependencies": {
    "@eslint-community/eslint-plugin-eslint-comments": "^4.7.2",
    "@eslint/js": "^10.0.1",
    "@eslint/markdown": "^8.0.3",
    "@stylistic/eslint-plugin": "^5.10.0",
    "eslint-config-flat-gitignore": "^2.3.0",
    "eslint-flat-config-utils": "^3.2.0",
    "eslint-plugin-antfu": "^3.2.3",
    "eslint-plugin-command": "^4.0.0",
    "eslint-plugin-import-lite": "^0.6.0",
    "eslint-plugin-jsdoc": "^64.2.1",
    "eslint-plugin-jsonc": "^3.4.1",
    "eslint-plugin-n": "^18.3.0",
    "eslint-plugin-perfectionist": "^5.10.1",
    "eslint-plugin-regexp": "^3.2.0",
    "eslint-plugin-unicorn": "^73.0.0",
    "eslint-plugin-unused-imports": "^4.4.1",
    "eslint-plugin-yml": "^3.8.1",
    "globals": "^17.11.0",
    "local-pkg": "^1.2.1",
    "typescript-eslint": "^8.67.0"
  },
  "devDependencies": {
    "eslint": "^10.9.0",
    "tsdown": "^0.22.14",
    "typescript": "^7.0.2"
  },
  "peerDependencies": {
    "eslint": "^9.0.0 || ^10.0.0"
  }
}
```

- [ ] **Step 2: 创建 packages/base/tsdown.config.ts**

```ts
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/utils.ts'],
  format: 'esm',
  dts: true,
  clean: true,
})
```

- [ ] **Step 3: 创建 packages/base/tsconfig.json**

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 4: 创建 packages/base/src/types.ts**

```ts
import type { Linter } from 'eslint'
import type { ConfigWithExtends } from 'eslint-flat-config-utils'

export type Awaitable<T> = T | Promise<T>

export type Rules = Record<string, Linter.RuleEntry<any> | undefined>

export type TypedFlatConfigItem = Omit<ConfigWithExtends, 'plugins' | 'rules'> & {
  plugins?: Record<string, any>
  rules?: Rules
}

export interface StylisticOptions {
  indent?: number | 'tab'
  quotes?: 'single' | 'double'
  semi?: boolean
  braceStyle?: '1tbs' | 'stroustrup' | 'allman'
}

export interface OptionsConfig {
  typescript?: boolean
  typeAware?: boolean
  stylistic?: boolean | StylisticOptions
  jsonc?: boolean
  yaml?: boolean
  markdown?: boolean
  jsdoc?: boolean
  node?: boolean
  regexp?: boolean
  unicorn?: boolean
  perfectionist?: boolean
  gitignore?: boolean
}

export interface OptionsOverrides {
  overrides?: Rules
}
```

- [ ] **Step 5: 创建 packages/base/src/globs.ts**

```ts
export const GLOB_SRC_EXT = '?([cm])[jt]s?(x)'
export const GLOB_SRC = '**/*.?([cm])[jt]s?(x)'

export const GLOB_JS = '**/*.?([cm])js'
export const GLOB_JSX = '**/*.?([cm])jsx'
export const GLOB_TS = '**/*.?([cm])ts'
export const GLOB_TSX = '**/*.?([cm])tsx'

export const GLOB_JSON = '**/*.json'
export const GLOB_JSON5 = '**/*.json5'
export const GLOB_JSONC = '**/*.jsonc'

export const GLOB_MARKDOWN = '**/*.md'
export const GLOB_YAML = '**/*.y?(a)ml'

export const GLOB_TESTS = [
  `**/__tests__/**/*.${GLOB_SRC_EXT}`,
  `**/*.spec.${GLOB_SRC_EXT}`,
  `**/*.test.${GLOB_SRC_EXT}`,
]

export const GLOB_EXCLUDE = [
  '**/node_modules',
  '**/dist',
  '**/package-lock.json',
  '**/yarn.lock',
  '**/pnpm-lock.yaml',
  '**/bun.lockb',
  '**/output',
  '**/coverage',
  '**/temp',
  '**/.temp',
  '**/tmp',
  '**/.tmp',
  '**/.history',
  '**/.cache',
  '**/.output',
  '**/CHANGELOG*.md',
  '**/LICENSE*',
  '**/*.min.*',
  '**/__snapshots__',
  '**/.context',
  '**/.claude',
  '**/.agents',
]
```

- [ ] **Step 6: 创建 packages/base/src/utils.ts**

```ts
import type { Awaitable, TypedFlatConfigItem } from './types'

export async function interopDefault<T>(m: Awaitable<T>): Promise<T extends { default: infer U } ? U : T> {
  const resolved = await m
  return (resolved as any).default || resolved
}

export function renameRules(
  rules: Record<string, any>,
  map: Record<string, string>,
): Record<string, any> {
  return Object.fromEntries(
    Object.entries(rules)
      .map(([key, value]) => {
        for (const [from, to] of Object.entries(map)) {
          if (key.startsWith(`${from}/`))
            return [to + key.slice(from.length), value]
        }
        return [key, value]
      }),
  )
}

export function renamePluginInConfigs(configs: TypedFlatConfigItem[], map: Record<string, string>): TypedFlatConfigItem[] {
  return configs.map((i) => {
    const clone = { ...i }
    if (clone.rules)
      clone.rules = renameRules(clone.rules, map)
    if (clone.plugins) {
      clone.plugins = Object.fromEntries(
        Object.entries(clone.plugins)
          .map(([key, value]) => {
            if (key in map)
              return [map[key], value]
            return [key, value]
          }),
      )
    }
    return clone
  })
}

export function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}

export const parserPlain = {
  meta: {
    name: 'parser-plain',
  },
  parseForESLint: (code: string) => ({
    ast: {
      body: [],
      comments: [],
      loc: { end: code.length, start: 0 },
      range: [0, code.length],
      tokens: [],
      type: 'Program',
    },
    scopeManager: null,
    services: { isPlain: true },
    visitorKeys: {
      Program: [],
    },
  }),
}
```

- [ ] **Step 7: 创建 packages/base/src/plugins.ts**

```ts
// @ts-nocheck

export { default as pluginComments } from '@eslint-community/eslint-plugin-eslint-comments'
export { default as pluginAntfu } from 'eslint-plugin-antfu'
export { default as pluginCommand } from 'eslint-plugin-command'
export { default as pluginImportLite } from 'eslint-plugin-import-lite'
export { default as pluginJsdoc } from 'eslint-plugin-jsdoc'
export { default as pluginJsonc } from 'eslint-plugin-jsonc'
export { default as pluginNode } from 'eslint-plugin-n'
export { default as pluginPerfectionist } from 'eslint-plugin-perfectionist'
export { default as pluginRegexp } from 'eslint-plugin-regexp'
export { default as pluginUnicorn } from 'eslint-plugin-unicorn'
export { default as pluginUnusedImports } from 'eslint-plugin-unused-imports'
export { default as pluginYaml } from 'eslint-plugin-yml'
```

- [ ] **Step 8: Commit**

```bash
git add packages/base/
git commit -m "feat(base): add foundation files (types, globs, utils, plugins)"
```

---

### Task 3: ignores 配置模块

**Files:**
- Create: `packages/base/src/configs/ignores.ts`

**Interfaces:**
- Consumes: `GLOB_EXCLUDE` from `../globs`
- Produces: `ignores()` → `Promise<TypedFlatConfigItem[]>`

- [ ] **Step 1: 创建 packages/base/src/configs/ignores.ts**

```ts
import type { TypedFlatConfigItem } from '../types'
import { GLOB_EXCLUDE } from '../globs'

export async function ignores(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      ignores: [...GLOB_EXCLUDE],
      name: 'renton/ignores',
    },
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/base/src/configs/ignores.ts
git commit -m "feat(base): add ignores config"
```

---

### Task 4: javascript 配置模块

**Files:**
- Create: `packages/base/src/configs/javascript.ts`

**Interfaces:**
- Consumes: `pluginAntfu`, `pluginUnusedImports` from `../plugins`
- Produces: `javascript()` → `Promise<TypedFlatConfigItem[]>`

- [ ] **Step 1: 创建 packages/base/src/configs/javascript.ts**

```ts
import type { OptionsOverrides, TypedFlatConfigItem } from '../types'
import globals from 'globals'
import { pluginAntfu, pluginUnusedImports } from '../plugins'

export async function javascript(options: OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
  } = options

  return [
    {
      languageOptions: {
        ecmaVersion: 'latest',
        globals: {
          ...globals.browser,
          ...globals.es2021,
          ...globals.node,
          document: 'readonly',
          navigator: 'readonly',
          window: 'readonly',
        },
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          ecmaVersion: 'latest',
          sourceType: 'module',
        },
        sourceType: 'module',
      },
      linterOptions: {
        reportUnusedDisableDirectives: true,
      },
      name: 'renton/javascript/setup',
    },
    {
      name: 'renton/javascript/rules',
      plugins: {
        'antfu': pluginAntfu,
        'unused-imports': pluginUnusedImports,
      },
      rules: {
        'accessor-pairs': ['error', { enforceForClassMembers: true, setWithoutGet: true }],
        'antfu/no-top-level-await': 'error',
        'array-callback-return': 'error',
        'block-scoped-var': 'error',
        'constructor-super': 'error',
        'default-case-last': 'error',
        'dot-notation': ['error', { allowKeywords: true }],
        'eqeqeq': ['error', 'smart'],
        'new-cap': ['error', { capIsNew: false, newIsCap: true, properties: true }],
        'no-alert': 'error',
        'no-array-constructor': 'error',
        'no-async-promise-executor': 'error',
        'no-caller': 'error',
        'no-case-declarations': 'error',
        'no-class-assign': 'error',
        'no-compare-neg-zero': 'error',
        'no-cond-assign': ['error', 'always'],
        'no-console': ['error', { allow: ['warn', 'error'] }],
        'no-const-assign': 'error',
        'no-control-regex': 'error',
        'no-debugger': 'error',
        'no-delete-var': 'error',
        'no-dupe-args': 'error',
        'no-dupe-class-members': 'error',
        'no-dupe-keys': 'error',
        'no-duplicate-case': 'error',
        'no-empty': ['error', { allowEmptyCatch: true }],
        'no-empty-character-class': 'error',
        'no-empty-pattern': 'error',
        'no-eval': 'error',
        'no-ex-assign': 'error',
        'no-extend-native': 'error',
        'no-extra-bind': 'error',
        'no-extra-boolean-cast': 'error',
        'no-fallthrough': 'error',
        'no-func-assign': 'error',
        'no-global-assign': 'error',
        'no-implied-eval': 'error',
        'no-import-assign': 'error',
        'no-invalid-regexp': 'error',
        'no-irregular-whitespace': 'error',
        'no-iterator': 'error',
        'no-labels': ['error', { allowLoop: false, allowSwitch: false }],
        'no-lone-blocks': 'error',
        'no-loss-of-precision': 'error',
        'no-misleading-character-class': 'error',
        'no-multi-str': 'error',
        'no-new': 'error',
        'no-new-func': 'error',
        'no-new-native-nonconstructor': 'error',
        'no-new-wrappers': 'error',
        'no-obj-calls': 'error',
        'no-octal': 'error',
        'no-octal-escape': 'error',
        'no-proto': 'error',
        'no-prototype-builtins': 'error',
        'no-redeclare': ['error', { builtinGlobals: false }],
        'no-regex-spaces': 'error',
        'no-restricted-globals': [
          'error',
          { message: 'Use `globalThis` instead.', name: 'global' },
          { message: 'Use `globalThis` instead.', name: 'self' },
        ],
        'no-restricted-properties': [
          'error',
          { message: 'Use `Object.getPrototypeOf` or `Object.setPrototypeOf` instead.', property: '__proto__' },
          { message: 'Use `Object.defineProperty` instead.', property: '__defineGetter__' },
          { message: 'Use `Object.defineProperty` instead.', property: '__defineSetter__' },
          { message: 'Use `Object.getOwnPropertyDescriptor` instead.', property: '__lookupGetter__' },
          { message: 'Use `Object.getOwnPropertyDescriptor` instead.', property: '__lookupSetter__' },
        ],
        'no-restricted-syntax': [
          'error',
          'TSEnumDeclaration[const=true]',
          'TSExportAssignment',
        ],
        'no-self-assign': ['error', { props: true }],
        'no-self-compare': 'error',
        'no-sequences': 'error',
        'no-shadow-restricted-names': 'error',
        'no-sparse-arrays': 'error',
        'no-template-curly-in-string': 'error',
        'no-this-before-super': 'error',
        'no-throw-literal': 'error',
        'no-undef': 'error',
        'no-undef-init': 'error',
        'no-unexpected-multiline': 'error',
        'no-unmodified-loop-condition': 'error',
        'no-unneeded-ternary': ['error', { defaultAssignment: false }],
        'no-unreachable': 'error',
        'no-unreachable-loop': 'error',
        'no-unsafe-finally': 'error',
        'no-unsafe-negation': 'error',
        'no-unused-expressions': ['error', {
          allowShortCircuit: true,
          allowTaggedTemplates: true,
          allowTernary: true,
        }],
        'no-unused-vars': ['error', {
          args: 'none',
          caughtErrors: 'none',
          ignoreRestSiblings: true,
          vars: 'all',
        }],
        'no-use-before-define': ['error', { classes: false, functions: false, variables: true }],
        'no-useless-backreference': 'error',
        'no-useless-call': 'error',
        'no-useless-catch': 'error',
        'no-useless-computed-key': 'error',
        'no-useless-constructor': 'error',
        'no-useless-rename': 'error',
        'no-useless-return': 'error',
        'no-var': 'error',
        'no-with': 'error',
        'object-shorthand': ['error', 'always', { avoidQuotes: true, ignoreConstructors: false }],
        'one-var': ['error', { initialized: 'never' }],
        'prefer-arrow-callback': ['error', { allowNamedFunctions: false, allowUnboundThis: true }],
        'prefer-const': ['error', { destructuring: 'all', ignoreReadBeforeAssign: true }],
        'prefer-exponentiation-operator': 'error',
        'prefer-promise-reject-errors': 'error',
        'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
        'prefer-rest-params': 'error',
        'prefer-spread': 'error',
        'prefer-template': 'error',
        'symbol-description': 'error',
        'unicode-bom': ['error', 'never'],
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
          'error',
          {
            args: 'after-used',
            argsIgnorePattern: '^_',
            ignoreRestSiblings: true,
            vars: 'all',
            varsIgnorePattern: '^_',
          },
        ],
        'use-isnan': ['error', { enforceForIndexOf: true, enforceForSwitchCase: true }],
        'valid-typeof': ['error', { requireStringLiterals: true }],
        'vars-on-top': 'error',
        'yoda': ['error', 'never'],
        ...overrides,
      },
    },
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/base/src/configs/javascript.ts
git commit -m "feat(base): add javascript config"
```

---

### Task 5: typescript 配置模块

**Files:**
- Create: `packages/base/src/configs/typescript.ts`

**Interfaces:**
- Consumes: `interopDefault` from `../utils`, `GLOB_TS`, `GLOB_TSX` from `../globs`
- Produces: `typescript(options)` → `Promise<TypedFlatConfigItem[]>`
- Options: `{ typeAware?: boolean, tsconfigPath?: string, overrides?: Rules }`

- [ ] **Step 1: 创建 packages/base/src/configs/typescript.ts**

```ts
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
```

- [ ] **Step 2: Commit**

```bash
git add packages/base/src/configs/typescript.ts
git commit -m "feat(base): add typescript config with type-aware support"
```

---

### Task 6: stylistic 配置模块

**Files:**
- Create: `packages/base/src/configs/stylistic.ts`

**Interfaces:**
- Consumes: `interopDefault` from `../utils`, `pluginAntfu` from `../plugins`
- Produces: `stylistic(options)` → `Promise<TypedFlatConfigItem[]>`
- Options: `StylisticOptions` from `../types`

- [ ] **Step 1: 创建 packages/base/src/configs/stylistic.ts**

```ts
import type { StylisticOptions, TypedFlatConfigItem } from '../types'
import { pluginAntfu } from '../plugins'
import { interopDefault } from '../utils'

const defaults: Required<StylisticOptions> = {
  braceStyle: 'stroustrup',
  indent: 2,
  quotes: 'single',
  semi: false,
}

export async function stylistic(options: StylisticOptions = {}): Promise<TypedFlatConfigItem[]> {
  const {
    braceStyle,
    indent,
    quotes,
    semi,
  } = { ...defaults, ...options }

  const pluginStylistic = await interopDefault(import('@stylistic/eslint-plugin'))

  const config = pluginStylistic.configs.customize({
    braceStyle,
    indent,
    jsx: true,
    pluginName: 'style',
    quotes,
    semi,
  }) as TypedFlatConfigItem

  return [
    {
      name: 'renton/stylistic/rules',
      plugins: {
        antfu: pluginAntfu,
        style: pluginStylistic,
      },
      rules: {
        ...config.rules,

        'antfu/consistent-chaining': 'error',
        'antfu/consistent-list-newline': 'error',
        'antfu/curly': 'error',
        'antfu/if-newline': 'error',
        'antfu/top-level-function': 'error',

        'style/generator-star-spacing': ['error', { after: true, before: false }],
        'style/yield-star-spacing': ['error', { after: true, before: false }],
      },
    },
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/base/src/configs/stylistic.ts
git commit -m "feat(base): add stylistic config"
```

---

### Task 7: imports 配置模块

**Files:**
- Create: `packages/base/src/configs/imports.ts`

**Interfaces:**
- Consumes: `pluginAntfu`, `pluginImportLite` from `../plugins`
- Produces: `imports()` → `Promise<TypedFlatConfigItem[]>`

- [ ] **Step 1: 创建 packages/base/src/configs/imports.ts**

```ts
import type { OptionsOverrides, TypedFlatConfigItem } from '../types'
import { pluginAntfu, pluginImportLite } from '../plugins'

export async function imports(options: OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
  } = options

  return [
    {
      name: 'renton/imports/rules',
      plugins: {
        antfu: pluginAntfu,
        import: pluginImportLite,
      },
      rules: {
        'antfu/import-dedupe': 'error',
        'antfu/no-import-dist': 'error',
        'antfu/no-import-node-modules-by-path': 'error',
        'import/consistent-type-specifier-style': ['error', 'top-level'],
        'import/first': 'error',
        'import/newline-after-import': ['error', { count: 1 }],
        'import/no-duplicates': 'error',
        'import/no-mutable-exports': 'error',
        'import/no-named-default': 'error',
        ...overrides,
      },
    },
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/base/src/configs/imports.ts
git commit -m "feat(base): add imports config"
```

---

### Task 8: node 配置模块

**Files:**
- Create: `packages/base/src/configs/node.ts`

**Interfaces:**
- Consumes: `interopDefault` from `../utils`
- Produces: `node()` → `Promise<TypedFlatConfigItem[]>`

- [ ] **Step 1: 创建 packages/base/src/configs/node.ts**

```ts
import type { OptionsOverrides, TypedFlatConfigItem } from '../types'
import { interopDefault } from '../utils'

export async function node(options: OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
  } = options

  const pluginNode = await interopDefault(import('eslint-plugin-n'))

  return [
    {
      name: 'renton/node/rules',
      plugins: {
        node: pluginNode,
      },
      rules: {
        'node/handle-callback-err': ['error', '^(err|error)$'],
        'node/no-deprecated-api': 'error',
        'node/no-exports-assign': 'error',
        'node/no-new-require': 'error',
        'node/no-path-concat': 'error',
        'node/process-exit-as-throw': 'error',
        ...overrides,
      },
    },
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/base/src/configs/node.ts
git commit -m "feat(base): add node config"
```

---

### Task 9: jsonc 配置模块

**Files:**
- Create: `packages/base/src/configs/jsonc.ts`

**Interfaces:**
- Consumes: `interopDefault` from `../utils`, `GLOB_JSON`, `GLOB_JSON5`, `GLOB_JSONC` from `../globs`
- Produces: `jsonc()` → `Promise<TypedFlatConfigItem[]>`

- [ ] **Step 1: 创建 packages/base/src/configs/jsonc.ts**

```ts
import type { OptionsOverrides, TypedFlatConfigItem } from '../types'
import { GLOB_JSON, GLOB_JSON5, GLOB_JSONC } from '../globs'
import { interopDefault } from '../utils'

export async function jsonc(options: OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
  } = options

  const pluginJsonc = await interopDefault(import('eslint-plugin-jsonc'))

  const files = [GLOB_JSON, GLOB_JSON5, GLOB_JSONC]

  return [
    {
      files,
      name: 'renton/jsonc/rules',
      plugins: {
        jsonc: pluginJsonc,
      },
      rules: {
        'jsonc/no-bigint-literals': 'error',
        'jsonc/no-binary-expression': 'error',
        'jsonc/no-binary-numeric-literals': 'error',
        'jsonc/no-dupe-keys': 'error',
        'jsonc/no-escape-sequence-in-identifier': 'error',
        'jsonc/no-number-props': 'error',
        'jsonc/no-numeric-separator-in-literals': 'error',
        'jsonc/no-parenthesized': 'error',
        'jsonc/no-plus-sign': 'error',
        'jsonc/no-regexp-literals': 'error',
        'jsonc/no-sparse-arrays': 'error',
        'jsonc/no-template-literals': 'error',
        'jsonc/no-undefined-value': 'error',
        'jsonc/no-unicode-codepoint-escapes': 'error',
        'jsonc/no-useless-escape': 'error',
        'jsonc/space-unary-ops': 'error',
        'jsonc/valid-json-number': 'error',
        'jsonc/vue-custom-block/no-parsing-error': 'error',
        ...overrides,
      },
    },
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/base/src/configs/jsonc.ts
git commit -m "feat(base): add jsonc config"
```

---

### Task 10: yaml 配置模块

**Files:**
- Create: `packages/base/src/configs/yaml.ts`

**Interfaces:**
- Consumes: `interopDefault` from `../utils`, `GLOB_YAML` from `../globs`
- Produces: `yaml()` → `Promise<TypedFlatConfigItem[]>`

- [ ] **Step 1: 创建 packages/base/src/configs/yaml.ts**

```ts
import type { OptionsOverrides, TypedFlatConfigItem } from '../types'
import { GLOB_YAML } from '../globs'
import { interopDefault } from '../utils'

export async function yaml(options: OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
  } = options

  const pluginYaml = await interopDefault(import('eslint-plugin-yml'))

  return [
    {
      files: [GLOB_YAML],
      name: 'renton/yaml/rules',
      plugins: {
        yaml: pluginYaml,
      },
      rules: {
        'yaml/block-mapping': 'error',
        'yaml/block-sequence': 'error',
        'yaml/no-empty-document': 'error',
        'yaml/no-empty-key': 'error',
        'yaml/no-empty-mapping-value': 'error',
        'yaml/no-empty-sequence-entry': 'error',
        'yaml/no-irregular-whitespace': 'error',
        'yaml/no-multiple-anchors': 'error',
        'yaml/no-null-key': 'error',
        'yaml/no-null-value': 'error',
        'yaml/no-tab-indent': 'error',
        'yaml/plain-scalar': 'error',
        'yaml/vue-custom-block/no-parsing-error': 'error',
        ...overrides,
      },
    },
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/base/src/configs/yaml.ts
git commit -m "feat(base): add yaml config"
```

---

### Task 11: markdown 配置模块

**Files:**
- Create: `packages/base/src/configs/markdown.ts`

**Interfaces:**
- Consumes: `interopDefault`, `parserPlain` from `../utils`, `GLOB_MARKDOWN` from `../globs`
- Produces: `markdown()` → `Promise<TypedFlatConfigItem[]>`

- [ ] **Step 1: 创建 packages/base/src/configs/markdown.ts**

```ts
import type { TypedFlatConfigItem } from '../types'
import { GLOB_MARKDOWN } from '../globs'
import { interopDefault, parserPlain } from '../utils'

export async function markdown(): Promise<TypedFlatConfigItem[]> {
  const pluginMarkdown = await interopDefault(import('@eslint/markdown'))

  return [
    {
      files: [GLOB_MARKDOWN],
      name: 'renton/markdown/setup',
      plugins: {
        markdown: pluginMarkdown,
      },
    },
    {
      files: [GLOB_MARKDOWN],
      languageOptions: {
        parser: parserPlain as any,
      },
      name: 'renton/markdown/parser',
    },
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/base/src/configs/markdown.ts
git commit -m "feat(base): add markdown config"
```

---

### Task 12: jsdoc 配置模块

**Files:**
- Create: `packages/base/src/configs/jsdoc.ts`

**Interfaces:**
- Consumes: `interopDefault` from `../utils`
- Produces: `jsdoc()` → `Promise<TypedFlatConfigItem[]>`

- [ ] **Step 1: 创建 packages/base/src/configs/jsdoc.ts**

```ts
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
```

- [ ] **Step 2: Commit**

```bash
git add packages/base/src/configs/jsdoc.ts
git commit -m "feat(base): add jsdoc config"
```

---

### Task 13: regexp 配置模块

**Files:**
- Create: `packages/base/src/configs/regexp.ts`

**Interfaces:**
- Consumes: `interopDefault` from `../utils`
- Produces: `regexp()` → `Promise<TypedFlatConfigItem[]>`

- [ ] **Step 1: 创建 packages/base/src/configs/regexp.ts**

```ts
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
```

- [ ] **Step 2: Commit**

```bash
git add packages/base/src/configs/regexp.ts
git commit -m "feat(base): add regexp config"
```

---

### Task 14: unicorn 配置模块

**Files:**
- Create: `packages/base/src/configs/unicorn.ts`

**Interfaces:**
- Consumes: `interopDefault` from `../utils`
- Produces: `unicorn()` → `Promise<TypedFlatConfigItem[]>`

- [ ] **Step 1: 创建 packages/base/src/configs/unicorn.ts**

```ts
import type { OptionsOverrides, TypedFlatConfigItem } from '../types'
import { interopDefault } from '../utils'

export async function unicorn(options: OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
  } = options

  const pluginUnicorn = await interopDefault(import('eslint-plugin-unicorn'))

  return [
    {
      name: 'renton/unicorn/rules',
      plugins: {
        unicorn: pluginUnicorn,
      },
      rules: {
        ...pluginUnicorn.configs.recommended.rules,

        'unicorn/consistent-destructuring': 'off',
        'unicorn/no-array-for-each': 'off',
        'unicorn/no-array-reduce': 'off',
        'unicorn/no-await-expression-member': 'off',
        'unicorn/no-null': 'off',
        'unicorn/no-process-exit': 'off',
        'unicorn/numeric-separators-style': 'off',
        'unicorn/prefer-at': 'off',
        'unicorn/prefer-module': 'off',
        'unicorn/prefer-top-level-await': 'off',
        'unicorn/prevent-abbreviations': 'off',

        ...overrides,
      },
    },
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/base/src/configs/unicorn.ts
git commit -m "feat(base): add unicorn config"
```

---

### Task 15: perfectionist 配置模块

**Files:**
- Create: `packages/base/src/configs/perfectionist.ts`

**Interfaces:**
- Consumes: `interopDefault` from `../utils`
- Produces: `perfectionist()` → `Promise<TypedFlatConfigItem[]>`

- [ ] **Step 1: 创建 packages/base/src/configs/perfectionist.ts**

```ts
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
```

- [ ] **Step 2: Commit**

```bash
git add packages/base/src/configs/perfectionist.ts
git commit -m "feat(base): add perfectionist config"
```

---

### Task 16: factory.ts 和 index.ts（Base 包入口）

**Files:**
- Create: `packages/base/src/factory.ts`
- Create: `packages/base/src/index.ts`

**Interfaces:**
- Consumes: 所有 configs/* 模块, `renamePluginInConfigs` from `./utils`, `OptionsConfig` from `./types`
- Produces: `renton(options, ...userConfigs)` 工厂函数
- Produces: 包的公共 API 导出

- [ ] **Step 1: 创建 packages/base/src/factory.ts**

```ts
import type { OptionsConfig, TypedFlatConfigItem } from './types'
import { FlatConfigComposer } from 'eslint-flat-config-utils'
import { ignores } from './configs/ignores'
import { javascript } from './configs/javascript'
import { jsdoc } from './configs/jsdoc'
import { jsonc } from './configs/jsonc'
import { markdown } from './configs/markdown'
import { node } from './configs/node'
import { perfectionist } from './configs/perfectionist'
import { regexp } from './configs/regexp'
import { stylistic } from './configs/stylistic'
import { typescript } from './configs/typescript'
import { unicorn } from './configs/unicorn'
import { yaml } from './configs/yaml'
import { imports } from './configs/imports'

export const PLUGIN_RENAMING: Record<string, string> = {
  '@typescript-eslint': 'ts',
  '@stylistic': 'style',
  'import-lite': 'import',
  'n': 'node',
  'yml': 'yaml',
}

export async function renton(
  options: OptionsConfig & { overrides?: TypedFlatConfigItem[] } = {},
  ...userConfigs: TypedFlatConfigItem[]
): Promise<TypedFlatConfigItem[]> {
  const {
    gitignore = true,
    jsonc: enableJsonc = true,
    jsdoc: enableJsdoc = true,
    markdown: enableMarkdown = true,
    node: enableNode = true,
    overrides,
    perfectionist: enablePerfectionist = true,
    regexp: enableRegexp = true,
    stylistic: enableStylistic = true,
    typeAware = false,
    typescript: enableTypescript = true,
    unicorn: enableUnicorn = true,
    yaml: enableYaml = true,
  } = options

  const stylisticOptions = typeof enableStylistic === 'object' ? enableStylistic : undefined

  const configs: TypedFlatConfigItem[][] = []

  configs.push(ignores())

  if (gitignore) {
    const { default: gitignorePlugin } = await import('eslint-config-flat-gitignore')
    configs.push(
      Promise.resolve([
        {
          ...gitignorePlugin(),
          name: 'renton/gitignore',
        },
      ] as TypedFlatConfigItem[]),
    )
  }

  configs.push(javascript())
  configs.push(imports())

  if (enableTypescript) {
    configs.push(typescript({
      typeAware,
      overrides: overrides?.find(c => c.name === 'renton/typescript/rules')?.rules,
    }))
  }

  if (enableStylistic) {
    configs.push(stylistic(stylisticOptions))
  }

  if (enableNode) {
    configs.push(node())
  }

  if (enableJsonc) {
    configs.push(jsonc())
  }

  if (enableYaml) {
    configs.push(yaml())
  }

  if (enableMarkdown) {
    configs.push(markdown())
  }

  if (enableJsdoc) {
    configs.push(jsdoc())
  }

  if (enableRegexp) {
    configs.push(regexp())
  }

  if (enableUnicorn) {
    configs.push(unicorn())
  }

  if (enablePerfectionist) {
    configs.push(perfectionist())
  }

  const composer = new FlatConfigComposer<TypedFlatConfigItem, string>(...configs)

  composer.renamePlugins(PLUGIN_RENAMING)

  if (userConfigs.length > 0) {
    composer.append(...userConfigs)
  }

  return composer.compose()
}
```

- [ ] **Step 2: 创建 packages/base/src/index.ts**

```ts
export { renton } from './factory'
export type { OptionsConfig, StylisticOptions, TypedFlatConfigItem } from './types'
```

- [ ] **Step 3: Commit**

```bash
git add packages/base/src/factory.ts packages/base/src/index.ts
git commit -m "feat(base): add factory function and public API"
```

---

### Task 17: React 包

**Files:**
- Create: `packages/react/package.json`
- Create: `packages/react/tsdown.config.ts`
- Create: `packages/react/tsconfig.json`
- Create: `packages/react/src/types.ts`
- Create: `packages/react/src/globs.ts`
- Create: `packages/react/src/configs/react.ts`
- Create: `packages/react/src/configs/next.ts`
- Create: `packages/react/src/factory.ts`
- Create: `packages/react/src/index.ts`

**Interfaces:**
- Consumes: `@renton/eslint-config` 的 `renton()` 工厂函数和所有类型
- Produces: `rentonReact(options, ...userConfigs)` 工厂函数
- Plugin renaming: `@eslint-react` → `react`

- [ ] **Step 1: 创建 packages/react/package.json**

```json
{
  "name": "@renton/eslint-config-react",
  "version": "0.0.0",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs"
    }
  },
  "main": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsdown",
    "lint": "eslint ."
  },
  "dependencies": {
    "@eslint-react/eslint-plugin": "^5.18.6",
    "@next/eslint-plugin-next": "^16.3.2",
    "@renton/eslint-config": "workspace:*",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.4"
  },
  "devDependencies": {
    "eslint": "^10.9.0",
    "tsdown": "^0.22.14",
    "typescript": "^7.0.2"
  },
  "peerDependencies": {
    "@renton/eslint-config": "workspace:*",
    "eslint": "^9.0.0 || ^10.0.0"
  }
}
```

- [ ] **Step 2: 创建 packages/react/tsdown.config.ts**

```ts
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  dts: true,
  clean: true,
})
```

- [ ] **Step 3: 创建 packages/react/tsconfig.json**

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 4: 创建 packages/react/src/types.ts**

```ts
import type { OptionsConfig, TypedFlatConfigItem } from '@renton/eslint-config'

export interface OptionsReact extends OptionsConfig {
  react?: boolean
  next?: boolean
  reactVersion?: string
}

export type { TypedFlatConfigItem }
```

- [ ] **Step 5: 创建 packages/react/src/globs.ts**

```ts
export const GLOB_REACT = '**/*.?([cm])jsx'
export const GLOB_REACT_TS = '**/*.?([cm])tsx'
```

- [ ] **Step 6: 创建 packages/react/src/configs/react.ts**

```ts
import type { OptionsOverrides, TypedFlatConfigItem } from '@renton/eslint-config'
import { interopDefault } from '@renton/eslint-config/utils'
import { GLOB_REACT, GLOB_REACT_TS } from '../globs'

export async function react(options: OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
  } = options

  const pluginReact = await interopDefault(import('@eslint-react/eslint-plugin'))
  const pluginReactHooks = await interopDefault(import('eslint-plugin-react-hooks'))
  const pluginReactRefresh = await interopDefault(import('eslint-plugin-react-refresh'))

  const files = [GLOB_REACT, GLOB_REACT_TS]

  return [
    {
      files,
      name: 'renton/react/setup',
      plugins: {
        'react': pluginReact,
        'react-hooks': pluginReactHooks,
        'react-refresh': pluginReactRefresh,
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
    {
      files,
      name: 'renton/react/rules',
      rules: {
        ...pluginReact.configs.recommended.rules,
        'react-hooks/exhaustive-deps': 'warn',
        'react-hooks/rules-of-hooks': 'error',
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        ...overrides,
      },
    },
  ]
}
```

- [ ] **Step 7: 创建 packages/react/src/configs/next.ts**

```ts
import type { OptionsOverrides, TypedFlatConfigItem } from '@renton/eslint-config'
import { interopDefault } from '@renton/eslint-config/utils'

export async function next(options: OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
  } = options

  const pluginNext = await interopDefault(import('@next/eslint-plugin-next'))

  return [
    {
      name: 'renton/next/rules',
      plugins: {
        next: pluginNext,
      },
      rules: {
        'next/google-font-display': 'error',
        'next/google-font-preconnect': 'error',
        'next/inline-script-id': 'error',
        'next/next-script-for-ga': 'error',
        'next/no-assign-module-variable': 'error',
        'next/no-before-interactive-script-outside-document': 'error',
        'next/no-css-tags': 'error',
        'next/no-document-import-in-page': 'error',
        'next/no-duplicate-head': 'error',
        'next/no-head-element': 'error',
        'next/no-head-import-in-document': 'error',
        'next/no-html-link-for-pages': 'error',
        'next/no-img-element': 'error',
        'next/no-page-custom-font': 'error',
        'next/no-script-component-in-head': 'error',
        'next/no-styled-jsx-in-document': 'error',
        'next/no-sync-scripts': 'error',
        'next/no-title-in-document-head': 'error',
        'next/no-typos': 'error',
        'next/no-unwanted-polyfillio': 'error',
        ...overrides,
      },
    },
  ]
}
```

- [ ] **Step 8: 创建 packages/react/src/factory.ts**

```ts
import type { OptionsReact, TypedFlatConfigItem } from './types'
import { renton } from '@renton/eslint-config'
import { renamePluginInConfigs } from '@renton/eslint-config/utils'
import { next } from './configs/next'
import { react } from './configs/react'

export const PLUGIN_RENAMING_REACT: Record<string, string> = {
  '@eslint-react': 'react',
}

export async function rentonReact(
  options: OptionsReact = {},
  ...userConfigs: TypedFlatConfigItem[]
): Promise<TypedFlatConfigItem[]> {
  const {
    next: enableNext = false,
    ...baseOptions
  } = options

  const baseConfigs = await renton(baseOptions)

  const reactConfigs = await react()
  const configs: TypedFlatConfigItem[] = [...reactConfigs]

  if (enableNext) {
    configs.push(...(await next()))
  }

  const renamedConfigs = renamePluginInConfigs(configs, PLUGIN_RENAMING_REACT)
  const allConfigs = [...baseConfigs, ...renamedConfigs]

  if (userConfigs.length > 0) {
    allConfigs.push(...userConfigs)
  }

  return allConfigs
}
```

- [ ] **Step 9: 创建 packages/react/src/index.ts**

```ts
export { rentonReact } from './factory'
export type { OptionsReact } from './types'
```

- [ ] **Step 10: Commit**

```bash
git add packages/react/
git commit -m "feat(react): add React config package with Next.js support"
```

---

### Task 18: Vue 包

**Files:**
- Create: `packages/vue/package.json`
- Create: `packages/vue/tsdown.config.ts`
- Create: `packages/vue/tsconfig.json`
- Create: `packages/vue/src/types.ts`
- Create: `packages/vue/src/globs.ts`
- Create: `packages/vue/src/configs/vue.ts`
- Create: `packages/vue/src/factory.ts`
- Create: `packages/vue/src/index.ts`

**Interfaces:**
- Consumes: `@renton/eslint-config` 的 `renton()` 工厂函数和所有类型
- Produces: `rentonVue(options, ...userConfigs)` 工厂函数
- Plugin renaming: `vue` → `vue`

- [ ] **Step 1: 创建 packages/vue/package.json**

```json
{
  "name": "@renton/eslint-config-vue",
  "version": "0.0.0",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs"
    }
  },
  "main": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsdown",
    "lint": "eslint ."
  },
  "dependencies": {
    "@renton/eslint-config": "workspace:*",
    "eslint-plugin-vue": "^10.10.0",
    "vue-eslint-parser": "^10.4.1"
  },
  "devDependencies": {
    "eslint": "^10.9.0",
    "tsdown": "^0.22.14",
    "typescript": "^7.0.2"
  },
  "peerDependencies": {
    "@renton/eslint-config": "workspace:*",
    "eslint": "^9.0.0 || ^10.0.0"
  }
}
```

- [ ] **Step 2: 创建 packages/vue/tsdown.config.ts**

```ts
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  dts: true,
  clean: true,
})
```

- [ ] **Step 3: 创建 packages/vue/tsconfig.json**

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 4: 创建 packages/vue/src/types.ts**

```ts
import type { OptionsConfig, TypedFlatConfigItem } from '@renton/eslint-config'

export interface OptionsVue extends OptionsConfig {
  vue?: boolean
  vueVersion?: 2 | 3
}

export type { TypedFlatConfigItem }
```

- [ ] **Step 5: 创建 packages/vue/src/globs.ts**

```ts
export const GLOB_VUE = '**/*.vue'
```

- [ ] **Step 6: 创建 packages/vue/src/configs/vue.ts**

```ts
import type { OptionsOverrides, TypedFlatConfigItem } from '@renton/eslint-config'
import { interopDefault } from '@renton/eslint-config/utils'
import { GLOB_VUE } from '../globs'

export interface OptionsVueConfig extends OptionsOverrides {
  vueVersion?: 2 | 3
}

export async function vue(options: OptionsVueConfig = {}): Promise<TypedFlatConfigItem[]> {
  const {
    vueVersion = 3,
    overrides = {},
  } = options

  const pluginVue = await interopDefault(import('eslint-plugin-vue'))

  const vueConfigs = vueVersion === 3
    ? pluginVue.configs['flat/recommended']
    : pluginVue.configs['flat/vue2-recommended']

  return [
    ...vueConfigs.map((config: any, index: number) => ({
      ...config,
      name: `renton/vue/setup/${index}`,
    })),
    {
      files: [GLOB_VUE],
      name: 'renton/vue/rules',
      rules: {
        'vue/attribute-hyphenation': 'error',
        'vue/attributes-order': 'error',
        'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
        'vue/define-macros-order': ['error', { order: ['defineProps', 'defineEmits'] }],
        'vue/html-closing-bracket-newline': 'error',
        'vue/html-closing-bracket-spacing': 'error',
        'vue/html-end-tags': 'error',
        'vue/html-indent': ['error', 2],
        'vue/html-quotes': ['error', 'double'],
        'vue/html-self-closing': 'error',
        'vue/max-attributes-per-line': 'off',
        'vue/multi-word-component-names': 'off',
        'vue/multiline-html-element-content-newline': 'error',
        'vue/mustache-interpolation-spacing': 'error',
        'vue/no-extra-parens': 'error',
        'vue/no-irregular-whitespace': 'error',
        'vue/no-multi-spaces': 'error',
        'vue/no-multiple-template-root': 'error',
        'vue/no-spaces-around-equal-signs-in-attribute': 'error',
        'vue/no-template-key': 'error',
        'vue/no-textarea-mustache': 'error',
        'vue/no-unused-components': 'error',
        'vue/no-unused-vars': 'error',
        'vue/no-use-v-if-with-v-for': 'error',
        'vue/no-v-html': 'error',
        'vue/no-v-text-v-html-on-component': 'error',
        'vue/one-component-per-file': 'error',
        'vue/order-in-components': 'error',
        'vue/prop-name-casing': 'error',
        'vue/require-default-prop': 'error',
        'vue/require-explicit-emits': 'error',
        'vue/require-prop-types': 'error',
        'vue/singleline-html-element-content-newline': 'off',
        'vue/v-bind-style': 'error',
        'vue/v-on-event-hyphenation': 'error',
        'vue/v-on-style': 'error',
        'vue/v-slot-style': 'error',
        'vue/valid-template-root': 'error',
        ...overrides,
      },
    },
  ]
}
```

- [ ] **Step 7: 创建 packages/vue/src/factory.ts**

```ts
import type { OptionsVue, TypedFlatConfigItem } from './types'
import { renton } from '@renton/eslint-config'
import { vue } from './configs/vue'

export async function rentonVue(
  options: OptionsVue = {},
  ...userConfigs: TypedFlatConfigItem[]
): Promise<TypedFlatConfigItem[]> {
  const {
    vue: enableVue = true,
    vueVersion = 3,
    ...baseOptions
  } = options

  const baseConfigs = await renton(baseOptions)

  const vueConfigs = enableVue
    ? await vue({ vueVersion })
    : []

  const allConfigs = [...baseConfigs, ...vueConfigs]

  if (userConfigs.length > 0) {
    allConfigs.push(...userConfigs)
  }

  return allConfigs
}
```

- [ ] **Step 8: 创建 packages/vue/src/index.ts**

```ts
export { rentonVue } from './factory'
export type { OptionsVue } from './types'
```

- [ ] **Step 9: Commit**

```bash
git add packages/vue/
git commit -m "feat(vue): add Vue config package"
```

---

### Task 19: 安装依赖并构建验证

**Files:**
- Modify: `packages/base/package.json` (如需调整依赖版本)

- [ ] **Step 1: 安装所有依赖**

```bash
cd E:/work/new/eslint-config
pnpm install
```

- [ ] **Step 2: 构建所有包**

```bash
pnpm build
```

Expected: 三个包均构建成功，各自 `dist/` 目录生成 `.mjs` 和 `.d.ts` 文件。

- [ ] **Step 3: 检查构建产物**

```bash
ls packages/base/dist/
ls packages/react/dist/
ls packages/vue/dist/
```

Expected: 每个目录包含 `index.mjs` 和 `index.d.ts`。

- [ ] **Step 4: 验证类型导出**

```bash
node -e "import('@renton/eslint-config').then(m => console.log(Object.keys(m)))"
```

Expected: 输出包含 `['renton']`。

- [ ] **Step 5: 修复发现的问题**

如有构建错误或类型错误，修复后重新构建验证。

- [ ] **Step 6: Final Commit**

```bash
git add -A
git commit -m "chore: verify build and fix issues"
```
