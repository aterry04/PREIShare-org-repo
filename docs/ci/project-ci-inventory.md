# PREIshare dashboard — CI project inventory

## Purpose

This file lists what the PREIshare repo can run on a GitHub-hosted runner for a pull request, what needs secrets or an outside service, and what stays with a person. Pipeline design must use only the package manager and script names recorded here. It must not invent a `lint` or `test` script.

Context: `docs/ci/pr-pain-and-goals.md` and `docs/ci/ci-concepts-notes.md`.

## Repo facts (fill from the real project)

- Package manager: `npm`. `package.json` has a `pnpm.onlyBuiltDependencies` note, and there is no `pnpm-lock.yaml`. CI must use npm.
- Lockfile present: `package-lock.json` (lockfileVersion 3). No `yarn.lock`. No second lockfile.
- Node/TypeScript app signals: `package.json`, `tsconfig.json` (`strict: true`, `noEmit: true`), app code under `src/`. No `app/` directory. No `engines` field and no `.nvmrc`.
- Framework signals: TanStack Start + React + Vite. `app.config.ts` uses `@tanstack/react-start/plugin/vite`, Nitro, and Tailwind. `vite.config.ts` re-exports that config. Routes live in `src/routes/`. `src/routeTree.gen.ts` is already committed.
- Test runner: none found. No Vitest, Jest, or Playwright dependency, and no `test` script.
- Lint tool: none found. No ESLint (or other linter) dependency, and no `lint` script.

## Scripts discovered in package.json

Exact `scripts` block:

```json
"scripts": {
  "dev": "vite dev --port 3000",
  "generate-routes": "tsr generate",
  "build": "vite build",
  "preview": "vite preview",
  "typecheck": "tsc --noEmit"
}
```

| Script name | Exact command (from package.json) | Role |
| --- | --- | --- |
| `typecheck` | `tsc --noEmit` | typecheck |
| `build` | `vite build` | build |
| `dev` | `vite dev --port 3000` | local server; not a PR check |
| `preview` | `vite preview` | local server after a build; not a PR check |
| `generate-routes` | `tsr generate` | rewrites the route tree; not a quality check |

Missing common checks (write MISSING if not present):

- typecheck: present as `npm run typecheck`
- build: present as `npm run build`
- lint: MISSING
- test: MISSING

There is no script named `install`. The install command that matches the lockfile is `npm ci`.

## Bucket A — Headless-safe on GitHub-hosted runners

These need a clean checkout and a lockfile install. They do not call Supabase and they do not read secret keys.

Order for a first pull-request pipeline:

1. `npm ci` — installs the versions pinned in `package-lock.json` on the shared runner. This is the missing cloud install from the pain list. It is not an npm script.
2. `npm run typecheck` — runs `tsc --noEmit`. It checks TypeScript without starting the app and without a database. `tsconfig.json` already sets `noEmit`, so this script does not write build output.

`npm run build` is the next candidate, with one condition recorded in Bucket B: `src/lib/supabase.client.ts` throws while that module is loading if `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` is missing. A runner with neither name set may fail the build even though those two values are public, not the service-role key. Do not describe `npm run build` as proven on a zero-env runner until a clean run shows that.

Do not put these in the first required job:

- `npm run dev` and `npm run preview` — they start a server and wait. A headless check would hang.
- `npm run generate-routes` — it rewrites `src/routeTree.gen.ts`, which is already in the repo. The `build` script does not call it. It is not lint and it is not test.

## Bucket B — Needs secrets, env, or external services

Do not put these in the first pull-request job. No secret values belong in this file or in the workflow.

