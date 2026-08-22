# @renton/eslint-config 设计文档

## 概述

创建一个 monorepo 架构的 ESLint flat config 预设集合，包含三个包：

- `@renton/eslint-config` — TypeScript 地基包
- `@renton/eslint-config-react` — React 扩展包
- `@renton/eslint-config-vue` — Vue 扩展包

参考项目：`@antfu/eslint-config`（架构模式、插件重命名、ESLint Stylistic）和 `@sxzz/eslint-config`（简洁严格风格、composable presets）。

## 核心决策

| 决策项 | 选择 | 理由 |
|---|---|---|
| 格式化方案 | ESLint Stylistic | 不依赖 Prettier，更可控 |
| 包管理器 | pnpm workspaces | 生态成熟，和参考项目一致 |
| 构建工具 | tsdown | 轻量快速，和参考项目一致 |
| 插件重命名 | 是 | DX 更好（`ts/`、`style/`、`node/`） |
| TypeScript | 支持 type-aware | 更强的类型检查能力 |
| 配置风格 | 简洁严格 | 更少选项，更严格的默认值 |
| 模块格式 | ESM only + DTS | 现代标准 |

## 仓库结构

```
eslint-config/
├── packages/
│   ├── base/                    # @renton/eslint-config
│   │   ├── src/
│   │   │   ├── index.ts         # 入口，导出工厂函数
│   │   │   ├── factory.ts       # 工厂函数实现
│   │   │   ├── configs/
│   │   │   │   ├── ignores.ts
│   │   │   │   ├── javascript.ts
│   │   │   │   ├── typescript.ts
│   │   │   │   ├── stylistic.ts
│   │   │   │   ├── imports.ts
│   │   │   │   ├── node.ts
│   │   │   │   ├── jsonc.ts
│   │   │   │   ├── markdown.ts
│   │   │   │   ├── jsdoc.ts
│   │   │   │   ├── regexp.ts
│   │   │   │   ├── unicorn.ts
│   │   │   │   └── perfectionist.ts
│   │   │   ├── types.ts
│   │   │   ├── globs.ts
│   │   │   ├── utils.ts
│   │   │   └── plugins.ts
│   │   ├── package.json
│   │   └── tsdown.config.ts
│   ├── react/                   # @renton/eslint-config-react
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── factory.ts
│   │   │   ├── configs/
│   │   │   │   ├── react.ts
│   │   │   │   └── next.ts      # 可选 Next.js 支持
│   │   │   ├── types.ts
│   │   │   └── globs.ts
│   │   └── package.json
│   └── vue/                     # @renton/eslint-config-vue
│       ├── src/
│       │   ├── index.ts
│       │   ├── factory.ts
│       │   ├── configs/
│       │   │   └── vue.ts
│       │   ├── types.ts
│       │   └── globs.ts
│       └── package.json
├── pnpm-workspace.yaml
├── package.json
└── tsconfig.json
```

## 工厂函数 API

### 基础包 `@renton/eslint-config`

```ts
import { renton } from '@renton/eslint-config'

export default renton({
  // 功能开关（均为可选，有合理默认值）
  typescript: true,         // 默认: 自动检测
  typeAware: true,          // 默认: false（需要 tsconfig）
  stylistic: true,          // 默认: true
  stylisticOptions: {
    indent: 2,              // 2 | 4 | 'tab'
    quotes: 'single',       // 'single' | 'double'
    semi: false,            // 默认无分号
  },
  jsonc: true,              // 默认: true
  markdown: true,           // 默认: true
  jsdoc: true,              // 默认: true
  node: true,               // 默认: true
  regexp: true,             // 默认: true
  unicorn: true,            // 默认: true
  perfectionist: true,      // 默认: true
  gitignore: true,          // 默认: true
}, ...userConfigs)
```

### React 包 `@renton/eslint-config-react`

```ts
import { rentonReact } from '@renton/eslint-config-react'

export default rentonReact({
  // 继承基础包的所有选项
  ...baseOptions,
  // React 特有选项
  react: true,              // 默认: true
  next: false,              // 默认: false
  reactVersion: '19',       // 默认: 自动检测
}, ...userConfigs)
```

