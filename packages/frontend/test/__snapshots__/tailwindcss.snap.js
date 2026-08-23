[
  {
    "files": [
      "**/*.ts",
      "**/*.tsx",
      "**/*.js",
      "**/*.jsx",
      "**/*.svelte",
      "**/*.vue",
    ],
    "languageOptions": {
      "parserOptions": {
        "ecmaFeatures": {
          "jsx": true,
        },
        "ecmaVersion": "latest",
        "sourceType": "module",
      },
    },
    "name": "renton/tailwindcss/setup",
    "plugins": [
      "tailwindcss",
    ],
    "rules": [
      "tailwindcss/classnames-order",
      "tailwindcss/enforces-canonical-classname",
      "tailwindcss/enforces-negative-arbitrary-values",
      "tailwindcss/enforces-shorthand",
      "tailwindcss/important-modifier-suffix",
      "- tailwindcss/no-arbitrary-value",
      "tailwindcss/no-custom-classname",
      "tailwindcss/no-contradicting-classname",
      "tailwindcss/no-unnecessary-arbitrary-value",
    ],
    "settings": {
      "tailwindcss": {
        "cssConfig": "src/app.css",
      },
    },
  },
  {
    "name": "renton/tailwindcss/rules",
    "rules": [],
  },
]