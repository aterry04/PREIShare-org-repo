# PREIshare Dashboard — Component Architecture & Responsive Layout Map

## Purpose

Blueprint for the investor dashboard shell only. Later implementation steps must follow these names, regions, and responsive rules. Placeholder content is allowed in UI steps. This file does not add React components.

## Sources

- `docs/preishare-dashboard-requirements.md` (sections 3–5: screens, layout regions, must-have vs later)
- `docs/dashboard-routing-plan.md` (layout vs index, and the nav labels Overview, Portfolio, Activity)

Navigation destinations in this blueprint are only those three paths. Deals and Profile routes exist in the repo from an earlier sprint. This blueprint does not add them to the required nav.

## Layout regions

| Region | Role | Typical components |
| --- | --- | --- |
| Header | Top bar: PREIshare name and a simple account placeholder | Header |
| Sidebar | Vertical nav on tablet and desktop | Sidebar |
| Mobile nav | Menu button and panel on small screens | MobileNav |
| Main | Scrollable content for the active child route | Route outlet, then home widgets on the index page |

`AppShell` is the frame that places Header, Sidebar, MobileNav, and Main together. The dashboard layout route (`src/routes/dashboard.tsx`, the role of `src/routes/dashboard/route.tsx`) renders `AppShell` once and puts the active child in Main. The index route (`src/routes/dashboard/index.tsx`) fills Main with the home widgets. It does not draw the shell.

The public site header in `src/components/Header.tsx` belongs to `src/routes/__root.tsx`. It is not this dashboard Header.

## Component inventory

### AppShell

- **Responsibility:** Outer dashboard frame. Arranges header, navigation, and main.
- **Parent:** Dashboard layout route.
- **Children:** Header, Sidebar, MobileNav, and the main content slot.
- **Props (beginner):** `children` (the page content to show in main).
- **State:** Owns whether the mobile nav is open. Passes that open flag and a close action into MobileNav. Child route changes close the panel.

### Header

- **Responsibility:** Top bar with PREIshare branding and a simple account placeholder. Shows the current page title so the investor knows which section they are in.
- **Parent:** AppShell.
- **Children:** none required.
- **Props:** `title` (text, optional — default “PREIshare”); `accountLabel` (text, optional — a placeholder such as “Member”, not a signed-in user from a server).

### Sidebar

- **Responsibility:** Tablet and desktop navigation links that match the routing plan.
- **Parent:** AppShell.
- **Children:** one link per nav item.
- **Props:** `items` (list of `{ label, to }`).

Required `items` (same list MobileNav uses):

| Label | `to` |
| --- | --- |
| Overview | `/dashboard` |
| Portfolio | `/dashboard/portfolio` |
| Activity | `/dashboard/activity` |

### MobileNav

- **Responsibility:** Small-screen navigation: a menu button and a panel that lists the same destinations as Sidebar.
- **Parent:** AppShell.
- **Children:** the same links as Sidebar.
- **Props:** `items` (same shape as Sidebar); `open` (yes/no); `onClose` (action AppShell runs when the investor closes the panel or chooses a link). The open flag lives in AppShell, not inside each page.

### MetricCard

- **Responsibility:** One reusable metric tile: a label, a value, and an optional hint. The home page uses three of these. The component does not fetch a balance and does not draw a chart.
- **Parent:** Dashboard home, inside Main.
- **Children:** none.
- **Props:** `label` (text); `value` (text); `hint` (text, optional). The parent passes placeholder strings. Sample wording belongs in `hint` so a reader can tell the figure is not live.

### PortfolioSummary

- **Responsibility:** A short portfolio snapshot on the dashboard home.
- **Parent:** Dashboard home, inside Main.
- **Children:** none required.
- **Props:** `headline` (text); `summaryLines` (list of text); `emptyMessage` (text shown when the list is empty).

### RecentActivity

