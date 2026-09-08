# PREIshare onboarding handoff

**Author:** Alexis Terry (@aterry04)  
**Date:** 2026-09-08  
**Branch / PR:** `docs/first-contribution-aterry04` — compare URL (live `/pull/N` not recorded yet): https://github.com/EdTechForLearning/PREIShare-org-repo/compare/main...aterry04:PREIShare-org-repo:docs/first-contribution-aterry04  
**Audience:** mentor, future self, sprint lead

## 1. Stakeholder summary (plain language)

I completed PREIshare engineering onboarding for Sprint 1 (dev environment and AI tooling). I forked the team repository, cloned my fork, wired up origin and upstream, verified Git on Windows, configured Cursor-style project rules and agent memory, mapped the repo well enough to choose a safe first contribution, and prepared a small docs-only pull request that follows the team’s Git and review habits. PREIshare remains a real-estate intelligence product; this work does not ship a product feature—it proves I can join the team workflow safely.

**My three source-of-truth bullets (written before this draft):**
1. **Done means:** a verified fork/clone with remotes, AI rules that passed a four-question smoke test, and a tiny contributors/README change on a named feature branch with a written review loop.
2. **Open risk:** Node/npm versions and `npm run dev` were never recorded; some onboarding markdown landed on GitHub later than others; the live PR number is still TODO.
3. **Do not redo next sprint:** fork, clone path, `origin`/`upstream`, Git identity, or rewriting `.cursor/rules/preishare.mdc` / `AGENTS.md` from zero.

**Definition of done met:**
- [x] Fork created, local clone of my fork, both remotes and toolchain verified (see setup log) — Git identity and remotes PASS; Node/npm **not** in the setup log
- [x] AI rules / project memory in place and smoke-tested (ST1–ST4 pass, decision **GO**)
- [x] First contribution implemented on feature branch `docs/first-contribution-aterry04` (`CONTRIBUTORS.md` + README pointer + notes)
- [ ] PR opened with a live `/pull/N` URL — description and compare link exist; replace TODO when GitHub assigns a number

## 2. Deliverables index (what exists and where)

| Artifact | Path | Why it matters |
| --- | --- | --- |
| Team orientation notes | docs/onboarding/team-orientation-notes.md | Mission, workflow, first-PR definition of done |
| Setup log | docs/onboarding/setup-log.md | Auditable proof of accounts, fork, Git identity, clone, remotes |
| Repo map | docs/onboarding/repo-map.md | Layout is a **single package** at repo root (no `apps/` or `packages/`); safe vs do-not-edit surfaces |
| AI tooling verification | docs/onboarding/ai-tooling-verification.md | Evidence agents respect PREIshare stack/conventions |
| Project rules | .cursor/rules/preishare.mdc | Persistent IDE-agent constraints (`alwaysApply: true`) |
| Agent memory entrypoint | AGENTS.md | Cross-tool project context for coding-agents |
| First contribution plan | docs/onboarding/first-contribution-plan.md | Scoped plan before implementation |
| Contribution notes | docs/onboarding/first-contribution-notes.md | Multi-cycle log of what changed and why |
| Contributors credit | CONTRIBUTORS.md | Visible first contribution surface |
| PR description | docs/onboarding/pr-description.md | Reviewer-facing summary and test plan |
| Review response notes | docs/onboarding/review-response-notes.md | How simulated feedback was handled |
| This handoff | docs/onboarding/onboarding-handoff.md | Single entry point for mentors |

## 3. Environment and toolchain snapshot

Copied from `docs/onboarding/setup-log.md` only (no invented versions):

- OS: Windows (PowerShell); Git `2.55.0.windows.3`
- Git user.name / user.email configured: **yes** (`Alexis Terry` / GitHub-tied email recorded in the setup log)
- Node / package manager versions: **TODO** — not recorded in the setup log; do not assume a version
- origin (my fork) URL: `https://github.com/aterry04/PREIShare-org-repo.git`
- upstream (team repo) URL: https://github.com/EdTechForLearning/PREIShare-org-repo
- Local clone path: `C:\users\act07\documents\projects\PREIShare-org-repo`
- Install/build/test commands run and result: **not run this sprint** (docs-only first PR; `package.json` scripts exist: `dev`, `build`, `preview`, `generate-routes`; **no `test` script**)
- Blockers hit and how resolved: ran `git remote add upstream` twice; `git remote -v` still correct (second add would be “already exists”). Later, some `docs/onboarding/*.md` files existed locally before they were all on GitHub — fix is `git add` + commit + push on the feature branch (or GitHub Desktop on the **same** folder), not a second clone.

## 4. AI tooling posture

- Rules file purpose (one sentence): `.cursor/rules/preishare.mdc` tells agents PREIshare’s stack, docs-first safe surfaces, smallest-diff habit, and never-commit-`.env` rules on every chat (`alwaysApply: true`).
- AGENTS.md purpose (one sentence): human-and-agent handbook that points at the rules file, `docs/onboarding/`, verified `src/` layout, and the real npm scripts.
- Smoke-test prompt used and whether the agent correctly named stack pieces (TypeScript, TanStack Start, React, Supabase, PostgreSQL, pgvector): four separate prompts (structure, secrets, scope, stack). Agent named TypeScript, TanStack Start, React, and Tailwind/Vite with real paths; named Supabase/PostgreSQL/pgvector as the **course target** and said those folders are **not found** in this clone. Decision **GO**. See `docs/onboarding/ai-tooling-verification.md`.
- Context gaps found and fixes applied: none on first run (“No gaps; all four passed on first run”).

