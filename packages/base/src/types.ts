import type { ConfigWithExtends } from "eslint-flat-config-utils";
import type { Rules } from "./typegen";

export type Awaitable<T> = Promise<T> | T;

export interface OptionsConfig {
  /**
   * Enable inline command directives via eslint-plugin-command.
   *
   * @default true
   */
  command?: boolean;

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
  typescript?: boolean;
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

// eslint-disable-next-line perfectionist/sort-modules -- OptionsJSXA11y extends OptionsOverrides, must come after
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
   * Enable linting for pnpm-workspace.yaml.
   *
   * @default true
   */
  yaml?: boolean;
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