- **Responsibility:** A short list of recent investment activity on the dashboard home.
- **Parent:** Dashboard home, inside Main.
- **Children:** none required.
- **Props:** `items` (list of `{ id, title, detail, timestamp }`, all text); `emptyMessage` (text shown when `items` is empty, such as “No recent activity”).

## Composition (dashboard home)

Main content on `/dashboard` composes, in order:

1. A grid of three `MetricCard`s. The parent passes each card its own `label`, `value`, and `hint`.
2. `PortfolioSummary`.
3. `RecentActivity`.

Empty states are required. If a list prop is empty, the widget shows its `emptyMessage` instead of a blank region. Placeholder lines are allowed. The widgets do not load those lines themselves.

`/dashboard/portfolio` and `/dashboard/activity` render their own page content in the same Main slot. They do not repeat AppShell.

## Responsive behavior

Sidebar stays visible from tablet width upward. It is not a second collapsing mode on tablet. Only mobile hides it and uses MobileNav.

| Viewport | Approx width | Nav behavior | Main content |
| --- | --- | --- | --- |
| Mobile | under 768px | Sidebar hidden. A menu button opens MobileNav. Choosing a link or closing the panel hides it again. | One column. Metric cards stack. Summary and activity stack. |
| Tablet | 768px–1024px | Sidebar visible and narrower, fixed in the shell. Menu button hidden. | Metric cards in two columns when space allows. Summary and activity side by side if they fit, otherwise stacked. |
| Desktop | over 1024px | Sidebar visible and fixed in the shell. | Three metric cards in one row. Summary and activity side by side, with a readable line length. |

Notes for implementers:

- The menu button must be easy to tap, at least about 44px on each side, and must expose an expanded/collapsed state to assistive tech.
- Main content scrolls. The header stays usable and does not cover the widgets.
- Anything an investor must do on a phone has a visible control. Required actions do not depend on hover.

## File targets (for later steps — do not create them in this step)

Blueprint names:

- `src/components/dashboard/AppShell.tsx`
- `src/components/dashboard/Header.tsx`
- `src/components/dashboard/Sidebar.tsx`
- `src/components/dashboard/MobileNav.tsx`
- `src/components/dashboard/MetricCard.tsx`
- `src/components/dashboard/PortfolioSummary.tsx`
- `src/components/dashboard/RecentActivity.tsx`

Already in this checkout (do not add a second copy of the same job):

| Blueprint name | Already at | Note |
| --- | --- | --- |
| AppShell | `src/components/layout/AppShell.tsx` | Keep this file as the frame. |
| Header | `src/components/layout/Header.tsx` | Dashboard top bar, not `src/components/Header.tsx`. |
| Sidebar | `src/components/layout/Sidebar.tsx` | Desktop/tablet nav. |
| MobileNav | (no file yet) | Menu open state already lives on AppShell. A later step adds this component or keeps that behavior and still meets the MobileNav contract. |
| MetricCard | `src/components/dashboard/StatsCard.tsx` | Same job (label, value, optional hint). Later steps should treat MetricCard as this tile, not add a second stat component. |
| PortfolioSummary | `src/components/dashboard/PortfolioSummary.tsx` | Already present. |
| RecentActivity | `src/components/dashboard/RecentActivity.tsx` | Already present. |

## Out of scope (prevent scope creep)

- Real Supabase, PostgreSQL, or other live data fetching
- Auth, login, signup, roles, and permissions
- Payments, a documents vault, and tax exports
- Charts, maps, and PDF export
- Routes beyond `docs/dashboard-routing-plan.md`
- Editing holdings, or any control that saves investor data
- A separate design-system package or animation-heavy UI
- Putting the investor sidebar on `__root.tsx` so `/` and `/about` show it

## Success criteria for this blueprint

- Each named component has one job.
- Props are plain language: text, yes/no, list of items, or an action. No component hard-codes a portfolio dollar amount.
- Mobile, tablet, and desktop navigation are each described.
- The home page is three metric cards, a portfolio summary, and a recent-activity list, matching the requirements brief.
- The out-of-scope list blocks auth, live data, charts, and extra routes.
