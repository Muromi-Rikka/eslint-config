import { isPackageInScope } from "local-pkg";
import type { OptionsFormatters, StylisticOptions, TypedFlatConfigItem, VendoredPrettierOptions } from "../types";
import type { VendoredPrettierRuleOptions } from "../vender/prettier-types";
import { GLOB_ASTRO, GLOB_CSS, GLOB_GRAPHQL, GLOB_HTML, GLOB_LESS, GLOB_MARKDOWN, GLOB_POSTCSS, GLOB_SCSS, GLOB_SVG, GLOB_XML } from "../globs";
import { ensurePackages, interopDefault, parserPlain } from "../utils";

const StylisticConfigDefaults: StylisticOptions = {
  braceStyle: "stroustrup",
  indent: 2,
  quotes: "double",
  semi: true,
};

export async function formatters(
  options: OptionsFormatters | true = {},
  stylistic: StylisticOptions = {},
): Promise<TypedFlatConfigItem[]> {
  if (options === true) {
    const isPrettierPluginXmlInScope = isPackageInScope("@prettier/plugin-xml");
    options = {
      astro: isPackageInScope("prettier-plugin-astro"),
      css: true,
      graphql: true,
      html: true,
      markdown: true,
      svg: isPrettierPluginXmlInScope,
      xml: isPrettierPluginXmlInScope,
    };
  }

  await ensurePackages([
    "eslint-plugin-format",
    options.astro ? "prettier-plugin-astro" : undefined,
    (options.xml || options.svg) ? "@prettier/plugin-xml" : undefined,
  ]);

  const {
    indent,
    quotes,
    semi,
  } = {
    ...StylisticConfigDefaults,
    ...stylistic,
  };

  const prettierOptions: VendoredPrettierOptions = Object.assign(
    {
      endOfLine: "auto",
      printWidth: 120,
      semi,
      singleQuote: quotes === "single",
      tabWidth: typeof indent === "number" ? indent : 2,
      trailingComma: "all",
      useTabs: indent === "tab",
    } satisfies VendoredPrettierOptions,
    options.prettierOptions || {},
  );

  const prettierXmlOptions: VendoredPrettierOptions = {
    xmlQuoteAttributes: "double",
    xmlSelfClosingSpace: true,
    xmlSortAttributesByKey: false,
    xmlWhitespaceSensitivity: "ignore",
  };

  const dprintOptions = {
    indentWidth: typeof indent === "number" ? indent : 2,
    quoteStyle: quotes === "single" ? "preferSingle" : "preferDouble",
    useTabs: indent === "tab",
    // @ts-expect-error - `options.dprintOptions` is boolean
    ...options.dprintOptions,
  };

  const pluginFormat = await interopDefault(import("eslint-plugin-format"));

  const configs: TypedFlatConfigItem[] = [
    {
      name: "renton/formatter/setup",
      plugins: {
        format: pluginFormat,
      },
    },
  ];

  if (options.css) {
    configs.push(
      {
        files: [GLOB_CSS, GLOB_POSTCSS],
        languageOptions: {
          parser: parserPlain,
        },
        name: "renton/formatter/css",
        rules: {
          "format/prettier": [
            "error",
            mergePrettierOptions(prettierOptions, {
              parser: "css",
            }),
          ],
        },
      },
      {
        files: [GLOB_SCSS],
        languageOptions: {
          parser: parserPlain,
        },
        name: "renton/formatter/scss",
        rules: {
          "format/prettier": [
            "error",
            mergePrettierOptions(prettierOptions, {
              parser: "scss",
            }),
          ],
        },
      },
      {
        files: [GLOB_LESS],
        languageOptions: {
          parser: parserPlain,
        },
        name: "renton/formatter/less",
        rules: {
          "format/prettier": [
            "error",
            mergePrettierOptions(prettierOptions, {
              parser: "less",
            }),
          ],
        },
      },
    );
  }

  if (options.html) {
    configs.push({
      files: [GLOB_HTML],
      languageOptions: {
        parser: parserPlain,
      },
      name: "renton/formatter/html",
      rules: {
        "format/prettier": [
          "error",
          mergePrettierOptions(prettierOptions, {
            parser: "html",
          }),
        ],
      },
    });
  }

  if (options.xml) {
    configs.push({
      files: [GLOB_XML],
      languageOptions: {
        parser: parserPlain,
      },
      name: "renton/formatter/xml",
      rules: {
        "format/prettier": [
          "error",
          mergePrettierOptions({ ...prettierXmlOptions, ...prettierOptions }, {
            parser: "xml",
            plugins: [
              "@prettier/plugin-xml",
            ],
          }),
        ],
      },
    });
  }

  if (options.svg) {
    configs.push({
      files: [GLOB_SVG],
      languageOptions: {
        parser: parserPlain,
      },
      name: "renton/formatter/svg",
      rules: {
        "format/prettier": [
          "error",
          mergePrettierOptions({ ...prettierXmlOptions, ...prettierOptions }, {
            parser: "xml",
            plugins: [
              "@prettier/plugin-xml",
            ],
          }),
        ],
      },
    });
  }

  if (options.markdown) {
    const formatter = options.markdown === true
      ? "prettier"
      : options.markdown;

    configs.push({
      files: [GLOB_MARKDOWN],
      languageOptions: {
        parser: parserPlain,
      },
      name: "renton/formatter/markdown",
      rules: {
        [`format/${formatter}`]: [
          "error",
          formatter === "prettier"
            ? mergePrettierOptions(prettierOptions, {
                embeddedLanguageFormatting: "off",
                parser: "markdown",
              })
            : {
                ...dprintOptions,
                language: "markdown",
              },
        ],
      },
    });
  }

  if (options.astro) {
    configs.push({
      files: [GLOB_ASTRO],
      languageOptions: {
        parser: parserPlain,
      },
      name: "renton/formatter/astro",
      rules: {
        "format/prettier": [
          "error",
          mergePrettierOptions(prettierOptions, {
            parser: "astro",
            plugins: [
              "prettier-plugin-astro",
            ],
          }),
        ],
      },
    }, {
      files: [GLOB_ASTRO],
      name: "renton/formatter/astro/disables",
      rules: {
        "style/arrow-parens": "off",
        "style/block-spacing": "off",
        "style/comma-dangle": "off",
        "style/indent": "off",
        "style/no-multi-spaces": "off",
        "style/quotes": "off",
        "style/semi": "off",
      },
    });
  }

  if (options.graphql) {
    configs.push({
      files: [GLOB_GRAPHQL],
      languageOptions: {
        parser: parserPlain,
      },
      name: "renton/formatter/graphql",
      rules: {
        "format/prettier": [
          "error",
          mergePrettierOptions(prettierOptions, {
            parser: "graphql",
          }),
        ],
      },
    });
  }

  return configs;
}

function mergePrettierOptions(
  options: VendoredPrettierOptions,
  overrides: VendoredPrettierRuleOptions,
): VendoredPrettierRuleOptions {
  return {
    ...options,
    ...overrides,
    plugins: [
      ...(overrides.plugins || []),
      ...(options.plugins || []),
    ],
  };
}
