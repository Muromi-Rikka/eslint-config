# @renton/eslint-config-cli

## 1.2.1

### Patch Changes

- - `@renton/eslint-config-react`: disable `react/naming-convention-ref-name` — it contradicted `unicorn/name-replacements` (`*Ref` vs `*Reference`) with no options to reconcile; `unicorn` remains the single naming authority.
  - `@renton/eslint-config-cli`: generated configs now include a standalone global-ignores object (flat-config global ignores), and `additionalConfigs` defaults to `[]`, so omitting it no longer emits a literal `undefined`.
- Updated dependencies []:
  - @renton/eslint-config@1.2.1

## 1.2.0

### Minor Changes

- Align the remaining packages on the 1.2.0 release train so every package in the monorepo shares the same version.

## 1.1.1

### Patch Changes

- Sync with upstream antfu eslint config v9.5.1: new antislop and pnpm-workspace rule presets, an expanded TypeScript rule set, and refreshed plugin catalog. `rentonReact()` gains a `react` option to toggle the base React configs, and the CLI's formatter dependency setup is simplified.
- Updated dependencies [`5c687b3`, `5c687b3`]:
  - @renton/eslint-config@1.2.0

## 1.1.0

### Minor Changes

- Upgrade all dependencies to latest versions, including eslint 10.10, tsdown 0.23, vitest 5, typescript-eslint 8.69, and eslint-plugin-unicorn 74.

### Patch Changes

- Updated dependencies []:
  - @renton/eslint-config@1.1.0

## 0.1.1

### Patch Changes

- Updated dependencies [[`22621a5`](https://github.com/Muromi-Rikka/eslint-config/commit/22621a59402cc9135717e73800c5c8d16c0c271f)]:
  - @renton/eslint-config@0.2.0
