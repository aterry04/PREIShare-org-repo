# Branch protection checklist (PREIshare PR CI)

## Purpose

This checklist connects the green or red result from `.github/workflows/pr-ci.yml` to merge policy on `main`. It is for a maintainer who can change repository settings. Writing this file does not turn branch protection on. A contributor without admin rights stops after the checklist.

## Protected branches

- [ ] Protect `main`. That is the only merge target named in `docs/ci/pipeline-design.md`. Do not add other branches.

## Required status checks

GitHub shows the check name only after the workflow has run once on a pull request. In the branch protection form, require the check whose name matches this workflow, not a similarly named job from another file.

- [ ] Require status checks to pass before merging.
- [ ] Required check: `PR CI / Quality checks`. The workflow `name` is `PR CI`. The job id is `ci`. The job `name` is `Quality checks`. Confirm that exact label on a real pull request before saving the rule.
- [ ] Turn on “Require branches to be up to date before merging” so the latest run includes the current `main`.

## What CI already enforces (automated)

The single job `Quality checks` runs these steps, in order. Any failure fails that check:

- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build` (public `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` placeholders only)

A newer push to the same pull request cancels the older run (`cancel-in-progress: true`). Review the latest run.

## What humans still own (not optional)

- [ ] At least one human approval before merge. A green check is not approval.
- [ ] AI review prompts may summarize risks. They must not merge the pull request or count as the required review.
- [ ] A person still judges auth, row-level access, product behavior, and whether a secret was handled correctly.

## What not to require yet

- [ ] Do not require a job that is not in `.github/workflows/pr-ci.yml`.
- [ ] Do not require a deploy or production job on pull requests.
- [ ] Do not add `SUPABASE_SERVICE_ROLE_KEY`, `EMBEDDING_API_KEY`, or any other secret to the workflow to make a check exist.
- [ ] Do not require a browser end-to-end suite. This repo does not have one.

## Readiness sign-off

- [ ] Workflow file path: `.github/workflows/pr-ci.yml`
- [ ] Trigger: `pull_request` into `main`, on `opened`, `synchronize`, and `reopened`
- [ ] Concurrency group: `pr-ci-${{ github.workflow }}-${{ github.event.pull_request.number || github.ref }}`, with `cancel-in-progress: true`
- [ ] Branch protection was not changed while writing this checklist
- [ ] Maintainer who can edit branch protection: __________________
- [ ] Date the check name was confirmed on a real pull request: __________________

## Notes for Sprint 6 handoff

A red required check should block merge. A green check means install, lint, typecheck, test, and build passed on the latest commit. It does not mean product review is done.

## Enforcement record

This section was added after the existing checklist. The sections above stay in this file. They describe the rules we intended. This section records what GitHub actually saved. Branch protection is a GitHub website setting, not code. Writing this file does not turn a rule on. A rule that did not save is not enforced. Do not describe it as on.

- Date: 2026-11-24
- GitHub user who tried: aterry04
- Repository visibility seen on the repo page: public
- Could open Settings and change rules: no, Settings was missing. The signed-out repository page had no Settings tab, and the branches settings address returned Page not found.
- Screen used: could not open either
- Branch name pattern: main
- Paid upgrade: No paid GitHub upgrade was purchased.

### Intended rules versus what saved

Approver role from docs/ci/pr-approval-roles.md: Human reviewer, Alexis Terry. Merger role from that file: Maintainer, Alexis Terry. That file does not give a number, so the approval count used here is 1, the default, because this gate needs at least one human approval. The AI assistant is not an approver.

- Require a pull request before merging. Wanted: yes. Result: blocked by missing admin. What I saw after refresh: no Settings screen, and no saved rule listed. This rule is not enforced.
- Human approvals before merge. Count and approver roles from docs/ci/pr-approval-roles.md: count 1, defaulted because the roles file has no number; approver is Alexis Terry, the human reviewer. Count is at least 1. The AI assistant is not an approver. Result: blocked by missing admin. What I saw after refresh: no approval rule listed. This rule is not enforced.
- Required status check from the existing workflow .github/workflows/pr-ci.yml. Exact check name searched: PR CI / Quality checks. It was not listed, because the settings screen did not open. No new workflow was added. Result: blocked by missing admin. What I saw after refresh: that check was not selected. This rule is not enforced.
- Who may merge, from docs/ci/pr-approval-roles.md: Alexis Terry, the maintainer. Did GitHub limit merge to those people? could not set. This limit is not enforced by GitHub.
- Bypass list: not shown.

### Gaps

- Require a pull request before merging is not enforced. Settings could not be opened, so nothing was saved.
- Human approvals before merge are not enforced. The same missing Settings screen blocked the approval count.
- The status check PR CI / Quality checks is not enforced. The name was searched for in the existing workflow only. The settings list never appeared.
- Limiting merge to Alexis Terry was not shown, so that limit is not enforced.
- No ruleset was left Active. No price or trial screen appeared.

### What humans still do

People still follow docs/ci/human-judgment-checklist.md and docs/ci/ai-review-orchestration.md before merge, including when GitHub did not save the rule. The sample review in docs/ci/sample-pr-review/critique-and-prompt-revision.md is advice only and is not a required status check. The AI assistant does not approve or merge. The existing pr-ci workflow remains the only automated check this record tried to require.
