# PREIshare Investor Dashboard — Requirements Brief

## 1. Product context

PREIshare helps people decide where to invest in real estate. This sprint builds
the investor dashboard shell: a clear home base where an investor can see
portfolio metrics, scan recent activity, and move into deeper tools later.
The delivery is layout plus placeholder content. It does not include live
market numbers or account management.

## 2. Primary actor and goals

- **Actor:** Investor (a member opening their private dashboard)
- **Goals on first visit:**
  1. Recognize they are in the PREIshare investor area from the header.
  2. Move between dashboard sections without getting lost.
  3. See a few portfolio metrics at a glance.
  4. Scan recent activity related to their investments.

## 3. Primary screens (this sprint)

| Screen | Purpose | In this sprint? |
|--------|---------|-----------------|
| Dashboard home (`/dashboard`) | Shell plus metric cards and an activity list | Yes |
| Portfolio placeholder (`/dashboard/portfolio`) | Show that navigation and routing work | Yes (minimal empty or placeholder state) |
| Activity placeholder (`/dashboard/activity`) | Show that navigation and routing work | Yes (minimal empty or placeholder state) |
| Login / signup | Authentication | No (later) |
| Live portfolio detail or trades | Deep investment tools | No (later) |

## 4. Dashboard layout regions (must describe in UI work)

1. **Header** — PREIshare name or logo, plus a simple account placeholder
2. **Navigation** — sidebar on a wide screen; a collapsible menu on a narrow screen
3. **Metrics region** — cards for summary numbers (placeholders are fine)
4. **Activity region** — a short list of recent items (placeholders are fine)
5. **Main content area** — where each page’s own content appears inside the shell

## 5. Must-have vs later

### Must-have (demoable shell)

- File-based routes under `/dashboard`
- An app shell that composes header, navigation, and main content
- Usable layout on mobile, tablet, and desktop widths
- Placeholder metric cards and a recent-activity list on the home page
- Empty-state or sample-data wording so people can tell the numbers are not live
- Short navigation labels an investor would understand

### Later (explicitly out of scope now)

- Real Supabase queries, live balances, or pgvector search
- Authentication, roles, and permissions screens
- Payments, a documents vault, and tax exports
- A full design system beyond a clean, readable layout
- Charts that need live time-series data

## 6. Success criteria (how we know the shell is done)

- [ ] An investor can open the dashboard home route in the browser.
- [ ] Header, navigation, metrics, and activity regions are all visible on a desktop width.
- [ ] On a narrow (mobile) width, navigation still works (for example a menu that opens and closes).
- [ ] Placeholder content is labeled so a stakeholder can tell the data is not live.
- [ ] What gets built matches this brief. Extra product areas are not added in secret.
- [ ] A teammate can read this file and understand the scope in under five minutes.

## 7. Notes for AI-assisted build

- Every implementation prompt should quote this file as the scope check.
- Build in small steps: routes, then shell, then navigation, then widgets, then responsive checks.
- Reject output that adds features listed under Later, including login, payments, live balances, and charts that need a live feed.
