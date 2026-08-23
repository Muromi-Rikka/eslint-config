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

  return composer.toConfigs()
}
