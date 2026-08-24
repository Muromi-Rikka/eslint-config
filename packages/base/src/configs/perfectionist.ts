import type { OptionsOverrides, TypedFlatConfigItem } from "../types";
import { GLOB_SRC } from "../globs";
import { interopDefault } from "../utils";

export async function perfectionist(options: OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
  } = options;

  const pluginPerfectionist = await interopDefault(import("eslint-plugin-perfectionist"));

  return [
    {
      files: [GLOB_SRC],
      name: "renton/perfectionist/rules",
      plugins: {
        perfectionist: pluginPerfectionist,
      },
      rules: {
        "perfectionist/sort-array-includes": ["error", { order: "asc", type: "natural" }],
        "perfectionist/sort-classes": ["error", { order: "asc", type: "natural" }],
        "perfectionist/sort-decorators": ["error", { order: "asc", type: "natural" }],
        "perfectionist/sort-enums": ["error", { order: "asc", type: "natural" }],
        "perfectionist/sort-export-attributes": ["error", { order: "asc", type: "natural" }],
        "perfectionist/sort-exports": ["error", { order: "asc", type: "natural" }],
        "perfectionist/sort-heritage-clauses": ["error", { order: "asc", type: "natural" }],
        "perfectionist/sort-import-attributes": ["error", { order: "asc", type: "natural" }],
        "perfectionist/sort-imports": ["error", {
          groups: [
            "type-import",
            ["value-builtin", "value-external"],
            "type-internal",
            "value-internal",
            ["type-parent", "type-sibling", "type-index"],
            ["value-parent", "value-sibling", "value-index"],
            "ts-equals-import",
            "unknown",
          ],
          newlinesBetween: "ignore",
          order: "asc",
          type: "natural",
        }],
        "perfectionist/sort-interfaces": ["error", { order: "asc", type: "natural" }],
        "perfectionist/sort-intersection-types": ["error", { order: "asc", type: "natural" }],
        "perfectionist/sort-maps": ["error", { order: "asc", type: "natural" }],
        "perfectionist/sort-modules": ["error", { order: "asc", type: "natural" }],
        "perfectionist/sort-named-exports": ["error", { order: "asc", type: "natural" }],
        "perfectionist/sort-named-imports": ["error", { order: "asc", type: "natural" }],
        "perfectionist/sort-object-types": ["error", { order: "asc", type: "natural" }],
        "perfectionist/sort-objects": ["error", { order: "asc", type: "natural" }],
        "perfectionist/sort-sets": ["error", { order: "asc", type: "natural" }],
        "perfectionist/sort-switch-case": ["error", { order: "asc", type: "natural" }],
        "perfectionist/sort-union-types": ["error", { order: "asc", type: "natural" }],
        "perfectionist/sort-variable-declarations": ["error", { order: "asc", type: "natural" }],
        ...overrides,
      },
    },
  ];
}
