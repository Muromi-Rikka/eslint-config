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
