# PREIshare Investor Dashboard Shell

TanStack Start + TypeScript starter for the PREIshare investor dashboard (Sprint 3 shell).

The app lives at the project root, beside the `docs/` folder.

## Setup

1. Install Node.js LTS if you do not already have it.
2. From the project root, run: `npm install`
3. Start the dev server: `npm run dev`
4. Open the local URL printed in the terminal. This project serves the app at http://localhost:3000.

## Project notes

- Planning docs live in `docs/` (client brief, information architecture, and component plan).
- File-based routes live under `src/routes/`.
- `src/routes/__root.tsx` wraps every page. `src/routes/index.tsx` is the home route at `/`.
- TanStack Start is configured in `app.config.ts`. Vite loads that file through `vite.config.ts`.
- Dashboard area routes (portfolio, deals, and profile) are added in a later step. This scaffold does not include them.
- `/about` is the original starter page. It is not an investor dashboard area.

## Other scripts

- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm run typecheck` — TypeScript check

New engineers who complete onboarding are listed in [CONTRIBUTORS.md](CONTRIBUTORS.md).
