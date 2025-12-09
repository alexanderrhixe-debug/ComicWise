# Copilot Chat Prompts — Project Setup & Update Guide (Optimized)

Purpose: A ready-to-use collection of concise, high-signal prompts and
step-by-step actions you paste into GitHub Copilot Chat to fully setup, update,
and harden the ComicWise project. Use these prompts iteratively — run commands
locally when prompted, review suggested code changes, and approve commits/PRs.

**How to use**

- Open GitHub Copilot Chat in your repo. Paste the prompts below as separate
  messages (start from the top). For code transforms, ask Copilot Chat to create
  PR branches and commit changes.
- After each major step, run the recommended commands locally: `pnpm install`,
  `pnpm type-check`, `pnpm lint`, `pnpm build`, and `pnpm test`.

**Prerequisites**

- Node.js 22+ (recommended), Corepack enabled
- pnpm 9+ (or use `corepack enable`)
- Docker & Docker Compose (if using containerized DB)
- An initialized `.env.local` or production `.env` file (see `README.md`)

**Files & places this guide touches**

- `package.json`, `pnpm-workspace.yaml`, `tsconfig.json`, `Makefile`
- `src/` code, especially `src/hooks/`, `src/types/`, `src/components/`,
  `src/lib/`, `src/database/`
- `compose/` Dockerfile and scripts
- Existing helper script: `scripts/generate-stub-types.ts`

---

## 1) Quick sanity prompts (run first)

Paste to Copilot Chat:

"Inspect the repository and list any obvious missing dev setup or failing tasks
like missing types, broken imports, or required environment variables. Output a
short actionable checklist prioritized by safety and impact. Include commands to
run locally to validate each item."

Expected assistant actions:

- List `pnpm install`, `pnpm -s run type-check`, `pnpm lint`, `pnpm test` as
  verification steps.
- Suggest running `pnpm run types:generate` if `node_modules` missing.

Commands to run locally (after review):

```pwsh
pnpm install
pnpm -s run type-check
pnpm lint
pnpm test
```

---

## 2) Install missing `@types/*` packages

Prompt to Copilot Chat:

"Search `package.json` for dependencies without types and automatically install
`@types/...` packages where they exist. For each package without community
types, generate a minimal stub under `src/types/` using
`scripts/generate-stub-types.ts`. Provide the exact `pnpm` commands and confirm
`tsconfig.json` includes `./src/types` in `typeRoots`."

Example follow-up commands (run locally):

```pwsh
pnpm add -D @types/react-dropzone @types/lodash @types/node # (example — run only what Copilot recommends)
pnpm run types:generate
pnpm -s run type-check
```

Notes for Copilot Chat:

- Use the existing `scripts/generate-stub-types.ts` script — update it only to
  refine a stub if necessary.
- If any package provides its own types (bundled in
  `node_modules/<pkg>/package.json`), prefer that over installing `@types/*`.

---

## 3) Tighten high-impact stubs (recommended packages)

Goal: Replace `any` stubs for critical libraries with minimal accurate types.

High-impact targets (suggested priority):

- `@react-email/components` — `Img`, `Heading`, `render` signatures
- `color` — `rgb()`, `hsl()`, object/array outputs
- `recharts` — `LegendProps`, `BarChart` props like `barSize`, `maxBarSize`
- `react-dropzone` — `DropEvent` and `FileWithPath` usages

Prompt to Copilot Chat (example):

"For the package `color` (npm `color@5.x`), provide a compact TypeScript
declaration for the parts used in the repo: declare module 'color' with `Color`,
`rgb()`, `.object()`, `.array()`, and `.hex()` signatures. Place it under
`src/types/color.d.ts`. Make types narrow but avoid overfitting to single
internal API shapes."

After each change: run `pnpm -s run type-check` and fix remaining TS errors.

---

## 4) Migrate imports to canonical aliases

