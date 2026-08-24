import type { Linter } from "eslint";
import type { ConfigWithExtends } from "eslint-flat-config-utils";

export type Awaitable<T> = Promise<T> | T;

export interface OptionsConfig {
  gitignore?: boolean;
  jsdoc?: boolean;
  jsonc?: boolean;
  markdown?: boolean;
  node?: boolean;
  perfectionist?: boolean;
  pnpm?: boolean | OptionsPnpm;
  regexp?: boolean;
  stylistic?: boolean | StylisticOptions;
  typeAware?: boolean;
  typescript?: boolean;
  unicorn?: boolean;
  yaml?: boolean;
}

export interface OptionsOverrides {
  overrides?: Rules;
}

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

export type Rules = Record<string, Linter.RuleEntry<any> | undefined>;

export interface StylisticOptions {
  braceStyle?: "1tbs" | "allman" | "stroustrup";
  indent?: "tab" | number;
  quotes?: "double" | "single";
  semi?: boolean;
}

export type TypedFlatConfigItem = Omit<ConfigWithExtends, "plugins" | "rules"> & {
  plugins?: Record<string, any>;
  rules?: Rules;
};