### Vue 包 `@renton/eslint-config-vue`

```ts
import { rentonVue } from '@renton/eslint-config-vue'

export default rentonVue({
  // 继承基础包的所有选项
  ...baseOptions,
  // Vue 特有选项
  vue: true,                // 默认: true
  vueVersion: 3,            // 默认: 3
}, ...userConfigs)
```

## 插件重命名映射

```ts
const PLUGIN_RENAMING = {
  '@typescript-eslint': 'ts',
  '@stylistic': 'style',
  'import-lite': 'import',
  'n': 'node',
  'yml': 'yaml',
  'vue': 'vue',               // Vue 包
  '@eslint-react': 'react',   // React 包
}
```

## Config 命名规范

使用 `renton/<category>` 或 `renton/<category>/<sub>` 格式：

```
renton/ignores
renton/javascript
renton/typescript
renton/typescript/type-aware
renton/stylistic
renton/imports
renton/node
renton/jsonc
renton/markdown
renton/jsdoc
renton/regexp
renton/unicorn
renton/perfectionist

renton/react              # React 包
renton/next               # React 包（可选）

renton/vue                # Vue 包
```

## 各 Config 模块职责

### base 包 configs

| 模块 | 职责 | 主要插件 |
|---|---|---|
| `ignores.ts` | 全局忽略模式（node_modules、dist、.gitignore） | `eslint-config-flat-gitignore` |
| `javascript.ts` | JS 基础规则 + globals 配置 | `@eslint/js`, `globals` |
| `typescript.ts` | TS 规则，含 type-aware 支持 | `typescript-eslint` |
| `stylistic.ts` | 代码格式化规则 | `@stylistic/eslint-plugin` |
| `imports.ts` | import 排序和规范 | `eslint-plugin-import-lite` |
| `node.ts` | Node.js 相关规则 | `eslint-plugin-n` |
| `jsonc.ts` | JSON/YAML 文件规则 | `eslint-plugin-jsonc`, `eslint-plugin-yml` |
| `markdown.ts` | Markdown 中的代码块 lint | `@eslint/markdown` |
| `jsdoc.ts` | JSDoc 注释规则 | `eslint-plugin-jsdoc` |
| `regexp.ts` | 正则表达式最佳实践 | `eslint-plugin-regexp` |
| `unicorn.ts` | 通用最佳实践规则（精选） | `eslint-plugin-unicorn` |
| `perfectionist.ts` | 代码排序规则 | `eslint-plugin-perfectionist` |

### React 包 configs

| 模块 | 职责 | 主要插件 |
|---|---|---|
| `react.ts` | React 核心规则 + Hooks 规则 | `@eslint-react/eslint-plugin`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` |
| `next.ts` | Next.js 特有规则 | `@next/eslint-plugin-next` |

### Vue 包 configs

| 模块 | 职责 | 主要插件 |
|---|---|---|
| `vue.ts` | Vue 核心规则 + Vue TS 支持 | `eslint-plugin-vue`, `vue-eslint-parser` |

## 类型系统

```ts
// base/src/types.ts
import type { Linter } from 'eslint'

export interface TypedFlatConfigItem extends Linter.Config {
  // 放宽 plugins 和 rules 的类型，便于扩展
  plugins?: Record<string, any>
  rules?: Linter.RulesRecord & Record<string, any>
}

export interface OptionsConfig {
  typescript?: boolean
  typeAware?: boolean
  stylistic?: boolean | StylisticOptions
  jsonc?: boolean
  markdown?: boolean
  jsdoc?: boolean
  node?: boolean
  regexp?: boolean
  unicorn?: boolean
  perfectionist?: boolean
  gitignore?: boolean
}

