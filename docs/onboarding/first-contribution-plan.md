# First contribution plan — PREIshare onboarding

## Author
- Name / GitHub handle: Alexis Terry / aterry04
- Feature branch: docs/first-contribution-aterry04
- Date: 2026-09-08

## One-sentence goal
Add myself as a new contributor in `CONTRIBUTORS.md` and append one short pointer in `README.md` so the team can review a tiny first PR.

## Why this surface (link to prior artifacts)
- From `docs/onboarding/repo-map.md`: Safe first-touch includes `docs/onboarding/` and `README.md` (docs-only; no runtime). Default first contribution should not touch `src/router.tsx`, lockfiles, or a not-found `supabase/` tree. `CONTRIBUTORS.md` is the course’s recommended beginner surface (it will be created next step; it is not in the starter tree today).
- From `docs/onboarding/team-orientation-notes.md`: First-PR definition of done requires a small scoped change, work on a feature branch (not `main`), a written description, and a diff a teammate can review without a meeting. A contributors list is named as the right size.
- From `docs/onboarding/ai-tooling-verification.md`: Tooling decision is **GO**. ST2 (never commit `.env`) and ST3 (scope first change to docs, smallest diff) passed. Implementation next may use the agent, but I will refuse any diff outside the files table below.

## In scope (only these)
1. Create `CONTRIBUTORS.md` at the repo root with my name, GitHub handle `@aterry04`, and a one-line role: "Onboarding engineer".
2. Optional second touch (exactly one): append a short **Contributors** note at the end of `README.md` that links to `CONTRIBUTORS.md`. Do not rewrite install/dev instructions.
3. Capture implementation notes later in `docs/onboarding/first-contribution-notes.md` (next step—not done here).

## Out of scope (explicitly not this PR)
- Auth, sessions, or environment secrets
- Database schema, migrations, Supabase policies, or pgvector changes
- Dependency upgrades or lockfile churn unrelated to the contribution
- Multi-package refactors, renames, or formatting the whole repo
- CI/CD workflow edits unless a mentor explicitly assigns them
- Edits to `src/` (including `src/routes/about.tsx`), `package.json`, `package-lock.json`, `vite.config.ts`, `src/routeTree.gen.ts`, `.env`, `AGENTS.md`, or `.cursor/rules/`

## Likely files to change
| File | Action | Why |
|------|--------|-----|
| CONTRIBUTORS.md | create | Add my contributor entry (name, `@aterry04`, onboarding engineer) |
| README.md | edit (append only) | One short Contributors pointer; do not change `npm` instructions |
| docs/onboarding/first-contribution-notes.md | create (next step) | Record what the agent did and what I verified |

This planning step also saves `docs/onboarding/first-contribution-plan.md` (this file). It is not part of the product change; it is the contract for the next step.

## Acceptance criteria
- [ ] I am on feature branch `docs/first-contribution-aterry04` (not the default branch `main`).
- [ ] `CONTRIBUTORS.md` lists my name (Alexis Terry) and GitHub handle (`aterry04`) in a consistent Markdown format.
- [ ] The second touch is limited to `README.md` and only adds a Contributors pointer; install/dev commands are unchanged.
- [ ] No secrets, `.env` files, or generated build artifacts are included.
- [ ] A teammate can review the diff in under 10 minutes without product-context deep dives.

## Verification plan (how I will know it worked)
1. `git status` / `git branch --show-current` show I am on `docs/first-contribution-aterry04` with only expected files modified.
2. Open `CONTRIBUTORS.md` and confirm my row/section renders as plain Markdown.
3. Open `README.md` and confirm the new Contributors note is at the end and that `npm install` / `npm run dev` text is untouched. Skip running the dev server; this PR is docs-only.
4. Skim `git diff` and confirm nothing outside the likely-files table appears (`src/`, lockfiles, rules files, `.env`).

## Risks and mitigations
- Risk: Agent expands scope into app core. Mitigation: refuse diffs that touch files not listed above; re-prompt with the out-of-scope list.
- Risk: Editing default branch by mistake. Mitigation: check `git branch --show-current` before every edit session; it must print `docs/first-contribution-aterry04`.
- Risk: Rewriting `README.md` instead of appending. Mitigation: accept only an added Contributors section; restore any unrelated README edits.

## Definition of done for this planning step
- [x] Feature branch name chosen: `docs/first-contribution-aterry04` (create it in the Windows clone before implementing).
- [x] This plan file saved at `docs/onboarding/first-contribution-plan.md` with all sections filled (no angle-bracket placeholders left).
- [x] Ready to implement in the next step without re-deciding scope.
