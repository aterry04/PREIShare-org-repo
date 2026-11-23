# PREIshare PR pain points and Sprint 6 CI goals

## Client need (in my own words)

When someone proposes a change to the PREIshare dashboard, GitHub should run the same install, typecheck, and build every time, on a clean machine, before that change can be treated as ready. A green check only means those steps passed. A person still decides whether the change is safe to merge.

## Current PR pain points

- This repo has no `.github/workflows` file. Opening or updating a pull request starts no shared check.
- Installing dependencies is a local chore. `package-lock.json` is in the repo, but nothing in the cloud runs `npm ci` for a proposed change.
- `npm run typecheck` (`tsc --noEmit`) and `npm run build` (`vite build`) exist, and a teammate can skip both under time pressure.
- There is no `lint` script and no `test` script in `package.json`. Those checks cannot run the same way for every pull request until the scripts exist.
- A reviewer often spends the review re-doing “does it install and build?” instead of judging the dashboard change, auth boundaries, or listing data.
- Nothing written down separates a machine check from a human merge decision, including how AI review help may be used.

## Automated CI goals (machines should do these on every PR)

- Install dependencies from the lockfile in a clean environment (`npm ci`).
- Run `npm run typecheck`.
- Run `npm run build` for the TanStack Start dashboard.
- Run lint once a `lint` script is confirmed in `package.json`. Do not invent that script in this brief.
- Run tests once a `test` script is confirmed in `package.json`. Do not invent that script in this brief.
- Fail the pull request check when a required step fails, and show that failure on the pull request.

## Human review stays in charge

- A person approves the pull request or requests changes.
- A person judges product risk, security-sensitive logic (auth, row-level rules, who can read a listing), and how data is handled.
- A person decides whether to merge. A green CI check is not permission to merge.
- AI review prompts may summarize risks and suggest questions. They do not approve, request changes, or merge.
- Secrets and production access stay outside this pull request automation. Do not put `SUPABASE_SERVICE_ROLE_KEY`, `EMBEDDING_API_KEY`, or any other secret in the workflow or in this document.

## Out of scope for this sprint (do not solve in the goals brief)

- Deploying production from the pull request workflow, including the Vercel site.
- Replacing human reviewers with an automatic merge.
- Load tests or performance suites. None are a standard script today.
- New dashboard features that are unrelated to CI quality.
- A GitHub Actions workflow file. That comes in a later step.

## Success signals

- Opening or updating a pull request starts one CI workflow, and the run is visible on the pull request.
- The required steps run in this order: install, then typecheck, then build, then lint, then test. Lint and test run only after those scripts exist.
- When a step fails, the failure shows on the pull request. A teammate does not have to be asked to try the branch locally to learn that it failed.
- A written AI review prompt pack exists, and it tells the reviewer what to look at without approving or merging.
- A short handoff says what the machine does and what a person still owns, including the merge decision.
