# Pull request description — first PREIshare contribution

**PR URL:**  https://github.com/EdTechForLearning/PREIShare-org-repo/pull/10 
**Base repository:** EdTechForLearning/PREIShare-org-repo
**Base branch:** main
**Head repository (my fork):** aterry04/PREIShare-org-repo
**Compare branch:** docs/first-contribution-aterry04
**Author:** Alexis Terry / aterry04
**Date opened:** 2026-09-08

## Title (use this on GitHub)

`docs: add onboarding contributor entry for aterry04`

## Problem
PREIshare had no clear, reviewed onboarding contribution from this engineer yet.
The team needs a small, low-risk change that proves the Git → review → merge path works
for a new teammate without touching product runtime code.

## Approach
- Added a personal entry to `CONTRIBUTORS.md` (create the roster; one row for Alexis Terry / `aterry04`, role Onboarding engineer, date 2026-09-08).
- Appended a short Contributors pointer at the end of `README.md` that links to `CONTRIBUTORS.md`. Did not rewrite install or `npm` instructions.
- Recorded implementation cycles in `docs/onboarding/first-contribution-notes.md`.
- Followed `docs/onboarding/first-contribution-plan.md`. Docs-only; no `src/`, lockfile, auth, or Supabase edits.

## What reviewers should look at
- [x] `CONTRIBUTORS.md` — one table row: Alexis Terry, `aterry04`, Onboarding engineer, 2026-09-08; no email or tokens
- [x] `README.md` — only an appended Contributors section; Getting Started / `npm` commands unchanged
- [x] Intended paths only: `CONTRIBUTORS.md`, `README.md`, `docs/onboarding/first-contribution-notes.md`, `docs/onboarding/pr-description.md`, `docs/onboarding/review-response-notes.md` (plus earlier onboarding docs if already on the branch). No `.env`, `node_modules`, or `src/`
- [x] Commit subject states why: `docs: add onboarding contributor entry for aterry04`

## Test plan
1. Open Files changed. Expected paths: `CONTRIBUTORS.md`, `README.md`, `docs/onboarding/first-contribution-notes.md`, `docs/onboarding/pr-description.md`, `docs/onboarding/review-response-notes.md`. Reject the PR if `src/`, `package-lock.json`, or `.env` appear.
2. In the `CONTRIBUTORS.md` diff, confirm the table has Name, GitHub, Role, and Onboarded, and the `aterry04` cell links to `https://github.com/aterry04`.
3. In the `README.md` diff, confirm it is an append (new `## Contributors` heading). Original `npm install` / `npm run dev` lines must still be present and unchanged.
4. Search the diff for `sk-`, `eyJ`, `BEGIN PRIVATE KEY`, `password=`, and Windows paths like `C:\users\` — expect none in committed file contents (setup-log may mention a clone path from an earlier step; that log is not a secret, but `.env` values must not appear).
5. (Optional) Check out `docs/first-contribution-aterry04` and preview `CONTRIBUTORS.md`.

## Risk
Docs-only. Residual risk: opening the PR against the fork’s `main` instead of `EdTechForLearning/PREIShare-org-repo:main`. Confirm the four compare fields before merge.

## Screenshots / notes
No UI screenshots (docs-only change).  
Implementation decisions: `docs/onboarding/first-contribution-notes.md`.  
Review loop: `docs/onboarding/review-response-notes.md`.

## Checklist before requesting review
- [ ] Feature branch is pushed to **origin** (`aterry04/PREIShare-org-repo`), not upstream (confirm on the clone)
- [ ] PR is cross-fork: `EdTechForLearning/PREIShare-org-repo:main` ← `aterry04/PREIShare-org-repo:docs/first-contribution-aterry04`
- [x] PR title is specific: `docs: add onboarding contributor entry for aterry04`
- [x] Description states problem, approach, test plan, and risk
- [x] I can explain every staged line if a reviewer asks
