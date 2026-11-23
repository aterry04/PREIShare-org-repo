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
