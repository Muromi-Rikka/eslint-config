import type { TypedFlatConfigItem } from "../types";
import { GLOB_MARKDOWN } from "../globs";
import { interopDefault, parserPlain } from "../utils";

export async function markdown(): Promise<TypedFlatConfigItem[]> {
  const pluginMarkdown = await interopDefault(import("@eslint/markdown"));

  return [
    {
      files: [GLOB_MARKDOWN],
      name: "renton/markdown/setup",
      plugins: {
        markdown: pluginMarkdown,
      },
    },
    {
      files: [GLOB_MARKDOWN],
      languageOptions: {
        parser: parserPlain as any,
      },
      name: "renton/markdown/parser",
    },
  ];
}
