import type { ConfigWithExtends } from "eslint-flat-config-utils";
import type { Rules } from "./typegen";

export type Awaitable<T> = Promise<T> | T;

export interface OptionsConfig {
  /**
   * Enable anti-slop rules from `eslint-plugin-slop` and a curated subset of `eslint-plugin-sonarjs`.
   *
   * Requires installing:
   * - `eslint-plugin-slop`
   * - `eslint-plugin-sonarjs`
   *
   * @default false
   */
  antislop?: boolean | OptionsAntislop;

  /**
   * Enable inline command directives via eslint-plugin-command.
   *
   * @default true
   */
  command?: boolean;

  /**
   * Additional component file extensions (e.g. `vue`) whose script blocks
   * should be linted by the TypeScript rules. Used by satellite packages
   * (e.g. `@renton/eslint-config-vue`) to lint `<script>` blocks in SFCs.
   */
  componentExts?: string[];

  /**
   * Enable context-aware rule disabling for scripts, cli, bin, .d.ts, and config files.
   *
   * @default true
   */
  disables?: boolean;

  /**
   * Use external formatters to format files.
   *
   * Requires installing:
   * - `eslint-plugin-format`
   *
   * When set to `true`, it will enable all formatters.
   *
   * @default false
   */
  formatters?: boolean | OptionsFormatters;

  gitignore?: boolean;

  jsdoc?: boolean;

  jsonc?: boolean;
  /**
   * Enable JSX related rules.
   *
   * Passing an object to enable JSX accessibility rules.
   *
   * @default true
   */
  jsx?: boolean | OptionsJSX;
  markdown?: boolean;
  node?: boolean;
  perfectionist?: boolean;
  pnpm?: boolean | OptionsPnpm;
  regexp?: boolean;

  /**
   * Sort package.json and tsconfig.json keys.
   *
   * Requires `jsonc` config to be enabled.
   *
   * @default true
   */
  sort?: boolean;

  stylistic?: boolean | StylisticOptions;

  /**
   * Enable test support via Vitest and no-only-tests.
   *
   * @default true
   */
  test?: boolean | OptionsOverrides;

  typeAware?: boolean;
  typescript?: boolean | OptionsTypescript;
  unicorn?: boolean;
  yaml?: boolean;
}

export interface OptionsFiles {
  /**
   * Override the `files` option to provide custom globs.
   */
  files?: string[];
}

export interface OptionsFormatters {
  /**
   * Enable formatting support for Astro.
   */
  astro?: "prettier" | boolean;

  /**
   * Enable formatting support for CSS, Less, Sass, and SCSS.
   */
  css?: "prettier" | boolean;

  /**
   * Custom options for dprint.
   */
  dprintOptions?: boolean;

  /**
   * Enable formatting support for GraphQL.
   */
  graphql?: "prettier" | boolean;

  /**
   * Enable formatting support for HTML.
   */
  html?: "prettier" | boolean;

  /**
   * Enable formatting support for Markdown.
   * Support both Prettier and dprint. When set to `true`, it will use Prettier.
   */
  markdown?: "dprint" | "prettier" | boolean;

  /**
   * Custom options for Prettier.
   */
  prettierOptions?: VendoredPrettierOptions;

  /**
   * Enable formatting support for SVG.
   */
  svg?: "prettier" | boolean;

  /**
   * Enable formatting support for XML.
   */
  xml?: "prettier" | boolean;
}

export interface OptionsIsInEditor {
  isInEditor?: boolean;
}

export interface OptionsJSX {
  /**
   * Enable JSX accessibility rules.
   *
   * Requires installing:
   * - `eslint-plugin-jsx-a11y`
   *
   * @default false
   */
  a11y?: boolean | OptionsJSXA11y;
}

export interface OptionsOverrides {
  overrides?: Rules;
}

// eslint-disable-next-line perfectionist/sort-modules -- OptionsAntislop extends OptionsOverrides, must come after
export interface OptionsAntislop extends OptionsOverrides {
  /**
   * Cognitive complexity threshold for `sonarjs/cognitive-complexity`.
   * Set to `false` to disable the rule.
   *
   * @default 15
   */
  cognitiveComplexity?: false | number;

  /**
   * Enable rules from `eslint-plugin-slop`.
   * Pass an object to configure the plugin via `settings.slop`.
   *
   * @default true
   */
  slop?: boolean | OptionsSlop;

  /**
   * Enable the curated subset of rules from `eslint-plugin-sonarjs`.
   *
   * @default true
   */
  sonarjs?: boolean;
}

export interface OptionsJSXA11y extends OptionsOverrides {}

export interface OptionsPnpm {
  /**
   * Requires catalogs usage.
   * Detects automatically based on if `catalogs` is used in the pnpm-workspace.yaml file.
   */
  catalogs?: boolean;

  /**
   * Whether running in an editor.
   *
   * @default false
   */
  isInEditor?: boolean;

  /**
   * Enable linting for package.json.
   *
   * @default true
   */
  json?: boolean;

  /**
   * Enforce key sort order in pnpm-workspace.yaml.
   *
   * @default true
   */
  sort?: boolean;

  /**
   * Enforce blank lines between groups in pnpm-workspace.yaml.
   *
   * @default true
   */
  stylistic?: boolean;

  /**
   * Enable linting for pnpm-workspace.yaml.
   *
   * @default true
   */
  yaml?: boolean;
}

export interface OptionsSlop {
  /**
   * Working directory for the plugin.
   */
  cwd?: string;

  /**
   * Scope of files the plugin inspects.
   *
   * @default "recent-changes"
   */
  inspection?: "full" | "recent-changes" | "uncommitted" | {
    mode: "full" | "uncommitted";
  } | {
    mode: "recent-changes";
    tracebackCommits?: number;
  };
}

export interface OptionsTypescript extends OptionsOverrides {
  /**
   * Additional component file extensions (e.g. `vue`) whose script blocks
   * should be linted by the TypeScript rules. Adds a matching extension glob
   * and registers the extension as a `vue-eslint-parser` extra file
   * extension in satellite packages.
   */
  componentExts?: string[];

  /**
   * Custom tsconfig path (or paths) used as `tsconfigRootDir` when
   * `typeAware` is enabled.
   */
  tsconfigPath?: string;

  /**
   * Enable type-aware linting rules.
   *
   * @default false
   */
  typeAware?: boolean;
}

export interface StylisticOptions {
  braceStyle?: "1tbs" | "allman" | "stroustrup";
  indent?: "tab" | number;
  jsx?: boolean;
  quotes?: "double" | "single";
  semi?: boolean;
}

export type TypedFlatConfigItem = Omit<ConfigWithExtends, "plugins" | "rules"> & {
  plugins?: Record<string, any>;
  rules?: Rules;
};

/**
 * Vendored Prettier options to avoid runtime dependency.
 */
export interface VendoredPrettierOptions {
  [key: string]: any;
  endOfLine?: "auto" | "cr" | "crlf" | "lf";
  printWidth?: number;
  semi?: boolean;
  singleQuote?: boolean;
  tabWidth?: number;
  trailingComma?: "all" | "es5" | "none";
  useTabs?: boolean;
}

export { type ConfigNames, type Rules } from "./typegen";
