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
    {
      files: [GLOB_VUE],
      name: 'renton/vue/perfectionist',
      rules: {
        'perfectionist/sort-jsx-props': ['error', { order: 'asc', type: 'natural' }],
      },
    },
  ]
}