## 5. First contribution and review outcome

- Plan goal (from first-contribution-plan.md): add Alexis Terry to `CONTRIBUTORS.md` and append a short Contributors pointer on `README.md`.
- Files touched (planned + review follow-up): `CONTRIBUTORS.md`, `README.md` (append only), `docs/onboarding/first-contribution-notes.md`, `docs/onboarding/pr-description.md`, `docs/onboarding/review-response-notes.md`
- PR title and link: `docs: add onboarding contributor entry for aterry04` — compare: https://github.com/EdTechForLearning/PREIShare-org-repo/compare/main...aterry04:PREIShare-org-repo:docs/first-contribution-aterry04 — **TODO:** paste live `https://github.com/EdTechForLearning/PREIShare-org-repo/pull/N` when it exists
- Review-style feedback received (summary): three **blocking** items (missing PR URL, vague test-plan file list, unchecked checklists); one **non-blocking** request to drop README (declined — it was in the plan); one **non-blocking** request to make the “add a row” instruction visible in `CONTRIBUTORS.md` (accepted)
- Changes made in response: compare URL + exact file allow-list + honest checkboxes in `pr-description.md`; visible add-row sentence in `CONTRIBUTORS.md`; decisions in `review-response-notes.md`
- Merge readiness: **ready with follow-ups** — content is docs-only and review comments are resolved or declined in writing. Still need: (1) remaining onboarding files committed/pushed on `docs/first-contribution-aterry04` if GitHub is missing them, (2) cross-fork PR against `EdTechForLearning/PREIShare-org-repo:main`, (3) live `/pull/N` recorded, (4) a human mentor glance at compare fields. **Not merged** (by design; onboarding does not self-merge).

## 6. Open risks and environment gaps

1. Node.js / npm versions and `npm run dev` were never captured — next sprint must verify the app boots before any UI feature work.
2. This clone has no `supabase/` folder, no `.env.example`, and no GitHub Actions yet. Do not invent them.
3. Live PR `/pull/N` is not in the notes; only the compare URL is. Human review of the GitHub PR is still outstanding.
4. GitHub showed only three files under `docs/onboarding/` at one point (`first-contribution-plan.md`, `pr-description.md`, `review-response-notes.md`). Other onboarding markdown must be committed from the existing clone, not rewritten from memory.

## 7. Decisions log (for stakeholders)

| Decision | Choice | Rationale |
| --- | --- | --- |
| First contribution surface | `CONTRIBUTORS.md` plus append-only `README.md` | Matches the written plan; low runtime risk; README-only-drop was declined in review |
| Branch naming | `docs/first-contribution-aterry04` | Describes docs work + handle; not `main` |
| AI tool category used most | coding-agent for files; chat-assistant for review role-play and PR prose | Agent could read the tree; review simulation did not need a mega-prompt rewrite |
| Remotes | `origin` = fork, `upstream` = team repo | No push access to EdTechForLearning; PRs are cross-fork |
| Git GUI | Optional GitHub Desktop on the **same** folder `C:\users\act07\documents\projects\PREIShare-org-repo` | GUI is not a second clone; uncommitted files still need `commit` + `push` |

## 8. Next-sprint preview (what this unlocks)

The next sprint topic can assume:

1. **Trusted local Git environment** — fork, clone path, `origin`/`upstream`, and Git identity are in `setup-log.md`. Re-run only if the OS or Git install changes. **Do not** redo the fork/clone unless the folder is gone.
2. **AI alignment** — `.cursor/rules/preishare.mdc` and `AGENTS.md` exist and passed smoke tests. Extend them when new packages appear; do not start from a generic Next.js template.
3. **Git habit** — feature branch → named files → commit → push to origin → PR → respond to review was practiced. GitHub Desktop may be used as another view of the same repo.
4. **First PR path** — onboarding contribution is merge-ready **with follow-ups** listed above; feature work should use the same small-diff quality bar.

**Explicitly out of scope until later:** large product features, production deployments, Vercel/Hobby URL work if not assigned yet, and database/Supabase/pgvector migrations (those folders are not in the clone).

## 9. Ask for mentor

- Questions still open:
  - What is the live PR number once the cross-fork PR exists, and should remaining `docs/onboarding/` files ride on this same PR?
  - When should Node/`npm run dev` be verified relative to the next sprint’s first UI task?
  - Confirm compare fields: `EdTechForLearning/PREIShare-org-repo:main` ← `aterry04:docs/first-contribution-aterry04`
- Review of this handoff requested: **yes**
- Preferred follow-up time or channel: course mentor / PAUL check on `docs/onboarding/onboarding-handoff.md` plus the GitHub PR when the `/pull/N` URL is pasted into `pr-description.md`

---

*End of handoff. Keep this file updated if merge status or env gaps change before the next sprint starts.*