Goal: Ensure imports use the repo's path aliases to improve clarity and make
refactors safe: convert `hooks/*` to `src/hooks/*`, `types/*` to `src/types/*`,
and bare `database` imports to `src/database` barrel.

Prompt to Copilot Chat:

"Search the codebase for imports like `from 'hooks/...` or `from '../hooks'`.
Replace them with `from 'src/hooks/...'` or the path alias configured in
`tsconfig.json`. Do the same for `types` imports to `src/types/*`. Produce a
patch/PR and a summary of changed files. Run `pnpm -s run type-check` after the
refactor and list new errors (if any)."

Notes:

- `tsconfig.json` already has `"hooks/*": ["./src/hooks/*"]` and
  `"types": ["./src/types/index"]`.
- Prefer updating only files that import using the non-aliased path.

---

## 5) Create and centralize helpers/hooks (examples)

Goal: Add small helpers under `src/hooks/` and `src/lib/` to remove duplication
and supply safe runtime guards.

Suggested helper files to add (if missing):

- `src/hooks/use-mobile.ts` — already exists; ensure it’s exported as default
  and typed.
- `src/lib/validation/guard.ts` — small runtime helpers: `isString`, `isNumber`,
  `isRegExpMatch`, `safeGet`.
- `src/hooks/use-pagination.ts` — centralize pagination logic for tables.

Prompt to Copilot Chat:

"Scan for repeated utility logic (regex guards, color parsing, optional chaining
usage) and suggest small helper functions to centralize these behaviours. For
each helper, produce a complete TypeScript file under `src/lib/` or `src/hooks/`
and update callers to import the helper."

After changes: run `pnpm -s run type-check` and `pnpm lint`.

---

## 6) Database & Drizzle tasks

Prompt to Copilot Chat:

"Verify the Drizzle ORM config and the `drizzle.config.ts` file for type
compatibility. If the Drizzle CLI needs a casting workaround, propose the
minimal type-safe change. Provide commands to regenerate schema types and
migrations."

Commands to run locally:

```pwsh
pnpm db:generate
pnpm db:push
pnpm db:seed
```

Notes:

- The Dockerfile sets `pnpm db:generate` in the build stage; ensure CI respects
  the same sequence.

---

## 7) Tests, CI, and Playwright

Prompt to Copilot Chat:

"Review the Playwright and Vitest configs. Suggest a minimal CI workflow for
GitHub Actions that runs `pnpm install`, `pnpm -s run type-check`, `pnpm lint`,
`pnpm test` (unit + E2E), and uploads artifacts/reports to the run. Provide a
reusable `.github/workflows/ci.yml` template."

Suggested checks in CI:

- `pnpm -s run type-check` (fail fast)
- `pnpm lint` (with `--max-warnings=0` option in strict mode)
- `pnpm test:unit:run` and Playwright E2E (optionally in a matrix for browsers)

---

## 8) Docker & Production recommendations

Prompt to Copilot Chat:

"Audit `compose/Dockerfile` and `docker-compose.yml` for best practices: user
non-root run, multi-stage build caching, secret handling, and healthchecks.
Produce a small report listing any missing hardening or caching improvements and
a `docker-compose.prod.yml` snippet for production-ready deployment."

Key recommendations to include:

- Use `--mount=type=secret` for production env values in build stage if
  supported by platform.
- Limit layer size, remove dev deps in final image, and use a non-root user
  (already present in `compose/Dockerfile`).

---

## 9) Security & Environment

Prompt to Copilot Chat:

"Check the repository for possible secrets, and ensure `.env.example` is present
and `.env.local` is documented. Produce a checklist of env variables required
for local development and production, and suggest a `security.md` entry listing
rate-limiting, Redis/Upstash keys management, and secret rotation guidance."

---

## 10) Automated PR Template for changes Copilot proposes

Use this when asking Copilot to open a PR:

Title: `chore(types): add missing package types and tighten stubs` Description:

