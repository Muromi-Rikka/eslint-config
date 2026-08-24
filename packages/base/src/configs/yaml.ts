import type { OptionsOverrides, TypedFlatConfigItem } from "../types";
import { GLOB_YAML } from "../globs";
import { interopDefault } from "../utils";

export async function yaml(options: OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
  } = options;

  const pluginYaml = await interopDefault(import("eslint-plugin-yml"));

  return [
    {
      files: [GLOB_YAML],
      language: "yaml/yaml",
      name: "renton/yaml/rules",
      plugins: {
        yaml: pluginYaml,
      },
      rules: {
        "yaml/block-mapping": "error",
        "yaml/block-sequence": "error",
        "yaml/no-empty-document": "error",
        "yaml/no-empty-key": "error",
        "yaml/no-empty-mapping-value": "error",
        "yaml/no-empty-sequence-entry": "error",
        "yaml/no-irregular-whitespace": "error",
        "yaml/no-tab-indent": "error",
        "yaml/plain-scalar": "error",
        "yaml/vue-custom-block/no-parsing-error": "error",
        ...overrides,
      },
    },
  ];
}
