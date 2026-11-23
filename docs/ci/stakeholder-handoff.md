# PREIshare Sprint 6 — Stakeholder Handoff

**Audience:** PREIshare product owners, tech leads, and reviewers
**Sprint goal:** The same checks on every pull request, plus AI review help that does not replace a person
**Date:** 2026-11-22
**Author:** Alexis Terry

---

## 1. Client story recap (why we did this)

Before this work, a pull request did not start a shared check. Teammates had to remember to install dependencies, typecheck, and build on their own machines. Lint and test scripts did not exist. Broken code could reach `main`, and reviewers spent time re-doing “does it build?”

**What changed:** `.github/workflows/pr-ci.yml` runs one job, `Quality checks`, when a pull request into `main` is opened, updated, or reopened. A person still decides whether the change is right for the product and whether to merge.

**Source notes:** `docs/ci/pr-pain-and-goals.md`, `docs/ci/pipeline-design.md`

---

## 2. What is automated on every pull request

| Stage | What runs | Where defined |
| --- | --- | --- |
| Trigger | Pull requests into `main` only (`opened`, `synchronize`, `reopened`). A newer push cancels the older run. | `.github/workflows/pr-ci.yml` |
| Setup | Check out the pull request, install Node.js 22, `npm ci` with the npm cache | same |
| Quality gates | `npm run lint`, then `npm run typecheck`, then `npm run test`, then `npm run build` | same and `docs/ci/ci-scripts-notes.md` |
| Failure behavior | Any failed step fails the job. There is no “keep going” setting. Merge is blocked only after an admin requires the check. | `docs/ci/branch-protection-checklist.md` |

**Plain-language summary for stakeholders:**

If install, lint, types, tests, or the production build break, the pull request should show a failed check named `PR CI / Quality checks`. That name has not been confirmed on GitHub yet. Teammates should fix a red check before merge, not skip it.

**What CI does not do:**

