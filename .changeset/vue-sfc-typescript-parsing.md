---
"@renton/eslint-config": minor
"@renton/eslint-config-vue": patch
---

Fix TypeScript parsing in Vue SFCs. `rentonVue()` now registers `typescript-eslint` as the inner parser of `vue-eslint-parser` for `**/*.vue` when `typescript` is enabled, and passes `componentExts: ["vue"]` so TypeScript rules lint `<script lang="ts">` blocks. `renton()` gains the `componentExts` option and exports the `OptionsTypescript` type.