export interface StylisticOptions {
  indent?: number | 'tab'
  quotes?: 'single' | 'double'
  semi?: boolean
}
```

## Glob 模式

```ts
// base/src/globs.ts
export const GLOB_JS = ['**/*.?([cm])js', '**/*.?([cm])jsx']
export const GLOB_TS = ['**/*.?([cm])ts', '**/*.?([cm])tsx']
export const GLOB_TSX = ['**/*.?([cm])tsx']
export const GLOB_VUE = ['**/*.vue']
export const GLOB_REACT = ['**/*.?([cm])jsx', '**/*.?([cm])tsx']
export const GLOB_JSON = ['**/*.json', '**/*.json5', '**/*.jsonc']
export const GLOB_YAML = ['**/*.ya?ml']
export const GLOB_MARKDOWN = ['**/*.md']
export const GLOB_TESTS = ['**/*.test.*', '**/*.spec.*']

export const GLOB_EXCLUDE = [
  'node_modules',
  'dist',
  '.git',
  '*.min',
  '*.d.ts',
]
```

## 包间依赖关系

```
@renton/eslint-config-vue    ──┐
                                ├──▶  @renton/eslint-config（地基）
@renton/eslint-config-react  ──┘
```

- 基础包独立可用，不依赖其他两个包
- React/Vue 包通过 `peerDependencies` 声明对基础包的依赖
- 用户可以只用地基包，也可以搭配任一扩展包

## 用户使用示例

### 纯 TypeScript 项目

```ts
// eslint.config.ts
import { renton } from '@renton/eslint-config'

export default renton()
```

### Vue 项目

```ts
// eslint.config.ts
import { rentonVue } from '@renton/eslint-config-vue'

export default rentonVue()
```

### React 项目

```ts
// eslint.config.ts
import { rentonReact } from '@renton/eslint-config-react'

export default rentonReact({
  next: true,  // 启用 Next.js 支持
})
```

### 自定义覆盖

```ts
// eslint.config.ts
import { renton } from '@renton/eslint-config'

export default renton({
  typescript: true,
  stylistic: { semi: true },  // 用分号
}, {
  rules: {
    'no-console': 'off',
  },
})
```

## 技术依赖

### 核心依赖（所有包共享）

- `eslint-flat-config-utils` — FlatConfigComposer
- `eslint-config-flat-gitignore` — gitignore 集成
- `@eslint/js` — JS 基础规则
- `globals` — 全局变量定义
- `typescript-eslint` — TypeScript 支持
- `@stylistic/eslint-plugin` — 代码格式化
- `eslint-plugin-import-lite` — import 规范
- `eslint-plugin-n` — Node.js 规则
- `eslint-plugin-jsonc` — JSON 规则
- `eslint-plugin-yml` — YAML 规则
- `@eslint/markdown` — Markdown 规则
- `eslint-plugin-jsdoc` — JSDoc 规则
- `eslint-plugin-regexp` — 正则表达式规则
- `eslint-plugin-unicorn` — 通用最佳实践
- `eslint-plugin-perfectionist` — 排序规则
- `eslint-plugin-antfu` — antfu 的自定义规则
- `eslint-plugin-unused-imports` — 未使用 import 检测
- `@eslint-community/eslint-plugin-eslint-comments` — ESLint 注释规则
- `eslint-plugin-command` — 指令注释
- `local-pkg` — 包检测

### React 包额外依赖

- `@eslint-react/eslint-plugin`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`

### Vue 包额外依赖

- `eslint-plugin-vue`
- `vue-eslint-parser`

### 开发依赖

- `tsdown` — 构建工具
- `typescript` — TypeScript 编译器
- `pnpm` — 包管理器

## 构建配置

每个包独立构建，输出到各自的 `dist/` 目录：

```ts
// 每个包的 tsdown.config.ts
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  dts: true,
  clean: true,
})
```

## 验收标准

1. `pnpm install` 成功安装所有依赖
2. `pnpm build` 成功构建所有三个包
3. 基础包可以在纯 TS 项目中独立使用
4. Vue 包可以正确 lint Vue 3 + TypeScript 项目
5. React 包可以正确 lint React 19 + TypeScript 项目
6. 所有包正确导出类型声明
7. 插件重命名正常工作（`ts/`、`style/`、`node/`）
8. type-aware 规则在提供 tsconfig 后正常工作
