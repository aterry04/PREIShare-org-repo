\# PREIshare — AGENTS.md



Standing instructions for humans and coding agents. Read

`.cursor/rules/preishare.mdc` on every session (always-apply project rules).

Onboarding context lives in `docs/onboarding/`.



\## What this product is



PREIshare is a real-estate intelligence product: it turns property and market

data into something people can use when deciding where to live, buy, or invest.

This checkout is the team’s TanStack Start web app. New contributors join by

forking, branching, and opening a pull request—not by pushing to

`EdTechForLearning/PREIShare-org-repo`.



\## Stack (do not substitute)



\- TypeScript

\- TanStack Start + React (file-based routes)

\- Tailwind CSS + Vite (verified in this clone)

\- Target data platform: Supabase, PostgreSQL, pgvector (folders \*\*not in this

&#x20; clone yet\*\*—see `docs/onboarding/repo-map.md`)



Do not assume Next.js, Prisma, or a multi-app monorepo. There is no `apps/` or

`packages/` directory here. The app is at the repository root; UI code is

`src/`.



\## Layout (verified)



\- `src/routes/` — pages (`\_\_root.tsx`, `index.tsx`, `about.tsx`)

\- `src/components/` — Header, Footer, ThemeToggle

\- `src/router.tsx` — router factory; `src/routeTree.gen.ts` is generated (do not edit by hand)

\- `src/styles.css` — Tailwind entry

\- `docs/onboarding/` — orientation notes, setup log, repo map



\## How to run (scripts that exist)



```bash

npm install

npm run dev          # Vite on port 3000

npm run build

npm run preview

npm run generate-routes

