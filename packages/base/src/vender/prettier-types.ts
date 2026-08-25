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
  endOfLine?: "auto" | "crlf" | "lf" | "cr";
  filepath?: string;
  htmlWhitespaceSensitivity?: "css" | "strict" | "ignore";
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
  xmlQuoteAttributes?: "double" | "single" | "preserve";
  xmlSelfClosingSpace?: boolean;
  xmlSortAttributesByKey?: boolean;
  xmlWhitespaceSensitivity?: "strict" | "preserve" | "ignore";
}

export type VendoredPrettierRuleOptions = VendoredPrettierOptions;
