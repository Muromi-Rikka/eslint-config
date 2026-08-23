import type { OptionsVue, TypedFlatConfigItem } from './types'
import { renton } from '@renton/eslint-config'
import { tailwindcss } from '@renton/eslint-config-frontend'
import { vue } from './configs/vue'

export async function rentonVue(
  options: OptionsVue = {},
  ...userConfigs: TypedFlatConfigItem[]
): Promise<TypedFlatConfigItem[]> {
  const {
    vue: enableVue = true,
    vueVersion = 3,
    tailwindcss: enableTailwindcss = false,
    tailwindcssConfigPath,
    ...baseOptions
  } = options

  if (enableTailwindcss && !tailwindcssConfigPath) {
    throw new Error('`tailwindcssConfigPath` is required when `tailwindcss` is enabled')
  }

  const baseConfigs = await renton(baseOptions)

  const vueConfigs = enableVue
    ? await vue({ vueVersion })
    : []

  const tailwindcssConfigs = enableTailwindcss
    ? await tailwindcss({ cssConfigPath: tailwindcssConfigPath! })
    : []

  const allConfigs = [...baseConfigs, ...vueConfigs, ...tailwindcssConfigs]

  if (userConfigs.length > 0) {
    allConfigs.push(...userConfigs)
  }

  return allConfigs
}