- What changed: Installed missing `@types/*` and added refined stubs in
  `src/types/`.
- Why: Improve developer DX and enable full TypeScript checking.
- How to test: `pnpm install && pnpm -s run type-check && pnpm lint`.

Checklist:

- [ ] Type-check passes
- [ ] E2E smoke tests pass locally
- [ ] No secrets in the diff

---

## 11) Concrete Copilot Chat session script (multi-message flow)

1. System message: "You are a helpful code assistant with repo-level context.
   Provide patches and PRs, and be conservative: always propose tests and
   commands to validate changes."
2. User message 1: Paste the single-line request: "Audit this repo for missing
   types and unused imports, then propose an automated plan to make TypeScript
   pass with `pnpm -s run type-check`. Include exact `pnpm` commands and PRs to
   make."
3. Assistant: Review output and ask for permission to apply patches.
4. User message 2 (if approve): "Apply the following patches and open a branch
   named `chore/ts-types-{timestamp}`. After each patch, run
   `pnpm -s run type-check` and report any remaining errors."

Note: For large automatic changes, always open a draft PR and run CI before
merging.

---

## 12) File-by-file starter actions (high-impact targets)

- `src/types/` — Add precise types for `color`, `recharts`,
  `@react-email/components`, `react-dropzone`, `input-otp`.
- `src/hooks/*` — Ensure exports are typed and consumed via `src/hooks/*`
  imports.
- `src/lib/cache.ts` & `src/services/cache.service.ts` — Verify Upstash vs
  ioredis APIs; add guards and typed wrappers.
- `drizzle.config.ts` — Minimize `any` casts; add a small type-safe wrapper if
  needed.
- `compose/Dockerfile` — Confirm secrets & build arg usage; keep healthcheck.

---

## 13) Post-change validation (run these after large changes)

```pwsh
pnpm install
pnpm -s run type-check
pnpm lint
pnpm test:unit:run
pnpm test  # Playwright E2E (optional locally or in CI)
pnpm build
```

If any step fails, paste the first 50 TypeScript errors to Copilot Chat and ask
for incremental fixes.

---

## 14) Example targeted prompts (copy/paste)

- "Create a TypeScript declaration for `color` limited to `.rgb().object()` and
  `.hex()` and place it in `src/types/color.d.ts`. Make it as narrow as
  possible."
- "Refactor all imports from `from 'hooks/...` to `from 'src/hooks/...'` and run
  type-check. Provide a patch and the list of updated files."
- "Generate a GitHub Actions workflow `.github/workflows/ci.yml` that runs
  type-check, lint, and tests, and uploads test artifacts."

---

## 15) Suggested iteration cadence

- Phase 1: Install missing `@types` and run `pnpm -s run type-check`.
- Phase 2: Repair high-volume TypeScript errors with conservative runtime guards
  and minor local patches.
- Phase 3: Tighten stubs and add narrow declarations for high-value libs.
- Phase 4: Update imports to path aliases and centralize helpers.
- Phase 5: Add CI workflow and run full test suite.

---

## 16) Quick reference — Important commands

- Install: `pnpm install`
- Type-check: `pnpm -s run type-check`
- Lint: `pnpm lint`
- Build: `pnpm build`
- Start dev: `pnpm dev`
- Generate stubs: `pnpm run types:generate`
- DB: `pnpm db:generate && pnpm db:push && pnpm db:seed`

---

## 17) Next steps I can take for you (choose one)

- Run a repository-wide scan for non-aliased imports and produce a patch
  replacing them with `src/*` aliases.
- Generate refined `d.ts` files for the high-impact libraries listed and re-run
  `pnpm -s run type-check` to surface remaining fixes.
- Create a draft GitHub Actions `ci.yml` and a PR branch with the changes.

---

File created: `prompts.md` — copy any parts to GitHub Copilot Chat to run the
suggested automated flows.

---

End of file.
