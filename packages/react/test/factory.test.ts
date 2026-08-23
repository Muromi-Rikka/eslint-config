import type { TypedFlatConfigItem } from '@renton/eslint-config'
import type { OptionsReact } from '../src/types'
import { it } from 'vitest'
import { rentonReact } from '../src/factory'

interface Suite {
  name: string
  configs: OptionsReact
}

const suites: Suite[] = [
  {
    name: 'default',
    configs: {},
  },
  {
    name: 'with-next',
    configs: {
      next: true,
    },
  },
]

const ignoreConfigs: string[] = [
  'renton/gitignore',
  'renton/ignores',
  'renton/javascript/setup',
]

function serializeConfigs(configs: TypedFlatConfigItem[]) {
  return configs.map((c) => {
    if (c.name && ignoreConfigs.includes(c.name)) {
      return '<ignored>'
    }
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
    if (c.processor) {
      if (typeof c.processor !== 'string') {
        clone.processor = (c.processor as any).meta?.name ?? 'unknown'
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
    const config = await rentonReact(configs)
    await expect(serializeConfigs(config))
      .toMatchFileSnapshot(`./__snapshots__/${name}.snap.js`)
  })
})
