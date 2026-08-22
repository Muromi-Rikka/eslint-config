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
