import type { OptionsConfig, TypedFlatConfigItem } from '../src/types'
import { it } from 'vitest'
import { renton } from '../src/factory'

interface Suite {
  name: string
  configs: OptionsConfig
}

const suites: Suite[] = [
  {
    name: 'default',
    configs: {},
  },
  {
    name: 'no-typescript',
    configs: {
      typescript: false,
    },
  },
  {
    name: 'no-stylistic',
    configs: {
      stylistic: false,
    },
  },
  {
    name: 'stylistic-custom',
    configs: {
      stylistic: {
        indent: 2,
        quotes: 'single',
        semi: false,
      },
    },
  },
  {
    name: 'no-jsonc',
    configs: {
      jsonc: false,
    },
  },
  {
    name: 'no-yaml',
    configs: {
      yaml: false,
    },
  },
  {
    name: 'no-markdown',
    configs: {
      markdown: false,
    },
  },
  {
    name: 'no-jsdoc',
    configs: {
      jsdoc: false,
    },
  },
  {
    name: 'lib',
    configs: {
      typeAware: false,
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
    const config = await renton(configs)
    await expect(serializeConfigs(config))
      .toMatchFileSnapshot(`./__snapshots__/${name}.snap.js`)
  })
})