| Check or step | Why it is not headless-safe | What would be required later |
| --- | --- | --- |
| `npm run build` (`vite build`) when the public Supabase names are unset | `src/lib/supabase.client.ts` throws if `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` is missing when that module loads. | Set those two public names on the runner. Do not add `SUPABASE_SERVICE_ROLE_KEY` to make the build pass. |
| Sponsor login, listing loaders, and search against the live project | Server clients read `SUPABASE_URL` or `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and, for maintenance only, `SUPABASE_SERVICE_ROLE_KEY`. | A protected secret plan. Out of scope for the first pipeline. |
| `src/lib/embeddings/generate.ts` and `POST` search that embeds a query | Needs `EMBEDDING_API_KEY`. Optional `EMBEDDING_MODEL`. Calls the embedding provider. | A server-only key and a budget. Not a pull-request check. |
| `npx tsx scripts/seed-property-embeddings.ts` | Not an npm script. Needs `SEED_OWNER_ID`, `EMBEDDING_API_KEY`, a Supabase URL, and `SUPABASE_SERVICE_ROLE_KEY`. It writes rows. | Keep it a manual maintenance step. |
| Applying `supabase/migrations/*.sql` | SQL against a hosted database. No npm script applies it. | A person or a later, separate job. Not this sprint’s PR workflow. |
| Vercel production deploy | Needs the hosting account and production env. The goals brief excludes deploy-from-PR. | Leave it on the existing Vercel project. Do not add a deploy step. |

## Bucket C — Human judgment (not a green checkmark)

- Whether the pull request should merge. A green check is not approval.
- Product and UX judgment for the dashboard, search page, and empty states.
- Whether auth, row-level policies, and “who can read a listing” are safe. CI will not decide that.
- Whether an AI review comment is worth acting on. The comment does not replace a red or green result, and it does not merge.
- Choosing to add a linter or a test runner later. This inventory must not pretend those tools exist.

## Supabase / env caveats for CI

Env var names referenced by `.env.example`, `docs/env-var-checklist.md`, or app code. Values stay out of git and out of this doc:

- `VITE_SUPABASE_URL` — public project URL
- `VITE_SUPABASE_ANON_KEY` — public anon key
- `SUPABASE_URL` — optional server URL
- `SUPABASE_SERVICE_ROLE_KEY` — server-only; bypasses row-level security
- `EMBEDDING_API_KEY` — server-only embedding provider key
- `EMBEDDING_MODEL` — optional server model name
- `SEED_OWNER_ID` — Auth user id for the seed script

Local-only or dashboard-only steps:

- Copy `.env.example` to `.env.local` and fill it on a developer machine. `.env.local` is gitignored.
- Apply SQL migrations in the Supabase dashboard or CLI.
- Run the seed script by hand.

Recommendation for Sprint 6 pull-request CI: the first pipeline is Bucket A only (`npm ci`, then `npm run typecheck`). Add `npm run build` in that same job only when the two public `VITE_` names are set to non-secret placeholders or public project values. Leave every Bucket B row and every Bucket C decision out of the workflow.

## Risks and open questions

- One lockfile, but `package.json` mentions pnpm. Using pnpm in CI would not match `package-lock.json`.
- No Node version is pinned. The runner image needs a Node that can install Vite 8 and TypeScript 6. Pick a version in the pipeline design and write it down.
- `npm run build` on a runner with no env is unverified in this inventory. The client module’s throw is the reason to treat a zero-env build as unsafe.
- Lint is MISSING. Test is MISSING. A workflow that calls `npm run lint` or `npm run test` will fail on every pull request until those scripts exist.
- No workflow file exists yet under `.github/`. That is the current pain, not something this inventory fixes.
- Tests that need a browser, a live Supabase project, or the embedding provider are not present, so they are not a Bucket A item.

## Link back to earlier docs

Pain/goals addressed by Bucket A:

- Nothing in the cloud runs an install for a proposed change. `npm ci` is that install.
- Teammates can skip `npm run typecheck` and `npm run build`. The pipeline runs the real `typecheck` script, and it runs `build` only with the env caveat above.
- Lint and test stay marked MISSING, matching the goals brief: do not invent those scripts.

CI idea used: one shared runner executes the same recipe on every pull request, and a failed step is a red X. Merge stays with a person (`docs/ci/ci-concepts-notes.md`).

## Source files inspected

- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.ts`
- `app.config.ts`
- `src/routeTree.gen.ts` (present, not opened line by line)
- `src/lib/supabase.client.ts`
- `src/lib/supabase.server.ts`
- `src/lib/embeddings/generate.ts`
- `scripts/seed-property-embeddings.ts`
- `.env.example`
- `docs/env-var-checklist.md`
- `docs/ci/pr-pain-and-goals.md`
- `docs/ci/ci-concepts-notes.md`
- `supabase/migrations/` (four SQL files; no apply script)
- `README.md` (scripts: `dev`, `build`, `preview`, `typecheck`, `generate-routes`)
