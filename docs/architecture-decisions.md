# Architecture Decisions — PREIshare Dashboard Shell (Sprint 3)

These notes explain why the shell is shaped this way so the next sprint can add auth and live data without guessing. They are not a claim that those later systems already work.

## ADR-001: TanStack Start with file-based routes

- **Context:** Each investor area needs a stable URL, and later data loading should attach to a page instead of a rewrite of the app.
- **Decision:** Use TanStack Start and TypeScript. Pages are files under `src/routes/`. The dashboard parent is `src/routes/dashboard.tsx`. Children are `src/routes/dashboard/index.tsx`, `portfolio.tsx`, `deals.tsx`, and `profile.tsx`, which map to `/dashboard`, `/dashboard/portfolio`, `/dashboard/deals`, and `/dashboard/profile`. App config lives in `app.config.ts` and is loaded by Vite through `vite.config.ts`.
- **Consequences:** Navigation matches `docs/dashboard-ia.md`. A later loader or server function can sit on one route file. Do not replace this with a hand-built router or a nested demo app folder.

## ADR-002: Shared AppShell layout

- **Context:** Home, Portfolio, Deals, and Profile must share the same sidebar, header, and main region.
- **Decision:** `AppShell`, `Sidebar`, and `Header` live in `src/components/layout/`. `src/routes/dashboard.tsx` wraps an `Outlet` in `AppShell`, so every child page renders in the main region.
- **Consequences:** Page files stay focused on content. Layout fixes happen once. Do not copy a second sidebar into each page component.

## ADR-003: Central nav config

- **Context:** Labels, paths, active states, and header titles drift if each file hardcodes its own list.
- **Decision:** `src/components/layout/navConfig.ts` is the only list of the four destinations (label, path, title). `NavItems` renders the links. Home is an exact match on `/dashboard`. The other areas may match their path as a prefix. `Header` reads the title with `getPageTitle`.
- **Consequences:** Adding a dashboard area means a route file plus one config row. Do not add a second hardcoded link list in `Sidebar`.

## ADR-004: Mock data boundary for the shell

- **Context:** Sprint 3 is a trustworthy UI shell. The client brief excludes live Supabase or PostgreSQL data.
- **Decision:** Widgets are presentational. Sample rows live as defaults or props on `StatsCard`, `PortfolioSummary`, `RecentActivity`, `PortfolioTable`, `DealsList`, and `ProfileCard`. Sample banners say the numbers are not live. There is no fake API layer pretending to be production.
- **Consequences:** The next sprint can replace mocks at the component or route boundary. Do not hide a stub fetch inside these components and call it live data.

## ADR-005: Responsive CSS and an accessibility baseline

- **Context:** Investors will open the shell on a laptop and a phone. Keyboard users need a visible focus cue and a named control when the sidebar is hidden.
- **Decision:** Shared rules are in `src/styles/dashboard.css`, imported from `src/styles.css`. Below 768px the sidebar collapses and a header button labeled Open navigation / Close navigation toggles it (`aria-expanded`, `aria-controls`). Stat cards reflow from one column to several. The holdings table scrolls inside `.dash-table-wrap`. Nav links have a minimum height of 44px and a `:focus-visible` outline.
- **Consequences:** The demo works at desktop and phone width. This is a baseline, not a full accessibility audit. Do not delete `dashboard.css` and rely only on one-off page styles.

## Next-sprint foundations (do not reverse casually)

| Foundation | Why it builds on this shell |
| --- | --- |
| Supabase auth | Protect `/dashboard/*` and replace the Member placeholder in the header and the sample profile card. |
| Live portfolio data | Replace mock stats, the portfolio summary, and `PortfolioTable` through route loaders or server functions. Keep the same component props. |
| pgvector search | Add search on deals or documents after listings live in Postgres. The deals page is the UI hook; search is not built yet. |
| GitHub Actions CI | Gate pull requests with `npm install`, `npm run typecheck`, and `npm run build` on this single-package repo. Add test and lint only after those scripts exist in `package.json`. |

## Explicit non-goals for Sprint 3

- Real sign-in, payments, document e-sign, or admin tools
- Live balances or a production database
- A final visual brand system
- Production deployment hardening
