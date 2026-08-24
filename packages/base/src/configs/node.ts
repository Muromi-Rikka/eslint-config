import type { OptionsOverrides, TypedFlatConfigItem } from "../types";
import { GLOB_SRC } from "../globs";
import { interopDefault } from "../utils";

export async function node(options: OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
  } = options;

  const pluginNode = await interopDefault(import("eslint-plugin-n"));

  return [
    {
      files: [GLOB_SRC],
      name: "renton/node/rules",
      plugins: {
        node: pluginNode,
      },
      rules: {
        "node/handle-callback-err": ["error", "^(err|error)$"],
        "node/no-deprecated-api": "error",
        "node/no-exports-assign": "error",
        "node/no-new-require": "error",
        "node/no-path-concat": "error",
        "node/process-exit-as-throw": "error",
        ...overrides,
      },
    },
  ];
}
