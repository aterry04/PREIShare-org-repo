# PREIshare PR CI — Pipeline Design

## Purpose

This is the plain-language plan for automated checks on every pull request to the PREIshare dashboard. The next step writes `.github/workflows/pr-ci.yml` from these stages only. This document does not deploy anything, and it does not replace a person’s decision to merge.

Sources: `docs/ci/pr-pain-and-goals.md`, `docs/ci/ci-concepts-notes.md`, and `docs/ci/project-ci-inventory.md`. Every command below is copied from that inventory. Missing scripts stay gaps.

## Trigger

- Event: `pull_request` (opened, updated, or reopened).
- Branches: pull requests whose target is `main`.
- A push to `main` by itself is not the trigger. A manual button is not the trigger. The pain today is that opening a pull request starts nothing.
- Goal: the same install, then typecheck, then build, runs before review continues. A green check means those stages passed. It is not permission to merge.

## Ordered stages (happy path)

1. **Checkout** — download the pull request commit onto the GitHub-hosted runner.
2. **Setup Node** — install Node.js 22. The repo has no `.nvmrc` and no `engines` field. `@types/node` is `^22.10.2`, so 22 is the design choice, not a version the manifest already pins. Do not use pnpm. The lockfile is `package-lock.json`.
3. **Install dependencies** — `npm ci`, so the runner installs the versions pinned in `package-lock.json`.
4. **Lint** — `npm run lint` (`node scripts/lint-ci.mjs`). There is still no ESLint package. The script fails if client or route files name the service-role key.
5. **Typecheck** — `npm run typecheck` (`tsc --noEmit`). It does not need Supabase.
6. **Test** — `npm run test` (`node --test tests/listing-schema.test.ts`). One pass, then the process exits. No browser and no database.
7. **Prepare public build env** — set only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the placeholder strings already committed in `.env.example`. Those names are public. This stage exists so the next stage does not load an empty client module.
8. **Build** — `npm run build` (`vite build`).

Lint and test are required now that `package.json` has those scripts. They use Node, which is already on the runner. They do not add ESLint, Vitest, or a browser suite.

`npm run dev`, `npm run preview`, and `npm run generate-routes` are not stages. The first two start a server and wait. `generate-routes` rewrites `src/routeTree.gen.ts`, which is already committed, and `build` does not call it.

## Commands / scripts (from inventory)

| Stage | Script or command (from project-ci-inventory) | Required on PR? |
| --- | --- | --- |
| Checkout | GitHub checkout of the PR commit | Yes |
| Setup Node | Node.js 22 (design choice; no `.nvmrc`) | Yes |
| Install | `npm ci` | Yes |
| Lint | `npm run lint` (`node scripts/lint-ci.mjs`) | Yes |
| Typecheck | `npm run typecheck` (`tsc --noEmit`) | Yes |
| Test | `npm run test` (`node --test tests/listing-schema.test.ts`) | Yes |
| Public env for build | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` set to `.env.example` placeholders | Yes, immediately before build |
| Build | `npm run build` (`vite build`) | Yes |

## Failure policy

- If checkout, Node setup, `npm ci`, `npm run lint`, `npm run typecheck`, `npm run test`, or `npm run build` fails, the job fails. The pull request shows a red X.
- Do not set `continue-on-error` on those stages.
- A person still decides whether to merge. CI only reports whether the required stages passed.

## Caching intent

- Cache npm downloads and key that cache on `package-lock.json`, so a later pull request with the same lockfile installs faster.
- Do not cache `dist` or other build output from one pull request into another. A cached bundle could hide a broken build.
- The exact cache action is written in the workflow file later. This section only records the intent.

## Environment and secrets

- Typecheck runs with the committed repo only. It does not need env vars.
- Build may set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the non-secret placeholders in `.env.example`. Do not point those at the live production project just to make CI green.
- Do not set `SUPABASE_SERVICE_ROLE_KEY`, `EMBEDDING_API_KEY`, `EMBEDDING_MODEL`, `SEED_OWNER_ID`, or `SUPABASE_URL` in this job.
- Do not print secret values in the log. This job should not receive those secrets at all.
- `src/lib/supabase.client.ts` throws if the two public names are missing when that module loads. That is why the placeholder stage exists. It is not a license to call Supabase.

## Explicitly out of scope for this PR pipeline

- Production or staging deploy, including Vercel.
- Live Supabase schema migrations (`supabase/migrations/*.sql`) or any write to a shared or production project.
- The seed script (`scripts/seed-property-embeddings.ts`) and any search call that spends `EMBEDDING_API_KEY`.
- Sponsor login, listing reads, and row-level checks against a real project.
- `npm run dev`, `npm run preview`, and `npm run generate-routes`.
- Manual QA, product acceptance, security judgment, and merge approval.
- AI auto-merge, or treating an AI comment as a green check.

## Mapping back to PREIshare goals

Pain addressed, from `docs/ci/pr-pain-and-goals.md`:

- No workflow runs when a pull request opens. The trigger is `pull_request` into `main`.
- Install is a local chore. `npm ci` runs on the shared runner.
- Teammates can skip typecheck and build. Both are required stages, in that order, after install.
- Lint and test are shared commands: `npm run lint` and `npm run test`. They are not an ESLint sweep or a browser suite.
- Reviewers should not re-run “does it install and build?” A red X answers that on the pull request.
- A machine check is not a merge decision. That line stays in the failure policy and the out-of-scope list.

Inventory rows that drive the required stages:

- Bucket A: `npm ci`, then `npm run typecheck`.
- Bucket B build row: `npm run build` only after the two public `VITE_` names are set. The service-role key stays out.
- Bucket C: merge, auth judgment, and AI comments stay with a person.

## Open questions / gaps

- [x] `lint` and `test` exist. They call Node, not ESLint or Vitest. A browser end-to-end suite is still out of scope.
- [ ] Node 22 is a design choice from `@types/node`, not from `.nvmrc` or `engines`. Change it in this doc before changing the workflow if the team pins a different version.
- [ ] A clean `npm run build` with only the `.env.example` placeholders is not yet proven. If that build fails for a reason other than the two public names, fix the design before adding more env vars. Do not add the service-role key to get a green build.

## Sign-off for next step

This design is the contract for `.github/workflows/pr-ci.yml`. The workflow may implement checkout, Node 22, `npm ci`, `npm run lint`, `npm run typecheck`, `npm run test`, the two public placeholders, and `npm run build`. It may cache npm by `package-lock.json`. It must not add deploy, live Supabase writes, a browser suite, or a merge step.
