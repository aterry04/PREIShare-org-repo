# CI scripts notes — PREIshare dashboard

## Package manager

- CI uses: npm
- Lockfile present: `package-lock.json`
- Node.js on the runner: 22 (design choice; the repo has no `.nvmrc`)

ESLint, Vitest, Jest, and Playwright are not installed. This step did not add them. Lint and test call Node, which the runner already installs for `npm ci`.

## Scripts CI calls (must match package.json and pr-ci.yml)

| CI step | package.json script | Exact local command | Purpose |
| --- | --- | --- | --- |
| Install | (none; `npm ci` is the command) | `npm ci` | Clean install from `package-lock.json` |
| Lint | `lint` | `npm run lint` | `node scripts/lint-ci.mjs`. Fails if client or route files name the service-role key. |
| Typecheck | `typecheck` | `npm run typecheck` | `tsc --noEmit` |
| Test | `test` | `npm run test` | `node --test tests/listing-schema.test.ts`. Runs once and exits. |
| Build | `build` | `npm run build` | `vite build`. The workflow sets the two public placeholders below. |

Workflow order in `.github/workflows/pr-ci.yml`: checkout, Node 22, install, lint, typecheck, test, build. A failed lint or test fails the job. There is no `continue-on-error` on those steps.

## package.json script entries added in this step

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "build": "vite build",
    "lint": "node scripts/lint-ci.mjs",
    "test": "node --test tests/listing-schema.test.ts"
  }
}
```

`typecheck` and `build` were already in the repo. `lint` and `test` are the new names. No dependency was added, so `package-lock.json` stays as it was.

## What the new checks actually do

- `npm run lint` reads `src/components`, `src/routes`, `src/lib/supabase.client.ts`, and `src/lib/supabase/client.ts`. It exits 1 if those files contain `SUPABASE_SERVICE_ROLE_KEY` or `VITE_SUPABASE_SERVICE_ROLE_KEY`. Server code in `src/lib/supabase.server.ts` is allowed to read the server-only name and is not part of this scan.
- `npm run test` checks two existing rules: a published listing needs a summary (`createListingSchema`), and dashboard overview is active only on `/dashboard` (`isDashboardNavActive`). It does not open a browser, call Supabase, or call the embedding provider.

## Intentional gaps

- No ESLint style sweep. The inventory had no lint tool, and this step did not add one.
- No full browser end-to-end suite in pull-request CI.
- No Supabase, seed, or embedding call in these scripts.
- Secrets and production deploy stay out of `.github/workflows/pr-ci.yml`.
- The workflow build step still sets only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the placeholders in `.env.example`.

## How to reproduce a CI failure locally

1. Check out the pull request branch.
2. From the repo root, run `npm ci`.
3. Run `npm run lint`.
4. Run `npm run typecheck`.
5. Run `npm run test`.
6. Run `npm run build`. On a machine that already has `.env.local`, that file supplies the public Supabase names. On a clean machine, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the placeholders in `.env.example` before the build. Do not set `SUPABASE_SERVICE_ROLE_KEY` for this check.

Fix the first command that exits non-zero, then push the branch. The GitHub job uses this same order.
