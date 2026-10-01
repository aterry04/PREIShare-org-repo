# PREIshare Investor Dashboard — Information Architecture

## Purpose

Map of the four investor-facing pages for the dashboard shell. Mock data only.
This sprint does not include auth flows, admin tools, payments, or live API
contracts. Source of truth for product scope: `docs/investor-dashboard-brief.md`.

## URL map and page purposes

| URL path | Route name | Nav label | Page purpose | Primary content |
|----------|------------|-----------|--------------|-----------------|
| `/dashboard` | Dashboard home | Home | Quick scan of portfolio value and recent activity | Stats row, portfolio summary, recent activity |
| `/dashboard/portfolio` | Portfolio | Portfolio | Review holdings at a glance | Portfolio table (mock rows) |
| `/dashboard/deals` | Deals | Deals | See open property deals an investor might review | Deals list (mock cards or rows) |
| `/dashboard/profile` | Profile | Profile | View this member's profile details | Profile card (mock name and contact fields) |

Each URL is unique. No other investor pages are in this shell.

## Navigation rules

- Shared chrome: left sidebar on desktop, top header, main content beside or below that chrome.
- On a narrow screen the nav collapses or stacks so content does not overlap.
- The active nav item matches the current URL path.
- Labels stay short: Home, Portfolio, Deals, Profile.
- All four pages nest under `/dashboard` so one parent layout can wrap them.
- Nav labels and paths are defined once (see `NavItems` / `navConfig` in `docs/component-plan.md`). The sidebar renders that list; the header does not redefine it.

## Out of scope for this shell

- Sign-in / sign-up pages
- Live Supabase or PostgreSQL queries
- Admin or sponsor tools
- Payments, subscriptions, or document vaults
- A fifth product area (settings, notifications, portfolio switcher)

## Notes for later route files

Parent layout route: `dashboard`  
Child routes: index (home), `portfolio`, `deals`, `profile`

Those names match the URL map above. Later file-based routes should not add pages this table does not list.
