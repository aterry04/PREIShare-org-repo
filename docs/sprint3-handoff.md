# Sprint 3 Handoff — PREIshare Investor Dashboard Shell

## Stakeholder summary

We built a responsive investor dashboard **shell** for PREIshare members.
An investor can move between Home, Portfolio, Deals, and Profile without
hunting through extra product pages. Numbers, holdings, deals, and the profile
card use **mock data**. This sprint does not sign anyone in and does not read
live portfolio or deals numbers from a database.

## What shipped

- TanStack Start + TypeScript app at the repo root (Vite, not a separate demo folder)
- File-based routes:
  - `/dashboard` — home overview
  - `/dashboard/portfolio` — holdings table
  - `/dashboard/deals` — open deals list
  - `/dashboard/profile` — read-only profile card
- Shared layout: `AppShell`, `Sidebar`, `Header`, and `navConfig` with active states and header titles
- Home widgets: `StatsCard`, `PortfolioSummary`, `RecentActivity`
- Area shells: `PortfolioTable`, `DealsList`, `ProfileCard`
- Responsive layout and basic keyboard focus in `src/styles/dashboard.css` (sidebar collapses below 768px behind an Open navigation button)
- Verification walkthrough: `docs/verification-checklist.md` (2026-10-01, ready for handoff)

The public starter page at `/` links into the dashboard. `/about` is still the original starter page. It is not an investor dashboard area.

## How to run locally (cold start)

This repo uses npm. The lockfile is `package-lock.json`. Scripts below are copied from `package.json`.

1. Install Node.js LTS if it is not already installed.
2. From the project root, run `npm install`.
3. Start the dev server with `npm run dev`. That script is `vite dev --port 3000`.
4. Open http://localhost:3000 and go to `/dashboard`, or use **Open investor dashboard** on the landing page.

Other scripts that exist today:

- `npm run typecheck` — TypeScript check (`tsc --noEmit`)
- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm run generate-routes` — regenerate the TanStack route tree

There is no `test` or `lint` script in `package.json` yet.

## Short demo script

1. Open `/dashboard`. Point out Total portfolio value, Open deals, and Contributions YTD, plus the portfolio summary and recent activity. Say the banner: figures are placeholders.
2. Use the sidebar: Portfolio, then Deals, then Profile. Header titles should read Your portfolio, Open deals, and Your profile.
3. Narrow the window below 768px (or about 375px wide). Use **Open navigation** to reach the same four areas, then close it.
4. Say clearly: values are mock placeholders for Sprint 3. Nothing on screen is a live balance.

## Known limitations

- No real sign-in, authentication, or authorization
- Portfolio, deals, profile, and home figures are mock or static sample copy
- No Supabase, PostgreSQL, or pgvector integration in this sprint
- No GitHub Actions CI pipeline yet
- No `test` or `lint` npm script yet
- Not production-hardened (no live empty, loading, or error states for API data)
- The site header above the dashboard still includes the starter About link

## Recommended next-sprint work

1. Supabase auth and protected `/dashboard/*` routes
2. Replace mock widgets with live portfolio and deals queries
3. pgvector-powered search for deals or documents, after data lives in Postgres
4. GitHub Actions CI that runs install, typecheck, and build on pull requests; add test and lint only after those scripts exist
5. Empty, loading, and error states for each data widget once queries are real

## References

- Client brief: `docs/investor-dashboard-brief.md`
- IA: `docs/dashboard-ia.md`
- Components: `docs/component-plan.md`
- Verification: `docs/verification-checklist.md`
- Architecture decisions: `docs/architecture-decisions.md`
