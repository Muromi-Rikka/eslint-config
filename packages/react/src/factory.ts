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
