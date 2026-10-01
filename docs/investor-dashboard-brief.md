# PREIshare Investor Dashboard — Client Brief (Sprint 3 Shell)

## Product summary

PREIshare helps members decide where to invest in real estate. In this sprint the
person using the product is an investor who already has a reason to open the
dashboard: they want to see how their holdings look, which property deals are
open, and who their profile says they are. They should get that picture from a
calm, trustworthy shell—home overview first, then Portfolio, Deals, and
Profile—without hunting through extra pages.

This delivery is the **shell only**. It is layout, file-based routes, and
reusable UI filled with labeled mock content. It does not sign anyone in, and
it does not read live portfolio or deals numbers from a database.

## Primary actors

| Actor | Role in this sprint | In scope to build? |
|-------|---------------------|--------------------|
| Investor (member) | Opens the dashboard to scan portfolio value, browse open deals, and review their own profile | Yes — primary user |
| Future admin | May later publish listings and manage investors | No — named only so later work does not treat admin screens as part of this shell |

## Investor goals

1. Land on a home overview and immediately see a portfolio snapshot and a short recent-activity placeholder.
2. Move to Portfolio, Deals, and Profile from the same shell, without a separate app or a cluttered menu.
3. Read every screen on a phone and on a desktop: labels stay clear, navigation stays consistent, and mock numbers are obviously not live.

## Must-have dashboard areas (this sprint)

| Area | Route idea (for later steps) | What the investor should see |
|------|------------------------------|------------------------------|
| Home overview | `/dashboard` | Stat cards, a portfolio summary placeholder, and a recent-activity list placeholder |
| Portfolio | `/dashboard/portfolio` | A table or list shell of holdings, filled with mock data |
| Deals | `/dashboard/deals` | A list shell of open property deals an investor might review, filled with mock data |
| Profile | `/dashboard/profile` | A profile card shell with name and contact placeholders |

No other product area is in scope for this sprint.

## Success criteria (demo-ready shell)

- [ ] From persistent navigation, an investor can open Home, Portfolio, Deals, and Profile.
- [ ] Each of those four areas is its own route, and each page shows a clear title for that area.
- [ ] The shell has a sidebar (or equivalent nav), a header, and a main content region.
- [ ] On a narrow screen the nav collapses or stacks, and content does not overlap or become unusable.
- [ ] Placeholder content is labeled as mock so a stakeholder can tell the numbers are not live.
- [ ] The built UI matches this brief: only the four areas above appear as product pages.

## Out of scope (explicit non-goals for this sprint)

- Real sign-in, authentication, and authorization
- Live Supabase or PostgreSQL portfolio and deals data
- Payments, subscriptions, and document e-sign
- Admin tools for creating or editing investors, listings, or deals
- Production deployment hardening and CI beyond the project setup already in the repo

## Prompting notes for later AI steps

Treat this file as the source of truth. When a later prompt asks a coding agent
to build routes or UI, quote this brief and require TypeScript, TanStack Start
file-based routes, reusable React components, and mock data only. Reject any
page or feature listed under Out of scope, including login, live database
numbers, payments, and admin tools. If a draft adds a fifth product area, delete
it and keep Home, Portfolio, Deals, and Profile.

## Open questions / assumptions

- UI copy is English for this shell.
- One investor views their own portfolio. There is no portfolio switcher yet.
- Visual design can stay simple and professional. A full brand system is not part of this sprint.
- Deal rows in the shell are placeholders. They are not required to implement the full investor-listing field set from `docs/domain/investor-listing-domain-brief.md`.
