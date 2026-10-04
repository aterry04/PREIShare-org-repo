# PREIshare Investor Dashboard — Stakeholder Handoff

**Sprint focus:** Responsive investor dashboard shell (TanStack Start routes + React UI)
**Audience:** PREIshare product stakeholders and the next implementation topic owners
**Date:** 2026-10-04
**Prepared by:** Alexis Terry

## 1. Demo today (what investors can click)

- Visit `/dashboard` to open the investor home inside the shell.
- The layout route is `src/routes/dashboard/route.tsx` (`AppShell` around the page). The home content is `src/routes/dashboard/index.tsx`.
- Desktop (about 1280px): header with PREIshare branding and an “Investor” account chip, plus a sidebar. Labels are Overview, Portfolio, and Activity.
- Narrow width (about 375px): the sidebar is hidden. **Open menu** / **Close menu** shows the same three links as an overlay. Checked in `docs/responsive-qa-checklist.md`.
- Home composition:
  - Three `MetricCard`s: Portfolio value, Active investments, and Distributions (YTD). Each value is an em dash, with a hint that the figure is not live.
  - `PortfolioSummary` with an empty holdings list and the message “No portfolio holdings to show yet…”
  - `RecentActivity` with an empty list and the message “No recent activity yet…”
- `/dashboard/portfolio` opens a sample holdings page. `/dashboard/activity` opens a short placeholder. Neither is a live feed.

**Out of scope for this demo:** live Supabase data, login or auth gates, editing holdings, payments, and charts.

## 2. Requirements traceability

Criteria are copied from section 6 of `docs/preishare-dashboard-requirements.md`.

| Success criterion (from requirements brief) | Status | Evidence |
| --- | --- | --- |
| An investor can open the dashboard home route in the browser. | Met | `/dashboard` renders `src/routes/dashboard/index.tsx` inside `src/routes/dashboard/route.tsx`. |
| Header, navigation, metrics, and activity regions are all visible on a desktop width. | Met | `docs/responsive-qa-checklist.md` desktop rows D1–D5. Header, Sidebar, three MetricCards, PortfolioSummary, and RecentActivity. |
| On a narrow (mobile) width, navigation still works (for example a menu that opens and closes). | Met | `MobileNav` at 375px. QA rows M3–M5 and fix-log cycle 1. |
| Placeholder content is labeled so a stakeholder can tell the data is not live. | Met | Metric hints such as “Connect data to see live totals”, plus the two empty-state sentences on the home page. |
| What gets built matches this brief. Extra product areas are not added in secret. | Partial | Required nav is Overview, Portfolio, and Activity only. `/dashboard/deals` and `/dashboard/profile` still exist from an earlier sprint and are not in this brief’s screen table. They are not in the current sidebar. |
| A teammate can read this file and understand the scope in under five minutes. | Met | `docs/preishare-dashboard-requirements.md` states the actor, screens, must-haves, and later work in one short brief. |

## 3. Decisions made (so the next topic does not re-litigate them)

- **Routing:** `/dashboard` is a layout in `src/routes/dashboard/route.tsx`. The home is the index route `src/routes/dashboard/index.tsx`. Child paths are `/dashboard/portfolio` and `/dashboard/activity`. The file name is the URL. There is no separate hand-written route table.
- **Shell regions:** `AppShell` places `Header`, `Sidebar` (from 768px up), `MobileNav` (under 768px), and the main slot. The index page does not draw a second shell.
- **Widgets:** `MetricCard`, `PortfolioSummary`, and `RecentActivity` only display props. Sample arrays in those files are named `MOCK_PORTFOLIO_HOLDINGS` and `MOCK_RECENT_ACTIVITY`. The home page currently passes empty lists so the empty-state copy shows.
- **Responsive approach:** Sidebar is hidden below 768px. The menu control lives in `MobileNav`. The open list overlays the page so the main column does not jump. At 1280px the three metric cards share one row, and the summary sits beside recent activity.

## 4. Known limitations (honest baseline)

- **Mock data only:** Home metrics are dashes. Portfolio and activity regions on the home are empty-state messages. Nothing on this shell reads PostgreSQL, Supabase, or pgvector.
- **Auth not wired:** Anyone who can open the app can open `/dashboard`. There is no session, role, or login screen.
- **No mutations:** The shell does not save holdings, payments, documents, or tax exports.
- **No charts:** Metric cards are label, value, and hint only.
- **QA residual notes:** The header title stays “Overview” on Portfolio and Activity because the layout passes one title. Page content still changes. Deals and Profile routes remain from an earlier sprint and are outside this brief’s nav. Both notes are in `docs/responsive-qa-checklist.md`.

## 5. Recommended next sprint work

1. Connect server functions to Supabase for real portfolio and activity reads. Keep the three widgets presentational and pass data in as props.
2. Add authentication and limit `/dashboard` to a signed-in investor.
3. Replace the dash values and empty lists with typed data. Keep the empty-state sentences for a real empty account.
4. Re-run `docs/responsive-qa-checklist.md` at 375px, 768px, and 1280px with longer names and a full activity list.
5. Demo `/dashboard` on a phone width and a desktop width, and say out loud that the figures are not live until the data step lands.

## 6. Artifact index (for handoff package)

- Requirements: `docs/preishare-dashboard-requirements.md`
- Routing plan: `docs/dashboard-routing-plan.md`
- Component architecture: `docs/dashboard-component-architecture.md`
- Responsive QA: `docs/responsive-qa-checklist.md`
- Routes: `src/routes/dashboard/route.tsx`, `src/routes/dashboard/index.tsx`
- Shell: `src/components/dashboard/AppShell.tsx`, `Header.tsx`, `Sidebar.tsx`, `MobileNav.tsx`
- Home widgets: `src/components/dashboard/MetricCard.tsx`, `PortfolioSummary.tsx`, `RecentActivity.tsx`