- It does not deploy the Vercel site or any other environment.
- It does not approve product or UX decisions.
- It does not replace reading the diff.
- It does not log a sponsor in, call Supabase, or apply SQL migrations.
- It does not store or print server secrets. The build step sets only the public placeholders `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `.env.example`.

---

## 3. What humans still decide

| Decision | Owner | Why it stays human |
| --- | --- | --- |
| Merge approval | Reviewer or maintainer | A green check means the five commands passed. It does not mean the feature is right. |
| Using the AI review prompts | Reviewer | The prompts in `docs/ci/ai-pr-review-prompts.md` may summarize a diff or ask questions. They must not approve, write LGTM, or tell anyone to merge. |
| Secret and env configuration | Maintainer | `SUPABASE_SERVICE_ROLE_KEY` and `EMBEDDING_API_KEY` stay off the pull-request workflow. |
| Requiring the status check | Repo admin | Branch protection is a GitHub setting. The workflow file does not turn it on. |
| Auth, listing access, and SQL | Reviewer | CI does not decide who can read a listing or whether a migration is safe. |

No flaky test showed up in this sprint. If one appears later, a tech lead should fix or quarantine it. Do not turn the whole workflow off to hide a flake.

**AI-assisted review boundary:**

Reviewers may paste a prompt from `docs/ci/ai-pr-review-prompts.md` to speed reading. A human still writes the GitHub review and clicks merge. AI output is advice, not a vote.

---

## 4. How to enable branch protection (operator checklist)

Admins should follow `docs/ci/branch-protection-checklist.md`:

1. Protect `main`. Do not add other branches. The design names only `main`.
2. After one real run, require the check GitHub shows for this workflow. The expected label is `PR CI / Quality checks` (workflow name `PR CI`, job name `Quality checks`, job id `ci`). Confirm the label on that run before saving the rule.
3. Require at least one human review.
4. Require the branch to be up to date before merging.
5. Do not add a deploy job or a secret to the workflow just to have another check.

**Status after verification:** Not enabled yet.
**Evidence:** `docs/ci/e2e-verification-log.md` records that repository settings were not changed. The maintainer line on the checklist is still blank.

---

## 5. Known limits and risks (honest scope)

| Limit | Impact | Recommended next action |
| --- | --- | --- |
| Secrets and private env | Login, live listing reads, search, and the seed script do not run in this job. The service-role key and the embedding key are intentionally absent. | Keep them out of pull-request CI. If a later job needs them, use GitHub secrets and a separate decision. Do not commit `.env`. |
| Supabase and external services | A green build does not prove row-level security, sponsor login, or that SQL in `supabase/migrations/` was applied. | Leave live database checks out of this workflow until the team chooses a safe plan. |
| Lint and tests are narrow | Lint is a Node script that fails if client or route files name the service-role key. It is not ESLint. Tests are three Node checks (published listings need a summary, and one nav rule). They do not open a browser. | Do not describe the gate as a full style or product test. Add ESLint or more tests only as a later, explicit change. |
| Local versus CI drift | The 2026-11-22 dry-run used Node 24 on Windows. The workflow installs Node 22 on Ubuntu. The local build also saw `.env.local`. | Confirm the five commands on one real GitHub run before treating the gate as proven. |
| Dependency advisories | `npm ci` printed 8 advisories (2 moderate, 3 high, 3 critical). They were not fixed in this sprint. | Review them separately. Do not run a forced upgrade inside this workflow without a team decision. |
| Flaky tests | None were observed. | If a check starts failing at random, fix or quarantine that test. Do not disable `Quality checks`. |

---

## 6. Verification snapshot

From `docs/ci/e2e-verification-log.md` on 2026-11-22, branch `main` at commit `22ced34`:

- **Pull request opened / workflow triggered on GitHub:** no. No Actions link.
- **The five commands ran locally in workflow order:** yes. `npm ci`, `npm run lint`, `npm run typecheck`, `npm run test` (3 passed), and `npm run build` each exited 0.
- **Intentional failure experiment:** no. A red check was not forced.
- **AI review prompt trial:** yes. Prompt 2 was applied to the build step’s public placeholders. The reply asked a question and did not approve or recommend merge. The human call was to wait for a real GitHub run before any merge.
- **Blockers:** branch protection is off, the check name is unconfirmed on GitHub, and the local pass used Node 24 rather than Node 22.

**Gate recorded in the log:** credible with known gaps. Safe to hand off with those caveats.

---

## 7. Artifact index (where everything lives)

| Artifact | Purpose |
| --- | --- |
| `docs/ci/pr-pain-and-goals.md` | Why pull requests were painful, and what this sprint would automate |
| `docs/ci/ci-concepts-notes.md` | Plain-language CI definitions and what is not real CI |
| `docs/ci/project-ci-inventory.md` | Which scripts and secrets the repo actually has |
| `docs/ci/pipeline-design.md` | The agreed order, written before the workflow file |
| `.github/workflows/pr-ci.yml` | The pull-request workflow |
| `docs/ci/ci-scripts-notes.md` | The commands CI runs, and how to repeat them locally |
| `docs/ci/branch-protection-checklist.md` | Admin steps to require the check. Not yet applied. |
| `docs/ci/ai-pr-review-prompts.md` | Three paste-ready review prompts. Humans still merge. |
| `docs/ci/e2e-verification-log.md` | What was read, what was run, and what was not proven |
| `docs/ci/stakeholder-handoff.md` | This note |

---

## 8. What should roll into the next topic

1. Open a pull request and confirm GitHub shows `PR CI / Quality checks`, including a cancel when a newer commit is pushed.
2. Have an admin protect `main`, require that check, and require one human review. Fill in the maintainer name and date on the checklist.
3. Re-run the build on the Node 22 runner with only the public placeholders, not a developer `.env.local`.
4. Decide whether any Supabase or embedding check belongs in CI. Until that decision, leave those secrets out.
5. After one or two real reviews, adjust the wording of a single prompt in `docs/ci/ai-pr-review-prompts.md` if the questions are noisy. Do not remove the rule that the assistant cannot merge.

---

## 9. One-paragraph executive summary

PREIshare pull requests into `main` now have a GitHub Actions job, `Quality checks`, that installs dependencies and then runs lint, typecheck, test, and the production build. Those five commands passed on a developer machine on 2026-11-22. They have not yet been watched on GitHub, and branch protection is not on, so a red check does not block merge until an admin requires `PR CI / Quality checks` and a human review. AI prompts can help a reviewer read a diff. They do not approve, and they do not prove login, listing security, or a production deploy.
