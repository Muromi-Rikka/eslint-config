# AGENTS.md

## Project

`@renton/eslint-config` — pnpm monorepo producing 5 publishable ESLint flat-config packages under `packages/` (base, cli, frontend, react, vue). Published to npm with `public` access.

## Commands

Run from repo root (`E:\work\new\eslint-config`):

| Task | Command |
|---|---|
| Build all | `pnpm build` |
| Lint | `pnpm lint` |
| Lint + fix | `pnpm lint:fix` |
| Typecheck | `pnpm tsc --noEmit` |
| All tests | `pnpm test:run` |
| Single package test | `pnpm --filter @renton/eslint-config test` (or `-frontend`, `-react`, `-vue`) |
| Install (lockfile frozen) | `pnpm install --frozen-lockfile` |
| Install (allow lockfile mutation) | `pnpm install` |

**CI order** (do not reorder): build → lint → test (per package) → typecheck.

## Architecture

- **`packages/base`** — core `renton()` factory. All other packages depend on it via `workspace:*`.
- **`packages/frontend`** — extends base with Tailwind CSS + baseline-js.
- **`packages/react`** — extends frontend with React, Next.js, TanStack plugins.
- **`packages/vue`** — extends frontend with Vue, Vue I18n plugins.
- **`packages/cli`** — standalone CLI (`renton-eslint`) for interactive setup.
- **`test/`** — root-level integration tests (vitest snapshots).
- **`reference/`** — ignored by gitignore, eslint, and tsconfig.

Each package builds to `dist/` (ESM only, `.mjs` + `.d.mts`) via tsdown. Entry points are defined in each package's `exports` field.

## Dependency management — catalogs

All shared dependency versions live in **`pnpm-workspace.yaml`** under three catalogs:

| Catalog | Used by | Key deps |
|---|---|---|
| `catalog:` (root) | devDeps in all packages | eslint, tsdown, typescript |
| `catalogs: dev:` | build/test tooling | vitest, tsx, tinyexec, changesets |
| `catalogs: plugins:` | runtime eslint plugins | ~35 eslint plugins, globals, parsers |

Sub-packages reference catalogs with `"catalog:"`, `"catalog:dev"`, or `"catalog:plugins"` in their dependency fields. **Never pin versions directly in sub-package.json** — always update the catalog in `pnpm-workspace.yaml`.

After changing catalogs, run `pnpm install` to regenerate `pnpm-lock.yaml`.

### minimumReleaseAgeExclude

Some catalog entries have `minimumReleaseAgeExclude` at the bottom of `pnpm-workspace.yaml`. When upgrading those packages, update the exclude list to match the new version.

## Codegen

`packages/base/scripts/typegen.ts` generates `packages/base/src/typegen.ts` (rule type definitions). It runs automatically as part of `pnpm build` (via `build:typegen` script). The generated file is committed — do not edit it manually, and exclude it from lint (already in `eslint.config.ts` ignores).

## Testing

- **Framework**: vitest (config at `vitest.config.ts`).
- **Fixture tests**: `test/fixtures.test.ts` runs `eslint --fix` against input fixtures and compares output to snapshot fixtures via `toMatchFileSnapshot()`. To update snapshots after intentional changes, run `pnpm test:run --update`.
- **Package tests**: `packages/{base,frontend,react,vue}/test/factory.test.ts` test each config factory.
- **Timeouts**: fixture tests have 60s timeout (300s on Windows). Set `testTimeout: 60_000` in vitest config.
- **Excluded from test**: `**/node_modules/**`, `**/reference/**`, `**/dist/**`.

## Release

Uses **changesets** (`@changesets/cli`). Default branch is `master` (changeset config says `main` but the repo uses `master`).

### Local steps

1. Create changeset: `pnpm changeset` (interactive) or `pnpm changeset --empty` (no-API changes like dep upgrades)
2. Edit the generated `.changeset/*.md` — list each package with bump type (`major`/`minor`/`patch`) and a summary
3. Version: `pnpm changeset version` — reads changeset files, bumps `version` in each `package.json`, generates `CHANGELOG.md`, deletes consumed changeset files
4. Adjust version if needed (changeset applies the bump on top of the current version)
5. Commit version changes + changelogs, push to `master`

### Publishing (GitHub Actions)

Publishing is **fully automated** via `.github/workflows/release.yml`. Do NOT run `pnpm changeset publish` locally.

- **Trigger**: creating a **GitHub Release** (not just a tag push). The workflow listens on `release: types: [published]`.
- **Create a release**: `gh release create v<version> --title "v<version>" --notes "..."` or via the GitHub UI.
- **What the action does**: checks out `master` → `pnpm install` → `pnpm build` → `pnpm test:run` → `pnpm -r publish --provenance --no-git-checks`
- **Publishes to**: npm registry (`https://registry.npmjs.org`) with `public` access and provenance attestation (`id-token: write` permission).
- **Requires**: `NODE_AUTH_TOKEN` secret configured in the GitHub repo settings for npm authentication.

### Tag convention

Tags follow `vX.Y.Z` format (e.g. `v1.1.0`). Use `gh release create vX.Y.Z` to create both tag and release in one step.

## ESLint config

Root `eslint.config.ts` uses `@renton/eslint-config` (self-referential). Ignores: `reference/**`, `test/fixtures/**`, `packages/base/src/typegen.ts`.

## Node.js

Engine requirement: `>=26.0.0` (workspace), `>=24.0.0` (packages). CI runs Node 26.
