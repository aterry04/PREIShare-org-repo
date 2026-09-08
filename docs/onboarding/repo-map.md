# PREIshare repository map

> Onboarding map for first contribution planning. Built with AI-assisted
> inventory + human path verification. Do not treat this as architecture law
> if the real tree disagrees—update this file when you learn more.

## Meta

- Clone path (from setup-log): `C:\users\act07\documents\projects\PREIShare-org-repo`
- Date mapped: 2026-09-08
- Agent tool used: coding-agent (read the real tree of `aterry04/PREIShare-org-repo`; no application code was modified)
- Mapper: Alexis Terry (@aterry04)

## 1. Overview (5–8 sentences)

PREIshare appears to be organized as: a **single package** at the repository root, not a monorepo with `apps/` and `packages/` folders. There is one `package.json` (`name`: `preishare-org-repo`); no workspace members were found.

In plain language, the product code lives mainly in `src/` — file-based routes under `src/routes/`, shared UI under `src/components/`, router wiring in `src/router.tsx`, and styles in `src/styles.css`.

Shared libraries or packages appear in: **none found** at the top level. The only small helper is `src/lib/user.ts`, which currently returns `null` (a stub, not a real user service).

Docs and onboarding notes live in `docs/` once we add them (including this file). The upstream starter also has `README.md` and `AGENTS.md` at the repo root.

`package.json` lists React 19, TanStack Start, TanStack Router, Vite, TypeScript, and Tailwind CSS. `AGENTS.md` says this clone is still a **blank TanStack Start scaffold** with no partner add-ons.

I am intentionally not editing application code while building this map. Supabase, PostgreSQL, pgvector, and GitHub Actions are named in the course story, but those folders and files are **not in this clone yet** — they are open questions, not invented paths.

## 2. Top-level inventory

| Path | Kind (app / package / config / docs / other) | One-sentence purpose | Verified by me? (yes/no) |
|------|-----------------------------------------------|----------------------|---------------------------|
| `src/` | app | All application TypeScript/React code: routes, components, styles, router. | yes |
| `docs/` | docs | Onboarding notes we add (`setup-log.md`, `team-orientation-notes.md`, this map). Not in the original starter tree. | yes |
| `package.json` | config | Root package manifest: name `preishare-org-repo`, npm scripts, dependencies. | yes |
| `package-lock.json` | config | npm lockfile that pins exact dependency versions. | yes |
| `README.md` | docs | Getting-started notes for the TanStack Start scaffold (`npm install`, `npm run dev`). | yes |
| `AGENTS.md` | docs / tooling | Project context for coding agents: stack choices, layout, scripts, “no auth/DB yet.” | yes |
| `.cursorrules` | config | Cursor/agent rules for this repo (routes, Tailwind, server fns; also mentions a Supabase client file that is not present). | yes |
| `.cta.json` | config | Scaffold metadata from the TanStack CLI create command. | yes |
| `vite.config.ts` | config | Vite bundler config: TanStack Start, React, Tailwind, and Devtools plugins. | yes |
| `tsconfig.json` | config | TypeScript compiler options (`strict`, path aliases `#/*` and `@/*` → `src/*`). | yes |
| `tsr.config.json` | config | TanStack Router CLI config (`"target": "react"`). | yes |
| `.gitignore` | config | Ignores `node_modules`, `dist`, `.env`, and other generated folders. | yes |
| `.vscode/` | config | Editor settings that treat generated `routeTree.gen.ts` as read-only. | yes |

Top-level names that were **not found** (do not invent them): `apps/`, `packages/`, `.github/`, `supabase/`, `backend/`.

## 3. Frontend concerns (TypeScript, React, TanStack Start)

- Likely app root(s): the repository root itself; UI code is `src/`
- Clues I used (file names, frameworks mentioned in package.json):
  - `package.json` dependencies: `react`, `react-dom`, `@tanstack/react-start`, `@tanstack/react-router`, `tailwindcss`, `vite`
  - `vite.config.ts` plugins: `tanstackStart()`, `viteReact()`, `tailwindcss()`, `devtools()`
  - `.cta.json`: `"framework": "react"`, `"mode": "file-router"`
  - `AGENTS.md`: “Framework: React 19 + TanStack Start”; routes in `src/routes/`
- Entry / routes / UI areas worth knowing:
  - `src/router.tsx` — creates the TanStack Router from `src/routeTree.gen.ts`
  - `src/routes/__root.tsx` — root layout: HTML shell, `Header`, page children, `Footer`, devtools
  - `src/routes/index.tsx` — home page (`/`): “TanStack Start Base Template”
  - `src/routes/about.tsx` — about page (`/about`)
  - `src/components/Header.tsx`, `Footer.tsx`, `ThemeToggle.tsx` — shared chrome
  - `src/styles.css` — Tailwind entry and design tokens (for example `--sea-ink`)
  - `src/routeTree.gen.ts` — **generated** route tree; `.cursorrules` and `.vscode/settings.json` say do not edit by hand
- How this area relates to user-facing screens: files under `src/routes/` are the pages a visitor sees. `__root.tsx` wraps every page with the header and footer. Adding a new screen later means adding a file in `src/routes/`, not inventing a separate frontend app.

