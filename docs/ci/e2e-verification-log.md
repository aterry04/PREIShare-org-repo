# PREIshare PR CI — End-to-End Verification Log

**Date:** 2026-11-22
**Verifier:** Alexis Terry
**Repo / branch used:** `main` at `22ced34` (clean working tree, same commit as `origin/main`). No pull request was opened.
**Inputs checked:**
- `.github/workflows/pr-ci.yml`
- `docs/ci/ci-scripts-notes.md`
- `docs/ci/branch-protection-checklist.md`
- `docs/ci/ai-pr-review-prompts.md`

---

## 1. Static workflow review

| Check | Result (pass/fail) | Evidence / notes |
| --- | --- | --- |
| Triggers on `pull_request` (branches as designed) | pass | `on.pull_request.branches` is `main` only. Types are `opened`, `synchronize`, `reopened`. No `push` trigger. |
| Job name(s) clear for GitHub status checks | pass | Workflow `name` is `PR CI`. Job id is `ci`. Job `name` is `Quality checks`. Intended check label: `PR CI / Quality checks`. Not confirmed on a live run. |
| Step order: checkout → runtime setup → install → typecheck → build → lint → test | pass | That generic order is not what this repo uses. The file matches `docs/ci/ci-scripts-notes.md`: checkout, Node 22, `npm ci`, lint, typecheck, test, build. |
| Each `run:` matches scripts in `docs/ci/ci-scripts-notes.md` | pass | `npm ci`, `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`. |
| Caching / dependency install strategy present and sensible | pass | `actions/setup-node@v4` with `cache: npm` and `npm ci` against `package-lock.json`. Build output is not cached. |
| Fail-fast behavior acceptable (failed step fails the job) | pass | No `continue-on-error` on any step. |
| No plaintext secrets or unsafe `${{ }}` expansions in logs | pass | Build env is the two public placeholders from `.env.example`. No `SUPABASE_SERVICE_ROLE_KEY` or `EMBEDDING_API_KEY`. Concurrency uses `github.workflow`, `github.event.pull_request.number`, and `github.ref` only. |

**Static review summary:** The workflow is a pull-request gate into `main`, with one job and the five commands from the script notes. Step order follows the pipeline design (lint and test before build), not a generic typecheck-then-build-then-lint list. Nothing in the file deploys or prints a server secret. Whether GitHub shows the check under the expected name is still unproven.

---

## 2. Local CI command dry-run

Commands were run in workflow order on 2026-11-22. `npm ci` finished before the others. Each later command exited 0.

| Step | Exact command | Exit (pass/fail) | Notes |
| --- | --- | --- | --- |
| Install | `npm ci` | pass | Added 204 packages. npm also printed 8 dependency advisories (2 moderate, 3 high, 3 critical). Not fixed in this pass. |
| Lint | `npm run lint` | pass | Printed `lint: client and route files do not name the service-role key`. |
| Typecheck | `npm run typecheck` | pass | `tsc --noEmit` printed no errors. |
| Test | `npm run test` | pass | 3 tests passed, 0 failed. `node --test` exited. |
| Build | `npm run build` | pass | `vite build` completed and printed the local preview hint. This machine already has `.env.local`, so the build was not repeated with only the workflow placeholders. |

**Environment notes:** Node `v24.14.0`, npm, Windows. The workflow asks for Node 22. This dry-run did not install Node 22.

**Local dry-run summary:** The full sequence succeeded on the first pass on this machine. Nothing broke. Node 24 is not the runner version, and the build was not isolated from `.env.local`.

---

## 3. PR → CI loop checklist

No Actions run exists. Statuses below are from reading the files, not from GitHub.

| Checklist item | Status (Ready / Needs work / Blocked) | Evidence |
| --- | --- | --- |
| Workflow runs on pull requests | Ready | YAML triggers `pull_request` into `main`. No Actions URL. A live run was not opened. |
| Check names suitable as required status checks | Needs work | Checklist names `PR CI / Quality checks`. GitHub has not shown that label yet. |
| Concurrency / duplicate-run behavior acceptable | Ready | `cancel-in-progress: true` and group `pr-ci-${{ github.workflow }}-${{ github.event.pull_request.number \|\| github.ref }}`. A cancel was not watched. |
| Human still required for merge (CI ≠ auto-merge) | Ready | Workflow has no merge step. `docs/ci/branch-protection-checklist.md` and the prompt pack both say a person merges. |
| Branch protection readiness gaps listed | Blocked | The checklist is written. Repository branch protection was not changed. The maintainer line and the “date verified on a real PR” line are still blank. |

**PR loop summary:** A teammate can open a pull request and the workflow file is set up to run. Until that run exists, the status-check name and branch protection are not a proven merge block.

---

## 4. AI-assisted review dry-run (human remains accountable)

**Sample change used:** The Build step in `.github/workflows/pr-ci.yml` sets `VITE_SUPABASE_URL` to `https://your-project-ref.supabase.co` and `VITE_SUPABASE_ANON_KEY` to `your-anon-or-publishable-key`.

**Prompt chosen:** Prompt 2 — Risk flags (auth, Supabase, migrations, secrets) from `docs/ci/ai-pr-review-prompts.md`

**Tool category used:** chat-assistant

**AI output — what helped:**

- Observed in the diff: the build step sets only those two public names. `SUPABASE_SERVICE_ROLE_KEY` and `EMBEDDING_API_KEY` are not in the step.
- Observed: those two values match the placeholders already committed in `.env.example`.
- Inference: a passing `vite build` still does not show that sponsor login or row-level security works.
- Question for the reviewer: on a clean GitHub runner with Node 22 and no `.env.local`, does this build still finish, or does `src/lib/supabase.client.ts` throw?
- Needs human verification. The reply did not call the change safe.

**AI output — problems (if any):**

- None on authority. The reply did not say approve, LGTM, or merge.
- It did not invent a CI result. There is no Actions run to paste.

**Human judgment call:** Ask for more info before any merge. The local commands passed, but the reviewer still needs one real pull-request run on Node 22. This dry-run is not an approval.

**Prompt fix applied?** No. The prompt stayed advisory on the first try, so the pack was not edited.

---

## 5. Assess → fix → re-verify cycles

| Cycle | What failed | Fix applied (file + change) | Re-verify result |
| --- | --- | --- | --- |
| 1 | No command failed. Full local sequence passed on the first dry-run. | No file change. | Not re-run. Residual risk: local Node is 24, the workflow pins 22, and GitHub has not executed the job. |

---

## 6. Gate credibility decision

**Overall gate status:** Credible with known gaps

**Known gaps still open:**

1. No pull request and no Actions log. The check name and `cancel-in-progress` are unread on GitHub.
2. Branch protection on `main` is not enabled. The checklist is only a handoff.
3. This dry-run used Node 24. The runner is Node 22. The build also saw this machine’s `.env.local`.
4. Lint is not ESLint. Tests do not call Supabase. `npm ci` reported dependency advisories that this pass did not fix.

**Safe for Sprint 6 stakeholder handoff?** Yes with caveats

**Notes for the handoff:**

- The workflow runs install, lint, typecheck, test, and build on pull requests into `main`.
- Local commands for those five steps exited 0 on 2026-11-22.
- A person still merges. The AI prompt pack cannot approve.
- Maintainers still need to require `PR CI / Quality checks` after one real run.
- Do not describe the gate as proof of login, row-level security, or a production deploy.
