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
