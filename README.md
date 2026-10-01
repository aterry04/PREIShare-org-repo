# PREIshare Investor Dashboard Shell

TanStack Start + TypeScript app for the PREIshare investor dashboard (Sprint 3 shell). Investors can open Home, Portfolio, Deals, and Profile. The numbers on those pages are mock placeholders.

The app lives at the project root, beside the `docs/` folder.

## Setup

1. Install Node.js LTS if you do not already have it.
2. From the project root, run: `npm install`
3. Start the dev server: `npm run dev`
4. Open http://localhost:3000 (the `dev` script uses port 3000).
5. Go to `/dashboard`, or choose **Open investor dashboard** on the landing page.

## Handoff docs

- [Sprint 3 handoff](docs/sprint3-handoff.md) — what shipped, how to demo it, and what is still mock
- [Architecture decisions](docs/architecture-decisions.md) — why the routes, shell, and mock-data boundary look like this
- [Verification checklist](docs/verification-checklist.md) — what was clicked and what passed

## Project notes

- Planning docs live in `docs/` (client brief, information architecture, and component plan).
- File-based routes live under `src/routes/`.
- `src/routes/__root.tsx` wraps every page. `src/routes/index.tsx` is the landing page at `/`.
- Investor areas are `/dashboard`, `/dashboard/portfolio`, `/dashboard/deals`, and `/dashboard/profile`.
- TanStack Start is configured in `app.config.ts`. Vite loads that file through `vite.config.ts`.
- `/about` is the original starter page. It is not an investor dashboard area.

## Other scripts

- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm run typecheck` — TypeScript check
- `npm run generate-routes` — regenerate the route tree

New engineers who complete onboarding are listed in [CONTRIBUTORS.md](CONTRIBUTORS.md).
