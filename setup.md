# ComicWise — Optimized Setup & Copilot Prompts

Generated: 2025-12-10

Purpose

- A short, actionable onboarding & maintenance playbook for contributors and
  Copilot automation.
- Includes: prioritized tasks, acceptance criteria, quick verification, and
  ready-to-paste Copilot Chat / CLI prompts.

Quick verification (run first)

- Install deps
  ```pwsh
  pnpm install
  ```
- Type-check
  ```pwsh
  pnpm type-check
  ```
- Lint
  ```pwsh
  pnpm lint
  ```
- Format check
  ```pwsh
  pnpm format:check
  ```

Top-level priorities

- **P0 (Immediate):** Fix anything that blocks `pnpm type-check` and `pnpm dev`.
- **P1 (High):** Drizzle typing hardening, complete Auth wiring (NextAuth v5 +
  Drizzle adapter), convert admin forms to Zod server-actions.
- **P2 (Medium):** Centralize image uploads, codemods for repetitive refactors,
  seeds & CI.
- **P3 (Low):** Perf, additional tests, docs, accessibility.

How I use Copilot here

- Copy the plain-text Copilot prompts in the task blocks into GitHub Copilot
  Chat or run CLI-assisted workflows. Review diffs before applying.

**Tasks & Copilot Prompts**

- **Repo Health & Fast Failures (P0)**
  - Acceptance: `pnpm install` && `pnpm type-check` pass; `pnpm lint` reports
    zero critical errors.
  - Copilot Chat Prompt: "Scan the repository for TypeScript errors and
    non-aliased imports. Produce a minimal patch to fix import paths (use `src/`
    aliases), remove unused variables, and ensure `pnpm type-check` passes. Show
    file diffs and run `pnpm type-check` after applying."

- **Drizzle Typing Hardening (P1)**
  - Acceptance: Key query/mutation files use typed results (no `any`),
    `pnpm type-check` clean.
  - Copilot Chat Prompt: "Audit `src/database` and add/strengthen types. Export
    typed DB helpers (`databaseTyped`) and update `src/database/queries/*` with
    explicit return types (comics, chapters, users). Provide minimal patches per
    file and run `pnpm type-check` after each patch."

- **Auth Wiring (P1)**
  - Acceptance: NextAuth v5 config, Drizzle adapter wired, sign-in/out pages
    compile in dev.
  - Copilot Chat Prompt: "Ensure NextAuth v5 is configured: add
    `src/lib/authConfig.ts`, `src/lib/authAdapter.ts`, and `src/lib/auth.ts`
    with typed exports. Wire `src/app/api/auth/[...nextauth]/route.ts`. Use
    Nodemailer for email provider and validate required env vars."

- **Convert Admin Forms to Zod Server-Actions (P1)**
  - Acceptance: Admin forms call server actions validated by Zod; client-side
    only handles uploads and UI.
  - Copilot Chat Prompt: "For admin forms (comics, chapters, users, authors,
    artists), convert client handlers to Zod-validated server actions. Add
    schemas to `src/lib/validations/schemas.ts`. Provide patch per entity and
    run `pnpm type-check`. Keep upload logic on client using `useImageUpload`."

- **Centralize Image Upload (P1/P2)**
  - Acceptance: `src/hooks/useImageUpload.ts` used by admin components; upload
    providers under `src/services/upload/*`.
  - Copilot Chat Prompt: "Ensure a typed hook `src/hooks/useImageUpload.ts`
    exists. Add `src/services/upload` adapters (cloudinary, imagekit, local)
    exposing `uploadImage(file, opts)`. Wire admin upload components to the hook
    and update one sample form as proof."

- **Automated Codemods (P2)**
  - Acceptance: `scripts/codemods/*.jscodeshift.js` can run in dry mode and
    produce reviewable diffs.
  - Copilot Chat Prompt: "Run
    `scripts/codemods/replace-upload-with-hook.jscodeshift.js` in `--dry` mode
    across `src/app/admin`. Show a 3-file sample diff. After review, apply
    transform and create branch `refactor/image-upload-hook`."

- **Seeds & Fixtures (P2)**
  - Acceptance: `pnpm db:seed` populates realistic users, comics, chapters;
    supports `--skip-images` and `--dry-run`.
  - Copilot Chat Prompt: "Create/update `src/database/seed/index.ts` to read
    `comics*.json`, `users.json`, `chapters*.json`, apply `faker` for missing
    fields, and support flags `--dry-run`/`--skip-images`. Ensure idempotency
    and add `pnpm` script `db:seed`."

- **CI Template (P2)**
  - Acceptance: `.github/workflows/ci.yml` runs `pnpm install`,
    `pnpm type-check`, `pnpm lint --max-warnings=0`, tests, and archives
    artifacts.
  - Copilot Chat Prompt: "Generate `.github/workflows/ci.yml` with jobs for
    install, type-check, lint, unit tests, and optional Playwright E2E. Upload
    artifacts and fail on errors. Use matrix for Node versions if needed."

Quick commands (copy/paste)

```pwsh
# verification
pnpm install
pnpm type-check
pnpm lint

# run codemod (dry run)
npx jscodeshift -t scripts/codemods/replace-upload-with-hook.jscodeshift.js --extensions=ts,tsx src/app --dry

# run seed (example)
pnpm db:seed --dry-run
```

Acceptance checklist (before merging any major PR)

- [ ] `pnpm type-check` passes (no errors)
- [ ] `pnpm lint` passes (no critical errors)
- [ ] `pnpm build` succeeds
- [ ] Seeds run without error (`pnpm db:seed --dry-run`)
- [ ] Codemods have been dry-run and reviewed

Committing & Branching guidance

- Use focused branches (e.g., `hardening/drizzle-comics`, `feature/auth-wiring`,
  `refactor/image-upload-hook`).
- Make small commits with one logical change each; run `pnpm validate` before
  pushing.

Maintenance notes

- Keep `setup.md` and `setup.txt` in sync. Use `tasks.optimized.txt` for longer,
  editable task lists and `setup.md` as a concise human/Copilot-ready playbook.

Questions or want me to run a Copilot prompt (codemod dry-run or start Drizzle
hardening on `src/database/queries/chapters.ts`) now? Paste which and I'll run
it.
