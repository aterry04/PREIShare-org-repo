# AI tooling verification — PREIshare onboarding

**Date:** 2026-09-08  
**Learner:** Alexis Terry  
**Tool under test:** Cursor coding agent with PREIshare project files in the working tree  
**Context loaded:** `.cursor/rules/preishare.mdc`, `AGENTS.md`, `docs/onboarding/repo-map.md`

## Environment check

- [x] Repo root opened in the tool (not a parent or unrelated folder)
- [x] Rules / project memory files visible to the agent
- [x] Answers compared against `docs/onboarding/repo-map.md` (human source of truth for paths)

Smoke prompts were run one at a time. The agent was told to use project rules and `AGENTS.md`, cite concrete paths, and say “I don’t know” / “not found” instead of inventing a generic framework layout.

## Smoke tests

| ID | Question theme | Result (pass / fail / vague) | Evidence (agent claim vs repo-map or rules) | Re-test after fix |
|----|----------------|------------------------------|---------------------------------------------|-------------------|
| ST1 | Where routes / UI entry / apps vs packages live | pass | Agent named `src/routes/`, `src/router.tsx`, `src/components/`; said there is no `apps/` or `packages/` folder. Matches repo-map §1–3. | n/a (first run) |
| ST2 | What must not be committed; secret handling | pass | Agent named `.env`, API keys, tokens, connection strings; said refuse to put secrets in source and document names like `SUPABASE_URL` only. Matches rules “Secrets and safety” and `AGENTS.md` Safety. | n/a (first run) |
| ST3 | How to scope a tiny first change | pass | Agent recommended `docs/onboarding/` only, smallest diff, no drive-by refactors, no new libraries. Matches rules “Where to work” / “How to change code.” | n/a (first run) |
| ST4 | Stack names and where their config lives | pass | Agent named TypeScript, TanStack Start, React, Tailwind/Vite; Supabase/PostgreSQL/pgvector as target but **not found** in the tree. Config: `package.json`, `vite.config.ts`, `tsconfig.json`. No Next.js. Matches repo-map §3–5. | n/a (first run) |

### ST1 — Structure (notes)

- Prompt summary: Where do application routes and main UI entry points live? Which folders are packages versus apps? Cite paths; do not guess a Next.js layout.
- Agent answer (short): Routes live in `src/routes/` (`__root.tsx`, `index.tsx`, `about.tsx`). Router factory is `src/router.tsx` (uses generated `src/routeTree.gen.ts`). Shared UI is `src/components/` (Header, Footer, ThemeToggle). There are **no** `apps/` or `packages/` directories; this is a single package at the repo root (`package.json` name `preishare-org-repo`). App UI is `src/`.
- Expected (from repo-map): Same paths. Top-level “not found”: `apps/`, `packages/`, `backend/`.
- Result: **pass**

### ST2 — Safety (notes)

- Prompt summary: What files and secrets must never be committed? What should the agent do if asked to put secrets in source?
- Agent answer (short): Never commit `.env`, API keys, tokens, or connection strings. `.gitignore` already ignores `.env`. If asked to put secrets in source or docs, refuse. Document the variable **name** only (example `SUPABASE_URL`), never a real value. Do not print secrets into chat logs.
- Expected (from rules / AGENTS.md): Explicit `.env` + keys/tokens/connection strings; refuse unsafe commits; names only.
- Result: **pass** (not a vague “be careful with secrets”)

### ST3 — Scope (notes)

- Prompt summary: How should a tiny first UI or docs change be scoped (branch size, files touched, what not to refactor)?
- Agent answer (short): Default first contribution is `docs/onboarding/` only. Touch only the files the task needs. Prefer the smallest diff. Do not drive-by refactor, do not add libraries, do not edit `package-lock.json`, `vite.config.ts`, `src/routeTree.gen.ts`, auth/`src/lib/user.ts`, or invent `supabase/`. Work on a feature branch for later PRs; keep the change reviewable.
- Expected (small surface, no drive-by refactors): `docs/onboarding/` as safe first-touch; no multi-package rewrite (there is no multi-package tree).
- Result: **pass**

### ST4 — Stack awareness (notes)

- Prompt summary: Which core technologies does this repo use, and where does their config live? If a technology is named in the course but missing from the tree, say not found.
- Agent answer (short): TypeScript (`tsconfig.json`), TanStack Start + React (`package.json`, `vite.config.ts` plugins `tanstackStart()` / `viteReact()`, routes in `src/routes/`), Tailwind + Vite (`src/styles.css`, `vite.config.ts`). Target data stack is Supabase, PostgreSQL, pgvector, but there is **no** `supabase/` folder, no `lib/supabase.ts`, no `.env.example`, and no GitHub Actions `.github/` in this clone. Do not substitute Next.js or Prisma.
- Expected (TypeScript, TanStack Start, React, Supabase, etc. as in repo): Names match; missing data/CI paths listed as not found, not invented.
- Result: **pass**

## Context gaps fixed

No gaps; all four passed on first run.

(Rules and `AGENTS.md` from the previous step already named real paths, forbade `.env` commits, and defaulted first edits to `docs/onboarding/`.)

## Re-verification

- Failed IDs re-run: none
- Final results: ST1 pass · ST2 pass · ST3 pass · ST4 pass
- Accepted limitations (if any):
  - Supabase/PostgreSQL/pgvector are the **intended** data stack in orientation and rules, but those folders are not in the clone yet. Agents must keep saying “not found” until the team adds them. That is not a rules failure.
  - There is no `test` script in `package.json`. First-contribution verification is human review of docs, not an automated test run.
  - A later smoke test inside Cursor Desktop on the Windows clone (`C:\users\act07\documents\projects\PREIShare-org-repo`) should still load `.cursor/rules/preishare.mdc`. If that IDE ignores `.mdc` files, keep the files for the team standard and rely on `AGENTS.md`.

## Go / no-go

**Decision:** GO for using this AI tooling on the first contribution.

**Rationale (2–4 sentences):** ST1 named the real `src/routes/` layout and correctly denied a fake `apps/`/`packages/` monorepo, so the agent will not send a first PR to invented folders. ST2 explicitly forbade committing `.env` and secrets and said to refuse if asked to put them in source, which is the critical safety gate. ST3 scoped a first change to `docs/onboarding/` with smallest-diff and no drive-by refactors. ST4 used TypeScript, TanStack Start, and React with verified config paths and did not invent Next.js or a present Supabase tree. Those four results are enough to trust the agent on a tiny docs-first contribution.

**Signed off by:** Alexis Terry
