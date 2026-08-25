// @ts-expect-error -- subpath may lack type declarations
import pluginComments from "@eslint-community/eslint-plugin-eslint-comments";

import type { TypedFlatConfigItem } from "../types";

export async function comments(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: "renton/comments/setup",
      plugins: {
        "eslint-comments": pluginComments,
      },
    },
    {
      name: "renton/comments/rules",
      rules: {
        "eslint-comments/disable-enable-pair": ["error", { allowWholeFile: true }],
        "eslint-comments/no-aggregating-enable": "error",
        "eslint-comments/no-duplicate-disable": "error",
        "eslint-comments/no-unlimited-disable": "error",
        "eslint-comments/no-unused-enable": "error",
      },
    },
  ];
}
