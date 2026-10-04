# PREIshare Dashboard Routing Plan

## Purpose

Map investor-facing dashboard URLs to TanStack Start route files before any further UI generation.
Source requirements: `docs/preishare-dashboard-requirements.md` (screens in section 3, layout regions in section 4, must-have navigation in section 5).

This document is a plan only. It does not add or edit route files.

## Current app inventory (as found)

Listed from `src/routes/` on this checkout. URLs come from each file’s `createFileRoute` path. `__root.tsx` is the root route, not a page URL.

| File / folder | Likely URL | Notes |
| --- | --- | --- |
| `src/routes/__root.tsx` | (app root layout) | Document shell for every page: site header, page body, site footer. Do not replace it with the investor sidebar. |
| `src/routes/index.tsx` | `/` | Public landing. Links onward to the dashboard. Not an investor screen. |
| `src/routes/about.tsx` | `/about` | Starter about page. Not in the requirements brief. |
| `src/routes/dashboard.tsx` | `/dashboard` | Layout route. Renders the investor shell and an `Outlet` for child pages. This is the layout role the scaffold names `src/routes/dashboard/route.tsx`. |
| `src/routes/dashboard/index.tsx` | `/dashboard/` | Index route. Dashboard home content (metric cards and activity list) inside the parent layout. |
| `src/routes/dashboard/portfolio.tsx` | `/dashboard/portfolio` | Child page. Already a portfolio screen, not an empty stub. |
| `src/routes/dashboard/deals.tsx` | `/dashboard/deals` | Child page from an earlier sprint. Not a screen in the current requirements brief. Do not delete it in this step. |
| `src/routes/dashboard/profile.tsx` | `/dashboard/profile` | Child page from an earlier sprint. Not a screen in the current requirements brief. Do not delete it in this step. |
| `src/routeTree.gen.ts` | (generated) | Generated route tree. Do not edit by hand. |

`src/routes/dashboard/route.tsx` is not in the tree. `src/routes/dashboard/activity.tsx` is not in the tree.

## Planned dashboard route tree

```text
/                          → existing public home (src/routes/index.tsx)
/about                     → existing starter page (leave as-is)
/dashboard                 → layout route (shell: header + sidebar + Outlet)
/dashboard                 → index (investor home: metrics and activity list)
/dashboard/portfolio       → existing child (portfolio placeholder / current portfolio page)
/dashboard/activity        → placeholder child to add later (activity destination)
/dashboard/deals           → existing child; keep; not part of this brief’s nav
/dashboard/profile         → existing child; keep; not part of this brief’s nav
```

The layout wraps the index and the child paths. Child pages must render in the `Outlet`, so the header and sidebar stay visible.

## File map (exact files)

| URL | Role | File | Status | Wraps / renders |
| --- | --- | --- | --- | --- |
| `/dashboard` | Layout route | `src/routes/dashboard.tsx` | Already present. Same responsibility as the scaffold path `src/routes/dashboard/route.tsx`. Do not add that second file. | Shared dashboard chrome; child content through `Outlet` |
| `/dashboard` | Index page | `src/routes/dashboard/index.tsx` | Already present. Do not recreate. | Investor home: metrics region and activity list |
| `/dashboard/portfolio` | Child | `src/routes/dashboard/portfolio.tsx` | Already present. | Portfolio page inside the layout |
| `/dashboard/activity` | Placeholder child | `src/routes/dashboard/activity.tsx` | Create in a later step. Not this step. | Minimal stub so an Activity link has a real target |
| `/dashboard/deals` | Existing child | `src/routes/dashboard/deals.tsx` | Already present. Leave it. | Deals page inside the layout |
| `/dashboard/profile` | Existing child | `src/routes/dashboard/profile.tsx` | Already present. Leave it. | Profile page inside the layout |

Do not create `src/routes/dashboard/route.tsx` while `src/routes/dashboard.tsx` is the layout. Two layout files for `/dashboard` would fight each other.

## Layout vs page responsibilities

- **Layout (`src/routes/dashboard.tsx`, the role of `src/routes/dashboard/route.tsx`)**: persistent investor chrome only — header, sidebar, and the main outlet. No metric cards and no activity list in this file.
- **Index (`src/routes/dashboard/index.tsx`)**: dashboard home content. Metric cards and the recent-activity list render here, inside the parent layout. Traces to the brief’s dashboard home: shell plus metrics and an activity list.
- **Placeholders**: `/dashboard/portfolio` and `/dashboard/activity` exist so navigation has real URLs. Portfolio already has a page file. Activity is the stub still to add. Full feeds and live balances stay later.

## Navigation labels (for sidebar / mobile nav later)

| Label | Path | Requirement link |
| --- | --- | --- |
| Overview | `/dashboard` | Brief section 3, dashboard home. Goals in section 2: recognize the investor area, see portfolio metrics, scan recent activity. |
| Portfolio | `/dashboard/portfolio` | Brief section 3, portfolio placeholder, so navigation and routing work. |
| Activity | `/dashboard/activity` | Brief section 3, activity placeholder, so navigation and routing work. Section 4 activity region on the home page is the short list; this path is the later destination. |

Labels stay short: Overview, Portfolio, Activity. Deals and Profile already have routes; they are not rows in this brief’s screen table, so this plan does not add them to the required nav.

## Out of scope for this plan

- Creating or editing any file under `src/routes/` in this step
- Component prop designs, styling, and Tailwind layout (later architecture and UI steps)
- Auth guards, login, and signup (brief section 3: later)
- Supabase queries, live balances, pgvector, payments, and charts (brief section 5: later)
- Deleting `deals.tsx`, `profile.tsx`, `about.tsx`, or `index.tsx`
- Hand-editing `src/routeTree.gen.ts`

## Success criteria for implementation steps

- Visiting `/dashboard` shows the layout shell and the home index content in the outlet.
- `/dashboard/portfolio` and `/dashboard/activity` render inside that same layout, not as a full-page replacement of the shell.
- No unrelated existing routes are deleted during dashboard work.
- The activity path is a minimal placeholder until a later step builds a fuller feed.

## Open questions

- The current sidebar labels Home, Portfolio, Deals, and Profile. This brief’s screen table names dashboard home, portfolio, and activity. A later nav step should add Activity and decide whether Deals and Profile stay visible.
- Portfolio is already a real page, not a one-line “coming soon” stub. Later steps should keep that page and avoid replacing it with a second portfolio file.
- The public site header in `__root.tsx` (Home, About, Docs) is separate from the investor sidebar. The investor header and sidebar stay in the dashboard layout only.
