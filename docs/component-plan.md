# PREIshare Investor Dashboard — Component Inventory

## Scope

Reusable UI pieces for a responsive shell with **mock data only**.
Components present structure and labeled placeholder content. They do not call
real APIs, sign anyone in, or charge payments. Page list comes from
`docs/dashboard-ia.md`.

## Layout components (shared chrome)

| Component | Responsibility | Used on | Must NOT do |
|-----------|----------------|---------|-------------|
| `AppShell` | Page frame that places Sidebar, Header, and the main content region | All `/dashboard/*` pages | Own page-specific widgets or fetch data |
| `Sidebar` | Branding plus the primary nav region on larger screens; renders the shared nav list | AppShell | Define the nav labels itself, duplicate the header title, or hardcode deal or holding rows |
| `Header` | Top bar with the current page title and a simple placeholder for the member | AppShell | Define the full nav list (that list lives in `navConfig` only) |
| `NavItems` / `navConfig` | Single source of the four nav labels and paths: Home, Portfolio, Deals, Profile | Sidebar, and a collapsed mobile nav if one is added later | Render stats, tables, deal rows, or profile fields |

## Dashboard home widgets

| Component | Responsibility | Used on | Must NOT do |
|-----------|----------------|---------|-------------|
| `StatsCard` | Show one metric label, one value, and an optional hint, marked as mock | Dashboard home | Fetch data or own the page layout |
| `PortfolioSummary` | Short snapshot of portfolio value for the home scan | Dashboard home | Replace the full holdings table on the Portfolio page |
| `RecentActivity` | Simple list of recent mock events | Dashboard home | Own global navigation or the deals list |

## Page-level shells

| Component | Responsibility | Used on | Must NOT do |
|-----------|----------------|---------|-------------|
| `PortfolioTable` | Tabular mock holdings | Portfolio page only | Live market data or the home summary snapshot |
| `DealsList` | List or cards of mock open deals | Deals page only | Checkout, subscribe, or e-sign flows |
| `ProfileCard` | Mock member name and contact fields | Profile page only | Password change, sign-in, or auth |

## Composition rules

1. One job per component. If two rows describe the same job, merge or delete one.
2. Layout components wrap pages. Page widgets never rebuild the sidebar, header, or nav list.
3. Mock values are inline constants for this sprint. Real Supabase comes later.
4. Names above are locked for later prompts. Do not rename `AppShell`, `Sidebar`, `Header`, `StatsCard`, `PortfolioSummary`, `RecentActivity`, `PortfolioTable`, `DealsList`, or `ProfileCard` without updating both this file and `docs/dashboard-ia.md`.

## Mapping check (IA ↔ components)

- Home (`/dashboard`) → `StatsCard`, `PortfolioSummary`, `RecentActivity` inside `AppShell`
- Portfolio (`/dashboard/portfolio`) → `PortfolioTable` inside `AppShell`
- Deals (`/dashboard/deals`) → `DealsList` inside `AppShell`
- Profile (`/dashboard/profile`) → `ProfileCard` inside `AppShell`

Every brief goal has a page: scan value on Home, holdings on Portfolio, open deals on Deals, profile on Profile. No component in this inventory is unused, and no page is missing a widget.
