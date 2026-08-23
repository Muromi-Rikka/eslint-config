import type { TypedFlatConfigItem } from '@renton/eslint-config'
import type { OptionsTailwindcssConfig } from '../src/configs/tailwindcss'
import { it } from 'vitest'
import { tailwindcss } from '../src/configs/tailwindcss'

interface Suite {
  name: string
  configs: OptionsTailwindcssConfig
}

const suites: Suite[] = [
  {
    name: 'tailwindcss',
    configs: {
      cssConfigPath: 'src/app.css',
    },
  },
]

function serializeConfigs(configs: TypedFlatConfigItem[]) {
  return configs.map((c) => {
    const clone = { ...c } as any
    if (c.plugins) {
      clone.plugins = Object.keys(c.plugins)
    }
    if (c.languageOptions) {
      if (c.languageOptions.parser) {
        if (typeof c.languageOptions.parser !== 'string') {
          clone.languageOptions.parser = (c.languageOptions.parser as any).meta?.name ?? (c.languageOptions.parser as any).name ?? 'unknown'
        }
      }
      delete clone.languageOptions.globals
      if (c.languageOptions.parserOptions) {
        delete clone.languageOptions.parserOptions.parser
        delete clone.languageOptions.parserOptions.projectService
        delete clone.languageOptions.parserOptions.tsconfigRootDir
      }
    }
    if (c.rules) {
      clone.rules = Object.entries(c.rules)
        .map(([rule, value]) => {
          if (value === 'off' || value === 0)
            return `- ${rule}`
          return rule
        })
    }
    return clone
  })
}

suites.forEach(({ name, configs }) => {
  it.concurrent(`factory ${name}`, async ({ expect }) => {
    const config = await tailwindcss(configs)
    await expect(serializeConfigs(config))
      .toMatchFileSnapshot(`./__snapshots__/${name}.snap.js`)
  })
})
