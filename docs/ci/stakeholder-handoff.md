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

---

## Topic 2: AI review overlay on the finished CI gate

The topic 1 record above stays in force. Continuous integration is already done. The GitHub Actions workflow at `.github/workflows/pr-ci.yml` already installs, typechecks, builds, lints, and tests on pull requests. This section does not rebuild that workflow, the prompt pack, or the live site. It tells stakeholders how human review sits on top of that finished gate.

### What the AI review can and cannot do

The AI review can:

- Suggest findings on a pull request, in the required output shape from the system instruction.
- Help a human reviewer look faster. It is an advisor only.

The AI review cannot approve a pull request, and it cannot merge a pull request. It also cannot:

- Replace a human decision about sign-in, money, privacy, or product intent.
- Count as a required GitHub status check or a required reviewer.

A green CI check is evidence the commands passed. It is not permission to merge.

### Where to read the overlay

Do not look for a second handoff file. Start with the overview, then open the piece you need.

| Piece | Path | What a stakeholder uses it for |
| --- | --- | --- |
| Overlay overview | `docs/ci/ai-review-overlay-brief.md` | Why this review layer exists |
| Who may approve and who may merge | `docs/ci/pr-approval-roles.md` | Humans only; the AI is an advisor |
| System instruction and output shape | `docs/ci/ai-pr-review-prompts.md` | How the AI must answer |
| Human-judgment checklist | `docs/ci/human-judgment-checklist.md` | Sign-in, money, privacy, and product intent |
| Review runbook | `docs/ci/ai-review-orchestration.md` | The same sequence every time |
| Sample critique and prompt revision | `docs/ci/sample-pr-review/critique-and-prompt-revision.md` | What the practice review taught us |
| Branch-protection record | `docs/ci/branch-protection-checklist.md` | What GitHub actually saved |
| Practice sample | `docs/ci/samples/README.md` | The planted privacy sample; not app code |

### Branch protection: enforced now versus only documented

Copied from `docs/ci/branch-protection-checklist.md`. This handoff does not change GitHub settings.

#### Enforced on this repository now

- None. The enforcement record says Settings could not be opened. No intended rule was saved, so none is enforced.

#### Documented but not enforced on this plan

- Require a pull request before merging. Result in the checklist: blocked by missing admin.
- One human approval before merge. The roles file names Alexis Terry as the human reviewer. The count used is 1 because that file gives no number. Result: blocked by missing admin.
- Status check `PR CI / Quality checks` from `.github/workflows/pr-ci.yml`. Result: blocked by missing admin. No new workflow was added.
- Limiting merge to Alexis Terry, the maintainer. The checklist says this could not be set.

The AI assistant is not a required approver and is not a required status check.

### Sample privacy pull request

The practice pull request with one planted privacy mistake was not merged. It is still open at https://github.com/aterry04/PREIShare-org-repo/pull/1. The practice files stay under `docs/ci/samples/` for learning. They are not live member-facing code. Sprint 7 must not merge that sample.

### Decision log: why humans remain the approvers

Approval and merge stay with the humans named in `docs/ci/pr-approval-roles.md`. Alexis Terry approves, then Alexis Terry merges. A passing CI run cannot judge these four risks. The AI may comment. A person must decide.

| Risk | Why a human must decide | Artifact that supports the person |
| --- | --- | --- |
| Sign-in | A change can pass lint, typecheck, test, and build and still let the wrong person into the dashboard, or keep the right person out. | Roles file and human-judgment checklist |
| Money | Dues, payments, and balances are amounts a person must accept. An AI comment must not accept them. | Human-judgment checklist |
| Privacy | The practice review planted a privacy mistake on purpose. A person judged the advisor notes with the checklist, recorded in the critique. The sample was not merged. | Checklist and critique file |
| Product intent | A change can be technically fine and still fail to match what PREIshare is for: turning property and market data into something people can use when deciding where to live, buy, or invest. | Overlay brief and checklist |

### Sprint 7 next actions

These items are already done and working. Do not list them as missing, unbuilt, or work to create.

- The pull-request CI workflow is done and running. Do not rebuild `.github/workflows/pr-ci.yml`.
- The AI review prompt pack, which is the system instruction, is done. Do not treat `docs/ci/ai-pr-review-prompts.md` as unwritten.
- The existing Production site is already live on the current Vercel Hobby project at https://prei-share-org-repo-woad.vercel.app/. Do not create a new hosting project. Later confirmation uses that same public URL.
- Keep merge decisions with the humans named in the roles file. The AI remains an advisor.
- On future pull requests, follow the runbook and the human checklist.
- If the GitHub plan later allows a rule that is only documented today, apply it from the branch-protection checklist. Until then, leave that honest gap recorded. The gap does not mean CI was never built.

### What stakeholders should remember

The automatic checks stay evidence that the commands passed. The person who approves is still a person. The sample privacy change was not merged.
