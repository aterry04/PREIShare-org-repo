# CI concepts notes — PREIshare dashboard

These notes use the pains in `docs/ci/pr-pain-and-goals.md`. They do not define a GitHub Actions file.

## In my own words

**Continuous integration (CI)**

CI means GitHub runs the same install and quality checks every time someone proposes a dashboard change, before that change joins `main`. The point is a shared result. A private `npm run build` on one laptop is not CI, because the rest of the team never sees it.

**Pipeline / workflow**

A pipeline is the ordered list of those checks. GitHub calls the saved recipe a workflow. For PREIshare the order we already agreed is: install from `package-lock.json`, then `npm run typecheck`, then `npm run build`, then lint, then test. Lint and test stay off the list until those scripts exist. A person writes the recipe. A shared cloud machine, the runner, executes it the same way for every pull request.

**Green check vs red X**

- Green means every required automated step passed. That is a signal that the basics held. It is not permission to merge.
- Red means at least one required step failed. The failure should be visible on the pull request. Do not merge until a person understands the failure and a new run passes.

**Why every pull request (for PREIshare)**

Today this repo has no workflow, so opening a pull request starts nothing. Install, typecheck, and build happen only if someone remembers them locally, and two laptops can disagree. Running one pipeline on every pull request gives every teammate the same green or red signal before a person judges auth, listings, or whether to merge.

## Pain → CI idea map

| Pain (from pr-pain-and-goals) | CI idea |
| --- | --- |
| No `.github/workflows` file, so a pull request starts no shared check | A workflow must trigger when a pull request is opened or updated. A file that nobody runs is not CI. |
| Install is a local chore; nothing runs `npm ci` in the cloud | The first pipeline step installs from `package-lock.json` on the shared runner. |
| Teammates can skip `npm run typecheck` and `npm run build` | Those two scripts run on every pull request, in that order, after install. |
| No `lint` script and no `test` script yet | Do not pretend those checks run. Add them to the pipeline only after the scripts exist in `package.json`. |
| Reviewers re-do “does it install and build?” instead of judging auth and listing data | A red X answers the basic question before a person spends time on product and security judgment. |
| Nothing separates a machine check from a human merge decision, including AI help | This gap is not fixed by another script. A person still approves and merges. AI comments are not a green check. |

## Non-examples (“CI washing”) — not real CI

1. **Only running `npm run build` on a laptop.** The pull request never shows a shared result, so another machine can still be broken. That is the “works on my machine” habit this sprint is trying to leave behind.
2. **Merging because an AI comment said the change looks fine, while no workflow ran.** An AI note can help a reviewer. It does not install dependencies, typecheck, or build, and it cannot replace the green or red signal.
3. **A workflow file sitting in the repo that never runs on `pull_request`.** The recipe looks like CI and does nothing when someone proposes a change. PREIshare has this failure mode today: there is no workflow at all.
4. **Running typecheck and build only after the change is already on `main`.** The team learns too late. Broken dashboard code may already be the shared version.

## What I will demand from later agent-written YAML (preview)

- The workflow runs when a pull request is opened or updated, not only when someone clicks a manual button.
- Steps stay in the agreed order: install, typecheck, build, then lint and test only if those scripts exist.
- A failed step fails the job, so the pull request shows a red X. Errors are not hidden.
- The workflow does not deploy the Vercel site, does not merge the pull request, and does not contain `SUPABASE_SERVICE_ROLE_KEY` or `EMBEDDING_API_KEY`.
- A green check still leaves approve, request changes, and merge with a person.

## Open questions for inventory/design steps

- Scripts in `package.json` today: `dev`, `generate-routes`, `build`, `preview`, `typecheck`. The lockfile is `package-lock.json`, so the install command to plan for is `npm ci`, not a pnpm install.
- Automatable now: `npm ci`, `npm run typecheck`, `npm run build`.
- Not automatable until a script exists: lint, test. Do not invent those scripts in the concept notes.
- Stays with a person: approving the pull request, judging auth and row-level rules, judging who can read a listing, handling secrets, deciding to merge, and deploying production.
