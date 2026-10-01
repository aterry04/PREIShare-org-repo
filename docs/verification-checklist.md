# PREIshare Investor Dashboard Shell — Verification Checklist

**Sprint:** 3 (TanStack Start UI shell)  
**Verifier:** Alexis Terry  
**Date:** 2026-10-01  
**App URL tested:** http://localhost:3000  
**Sources of truth:** `docs/investor-dashboard-brief.md`, `docs/dashboard-ia.md`, `docs/component-plan.md`

## How to use this checklist

- **Pass** — requirement met; evidence describes what was seen in the browser.
- **Fail** — in-scope shell issue; fix before handoff or note the fix.
- **Deferred** — intentionally out of scope for this sprint; reason required.

Walkthrough used the local dev server (`npm run dev`) at desktop width (1920px) and a 375px phone viewport.

---

## 1. Routing and information architecture

| ID | Check | Status | Evidence |
|----|--------|--------|----------|
| R1 | `/dashboard` loads dashboard home inside AppShell | Pass | Opened `/dashboard`. Header title was "Dashboard overview". Stats, portfolio summary, and recent activity were visible inside the shell. |
| R2 | `/dashboard/portfolio` loads portfolio page shell | Pass | Opened `/dashboard/portfolio`. Header title was "Your portfolio". Holdings table showed Riverfront Lofts and Cedar Business Park. |
| R3 | `/dashboard/deals` loads deals page shell | Pass | Opened `/dashboard/deals`. Header title was "Open deals". Harbor View Residences (Open) and Summit Logistics Hub (Closing soon) were listed. |
| R4 | `/dashboard/profile` loads profile page shell | Pass | Opened `/dashboard/profile`. Header title was "Your profile". Read-only card showed name, email, membership, preferred contact, and notes. |
| R5 | Unknown paths do not break the whole app | Pass | Opened `/dashboard/not-a-page`. The app stayed up and showed "Not Found". Sidebar links were still usable. Header title fell back to "Dashboard". |

**IA notes:** The four investor URLs and nav labels match `docs/dashboard-ia.md` (Home, Portfolio, Deals, Profile). The original site header above the dashboard still links to `/` and `/about`. `/about` is the starter page, not an investor dashboard area.

---

## 2. Navigation labels and active states

| ID | Check | Status | Evidence |
|----|--------|--------|----------|
| N1 | Sidebar labels match the brief and IA | Pass | Sidebar labels were Home, Portfolio, Deals, and Profile. Brand text was PREIshare. |
| N2 | Active nav item highlights the current route | Pass | On `/dashboard` only Home had `aria-current="page"`. On portfolio, deals, and profile, only that area was current. Home did not stay current on the other pages. |
| N3 | Header page title updates when changing routes | Pass | Titles followed `navConfig`: Dashboard overview, Your portfolio, Open deals, Your profile. |
| N4 | Nav links use client routing | Pass | At 375px, opened the menu and clicked Portfolio. The URL changed to `/dashboard/portfolio` and the header became "Your portfolio" without a broken page. The menu closed after the click. |

---

## 3. Layout shell and responsiveness

| ID | Check | Status | Evidence |
|----|--------|--------|----------|
| L1 | AppShell shows sidebar, header, and main content on desktop | Pass | At 1920px the shell was a row. Sidebar was 256px wide. Header and main content sat beside it. Menu button was hidden. |
| L2 | Narrow viewport: nav remains usable | Pass | At 375px the sidebar height collapsed to about 1px. Button name was "Open navigation" and `aria-expanded` was false. After click it became "Close navigation" and expanded, with Home, Portfolio, Deals, and Profile reachable. |
| L3 | No permanent horizontal scroll at about 375px | Pass | At 375px on `/dashboard`, `documentElement.scrollWidth` was not wider than the viewport. |
| L4 | Main content remains readable; cards and tables stack or scroll on purpose | Pass | At 375px the stats grid was one column (about 310px). The holdings table sits in `.dash-table-wrap` with horizontal overflow inside the table, not the whole page. |
| L5 | Basic accessibility: focusable controls with accessible names | Pass | Sidebar links are real links. The mobile control is a button named "Open navigation" / "Close navigation", with `aria-expanded` and `aria-controls="dashboard-sidebar"`. `src/styles/dashboard.css` includes a `:focus-visible` outline for dashboard nav and header controls. |

---

## 4. Mock content clarity (demo readiness)

| ID | Check | Status | Evidence |
|----|--------|--------|----------|
| M1 | Dashboard home shows labeled mock investor metrics | Pass | Tiles: Total portfolio value $300,000 (Sample total), Open deals 3 (Sample count), Contributions YTD $24,000 (Sample YTD). Page note: "Demo shell — all figures are placeholders". |
| M2 | Portfolio summary and table show placeholder holdings | Pass | Home summary listed Sample Multifamily Fund A, Sample Industrial Note B, and Sample Cash Reserve, with "Sample data — placeholders only, not live balances". Portfolio page formatted money as $50,000 and $56,200 and said "Sample holdings — not live balances". |
| M3 | Deals list shows open-deal placeholders | Pass | Harbor View Residences, Tampa, FL, Min. $25,000, Open. Summit Logistics Hub, Columbus, OH, Min. $50,000, Closing soon. Note: "Sample deals — not a live listing feed". |
| M4 | Profile card shows member placeholder fields | Pass | Sample Investor, sample.investor@example.com, Preferred investor, preferred contact Email, and a short notes line. Note: "Sample profile — not a live account". No edit fields. |
| M5 | No raw TODO or empty broken panels on primary views | Pass | Primary views showed sample copy and rows. Empty-list messages exist in Portfolio and Deals ("No holdings to show yet…", "No open deals right now…") and were checked earlier, then sample rows were restored. |

---

## 5. Out-of-scope boundaries (must stay deferred)

| ID | Check | Status | Evidence / reason |
|----|--------|--------|-------------------|
| O1 | No real authentication or login gate | Deferred | The brief is a shell-only sprint. Sign-in is an explicit non-goal. The demo opens straight into the dashboard. |
| O2 | No live Supabase or PostgreSQL data | Deferred | Figures are labeled sample placeholders. No live portfolio or deals query is required for these pages. |
| O3 | No production deploy required for this verification | Deferred | Checked on the local dev server only. |
| O4 | No payment, document vault, or admin tools beyond the brief | Pass | Dashboard pages are home, portfolio, deals, and profile only. No checkout, e-sign, or admin screens were added. |

---

## 6. Defects found and resolution

None — all in-scope checks passed on this walkthrough.

The starter header above the shell still includes an About link to `/about`. That page is the original TanStack starter, not one of the four investor areas. It is not a blocker for the dashboard demo.

---

## 7. Sign-off for handoff

- [x] All **blocker** fails fixed or explicitly accepted with reason
- [x] Deferred items only cover agreed out-of-scope work
- [x] Shell is demoable against the PREIshare client story for Sprint 3

**Overall result:** Ready for stakeholder handoff

**Verifier signature:** Alexis Terry