## 4. Backend / data concerns (Supabase, PostgreSQL, pgvector, APIs)

- Supabase or data config paths: **not found yet**. There is no `supabase/` folder and no `src/lib/supabase.ts` (or `lib/supabase.ts`) in the tree.
- Migrations / SQL / schema-related paths: **not found yet**. No `.sql` files and no `migrations/` folder.
- Env examples (NOT secret values): **not found yet**. There is no `.env.example`. `.gitignore` lists `.env`, so real env files should stay uncommitted. `AGENTS.md` says no environment variables are required for this blank scaffold.
- Notes on what a beginner should not touch in production data:
  - Do not create a real `.env` with secrets and commit it.
  - Do not invent a database schema in this first PR.
  - `.cursorrules` says “Use the Supabase client from `lib/supabase.ts`,” but that file **does not exist** in this clone. Treat that rule as a future expectation, not a current folder. `AGENTS.md` is clearer for today: “No auth, DB, or partner integrations in this blank app.”
  - `src/lib/user.ts` is a stub (`getUser()` returns `null`). It is not a live backend. Leave it alone until a real auth/data task exists.

## 5. Tooling and CI

- TypeScript / lint / format config:
  - `tsconfig.json` (strict TypeScript)
  - No ESLint or Prettier config files were found at the repo root
- CI workflows (e.g. GitHub Actions): **not found yet**. There is no `.github/workflows/` directory in this clone.
- Editor or agent config already present:
  - `.cursorrules` — Cursor rules for the TanStack Start layout
  - `AGENTS.md` — longer agent/project context, including Intent skill-loading notes
  - `.vscode/settings.json` — hides/locks generated `routeTree.gen.ts`
  - `.cta.json` — CLI scaffold record
- Scripts from package manifests that look like dev/build/test (names only):
  - `dev` — Vite dev server on port 3000
  - `build` — production build
  - `preview` — preview the build
  - `generate-routes` — `tsr generate` for the file router
  - **No `test` script** was found in `package.json`

## 6. Safe first-touch vs do-not-edit-yet

### Safe first-touch (good candidates for a tiny onboarding PR)

| Path or area | Why it is relatively safe | Risk if handled carelessly |
|--------------|---------------------------|----------------------------|
| `docs/onboarding/` | Docs-only; this is where orientation notes, the setup log, and this map already belong | Misleading onboarding docs if paths or PASS/FAIL checks are wrong |
| `README.md` | Markdown at the root; does not change runtime behavior | Confusing install instructions if you rewrite the starter guide inaccurately |
| `src/routes/about.tsx` | One small page with no data layer; still **not** the first-PR default if docs are available | Broken About page or layout drift if edited without running the app |

Default first contribution should stay in `docs/onboarding/` unless a mentor expands scope.

### Do not edit yet (wait until you have tests, review, and a real task)

| Path or area | Why wait | What could break |
|--------------|----------|------------------|
| `.github/` (not present; if added later) | Shared CI pipeline | Everyone’s builds |
| `package-lock.json` and `package.json` dependency lists | Dependency graph for the whole app | Install or build failures for everyone |
| `.env` / future Supabase, migrations, or production env | Data and secrets | Data loss or leaked secrets |
| Shared packages used by multiple apps | **None in this clone**; if a `packages/` folder appears later, treat it as wide blast radius | Multiple features regress |
| `src/routeTree.gen.ts` | Generated by the router CLI | Route tree fights your edits on the next generate |
| `vite.config.ts`, `tsconfig.json`, `tsr.config.json` | Shared toolchain | Dev server, types, or route generation break |
| `src/router.tsx`, `src/routes/__root.tsx` | App-wide wiring and layout | The whole UI shell can fail |
| `src/lib/user.ts` and any future auth / vector search | High complexity; user helper is only a stub today | Security or session bugs later |
| `.cursorrules` / `AGENTS.md` | Agent config for the whole team (later steps will change these on purpose) | Agents follow wrong rules if edited casually in a first “hello world” PR |

## 7. Open questions for the team

- Where will Supabase / PostgreSQL / pgvector live? `.cursorrules` mentions `lib/supabase.ts`, but that path is **not found**. `AGENTS.md` says the blank app has no DB yet.
- When will GitHub Actions (CI) be added? There is no `.github/` folder to map today.
- Is a monorepo (`apps/`, `packages/`) planned, or will PREIshare stay a single root app? This clone is a single package.
- There is no `test` script and no test folder. What is the expected test command before a first feature PR?
- Should onboarding PRs also update `README.md`, or keep course artifacts only under `docs/onboarding/`?
- `.cursorrules` and `AGENTS.md` disagree slightly on data (Supabase client vs “no auth/DB”). Which document is the source of truth until Supabase is added?

## 8. How I will use this map next

- Configure AI project rules/memory using the paths above (next tooling steps), especially `src/routes/`, `src/components/`, and “do not invent `apps/` or `supabase/` until they exist.”
- Pick a first contribution only from **Safe first-touch** unless a mentor expands scope — default: `docs/onboarding/`.
- Revisit and edit this file when a path claim is proven wrong (for example when `.github/` or `lib/supabase.ts` actually appears).
