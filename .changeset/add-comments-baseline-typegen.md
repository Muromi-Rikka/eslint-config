---
"@renton/eslint-config": minor
"@renton/eslint-config-frontend": minor
---

Add eslint-comments, baseline browser checking, and eslint-typegen integration

- **base**: Add `@eslint-community/eslint-plugin-eslint-comments` (always-on, 5 rules for comment directive best practices)
- **base**: Integrate `eslint-typegen` for generated rule types (`Rules`) and config name types (`ConfigNames`)
- **frontend**: Add `eslint-plugin-baseline-js` for baseline browser compatibility checking (opt-in via `baseline` option)
