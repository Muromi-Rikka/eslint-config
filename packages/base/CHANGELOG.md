# @renton/eslint-config

## 1.2.1

### Patch Changes

- Align all packages on the 1.2.1 release train so every package in the monorepo shares the same version.

## 1.2.0

### Minor Changes

- Sync with upstream antfu eslint config v9.5.1: new antislop and pnpm-workspace rule presets, an expanded TypeScript rule set, and refreshed plugin catalog. `rentonReact()` gains a `react` option to toggle the base React configs, and the CLI's formatter dependency setup is simplified.

- Fix TypeScript parsing in Vue SFCs. `rentonVue()` now registers `typescript-eslint` as the inner parser of `vue-eslint-parser` for `**/*.vue` when `typescript` is enabled, and passes `componentExts: ["vue"]` so TypeScript rules lint `<script lang="ts">` blocks. `renton()` gains the `componentExts` option and exports the `OptionsTypescript` type.

## 1.1.0

### Minor Changes

- Upgrade all dependencies to latest versions, including eslint 10.10, tsdown 0.23, vitest 5, typescript-eslint 8.69, and eslint-plugin-unicorn 74.

## 0.2.0

### Minor Changes

- [#1](https://github.com/Muromi-Rikka/eslint-config/pull/1) [`22621a5`](https://github.com/Muromi-Rikka/eslint-config/commit/22621a59402cc9135717e73800c5c8d16c0c271f) Thanks [@Muromi-Rikka](https://github.com/Muromi-Rikka)! - Add eslint-comments, baseline browser checking, and eslint-typegen integration
  
  - **base**: Add `@eslint-community/eslint-plugin-eslint-comments` (always-on, 5 rules for comment directive best practices)
  - **base**: Integrate `eslint-typegen` for generated rule types (`Rules`) and config name types (`ConfigNames`)
  - **frontend**: Add `eslint-plugin-baseline-js` for baseline browser compatibility checking (opt-in via `baseline` option)

## 0.1.2

### Patch Changes

- [`3406684`](https://github.com/Muromi-Rikka/eslint-config/commit/34066840091a987b58c886ca64e83297943e5208) Thanks [@Muromi-Rikka](https://github.com/Muromi-Rikka)! - Release v0.1.1
  
  - Enhanced package.json metadata and added MIT license to all packages
  - Updated test snapshots for pnpm plugin rules

## 0.1.1

### Patch Changes

- Enhance package.json metadata and add MIT license to all packages
  
  - Added complete metadata to all package.json files (description, author, license, repository, bugs, homepage, keywords, engines)
  - Set Node.js version requirements: >= 26.0.0 for workspace, >= 24.0.0 for packages
  - Added MIT LICENSE file to root and all sub-packages
  - Updated README.md with corrected license information and Node.js version requirements

## 0.1.0

### Minor Changes

- Initial release
  
  - `@renton/eslint-config` - Base ESLint flat config with TypeScript, Stylistic, and common plugins
  - `@renton/eslint-config-frontend` - Frontend config with Tailwind CSS support
  - `@renton/eslint-config-react` - React config with React Hooks, React Query, and Next.js support
  - `@renton/eslint-config-vue` - Vue config with Vue I18n support
