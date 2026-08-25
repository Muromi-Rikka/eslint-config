/**
 * Vendored Prettier option types to avoid runtime dependency on Prettier.
 * Based on Prettier's own type definitions.
 */
export interface VendoredPrettierOptions {
  [key: string]: any;
  arrowParens?: "always" | "avoid";
  bracketSameLine?: boolean;
  bracketSpacing?: boolean;
  cursorOffset?: number;
  editorconfig?: boolean;
  endOfLine?: "auto" | "cr" | "crlf" | "lf";
  filepath?: string;
  htmlWhitespaceSensitivity?: "css" | "ignore" | "strict";
  insertPragma?: boolean;
  jsxSingleQuote?: boolean;
  parser?: string;
  plugins?: string[];
  printWidth?: number;
  proseWrap?: "always" | "never" | "preserve";
  quoteProps?: "as-needed" | "consistent" | "preserve";
  rangeEnd?: number;
  rangeStart?: number;
  requirePragma?: boolean;
  semi?: boolean;
  singleAttributePerLine?: boolean;
  singleQuote?: boolean;
  tabWidth?: number;
  trailingComma?: "all" | "es5" | "none";
  useTabs?: boolean;
  xmlQuoteAttributes?: "double" | "preserve" | "single";
  xmlSelfClosingSpace?: boolean;
  xmlSortAttributesByKey?: boolean;
  xmlWhitespaceSensitivity?: "ignore" | "preserve" | "strict";
}

export type VendoredPrettierRuleOptions = VendoredPrettierOptions;
