# Sponsor Auth & Property Listings — Requirements Brief (Sprint 4)

## Client story (restated)

PREIshare sponsors need a secure way to sign in to the dashboard and manage
real property listings stored in PostgreSQL. Secret keys and privileged
database access must stay on the server and never ship in the browser bundle.

## Actors

| Actor | Goal |
| --- | --- |
| Sponsor | Sign up and log in, then create and view the property listings they own |
| Unauthenticated visitor | Reach login and signup only; cannot see listing data |
| System (server) | Enforce session checks and talk to Supabase with the correct keys |

The current UI still calls this person an investor (`Sample Investor` on the
profile card, “Investor dashboard” on the home page). This sprint’s actor is
the sponsor in the client story. Do not invent a second role.

## Goals for this sprint

1. Sponsors can register and log in with email and password through Supabase Auth.
2. Dashboard routes that show listings require a valid session.
3. Property listings are stored in Postgres, not mock arrays in the client.
4. Sponsors can create and read listings that belong to them.
5. Environment secrets are separated: the project URL and the anon / publishable key may be client-safe; the service-role key and other privileged secrets stay server-only.

## Out of scope (defer)

- Payment processing, document uploads, and a documents vault
- Full admin roles, multi-tenant organizations, and a custom production domain
- Social OAuth providers beyond Supabase email and password auth
- pgvector search, live portfolio balances, charts, and tax exports
- Replacing the existing portfolio, activity, deals, and profile pages beyond what listing create/read needs

## Current dashboard observations

Framework: TanStack Start + React + TypeScript at the repo root. Routes are
file-based under `src/routes/`. There is no `supabase/` folder, no
`src/lib/supabase.ts`, and no `.env.example`. `.gitignore` already ignores
`.env`.

Routes found:

| Path | File | What it does today |
| --- | --- | --- |
| `/` | `src/routes/index.tsx` | Public landing page with a link to `/dashboard` |
| `/about` | `src/routes/about.tsx` | Original starter page, not a sponsor area |
| `/dashboard` | `src/routes/dashboard/route.tsx` | Layout. Mounts `src/components/dashboard/AppShell.tsx` with the title fixed to “Overview” |
| `/dashboard` (home) | `src/routes/dashboard/index.tsx` | Metric cards with em-dash placeholders. Passes empty arrays into `PortfolioSummary` and `RecentActivity` |
| `/dashboard/portfolio` | `src/routes/dashboard/portfolio.tsx` | Renders `PortfolioTable` |
| `/dashboard/activity` | `src/routes/dashboard/activity.tsx` | Short placeholder paragraph |
| `/dashboard/deals` | `src/routes/dashboard/deals.tsx` | Renders `DealsList`. Reachable by URL. Not in the current sidebar |
| `/dashboard/profile` | `src/routes/dashboard/profile.tsx` | Renders `ProfileCard`. Reachable by URL. Not in the current sidebar |

There is no `/login` or `/signup` route.

Navigation that the live shell actually renders is `src/components/dashboard/navItems.ts`: Overview (`/dashboard`), Portfolio (`/dashboard/portfolio`), Activity (`/dashboard/activity`). `Sidebar` and `MobileNav` use that list. A second list in `src/components/layout/navConfig.ts` (Home, Portfolio, Deals, Profile) belongs to `src/components/layout/` and is not what `src/routes/dashboard/route.tsx` mounts.

Listings today are not loaded from a database:

- `src/components/dashboard/DealsList.tsx` hardcodes `mockDeals` (Harbor View Residences, Summit Logistics Hub) in the client component.
- `src/components/dashboard/PortfolioTable.tsx` hardcodes `mockHoldings`. The home page does not use those rows; it passes an empty holdings list.
- `src/components/dashboard/RecentActivity.tsx` exports `MOCK_RECENT_ACTIVITY`. The home page passes an empty list so the empty-state sentence shows.
- `src/components/dashboard/ProfileCard.tsx` defaults to `mockProfile` (`sample.investor@example.com`) and labels it “Sample profile — not a live account”.
- Sprint 2 types in `src/types/` (`InvestorListing` and related types, barrel `src/types/index.ts`) and fixtures in `src/fixtures/sample-investor-listings.ts` type-check only. No dashboard page reads them, and nothing persists them.

Auth today: `src/lib/user.ts` exports `getUser()`, which always returns `null`. Nothing establishes a session. Every dashboard path above is public.

Gaps this sprint must close: login and signup, a session-aware dashboard for listings, Postgres-backed list and create flows, and env separation with a documented `.env.example` and no committed secrets.

## Success criteria (how we know it worked)

- [ ] A sponsor can sign up and log in and is redirected to a protected dashboard.
- [ ] Logged-out users cannot open protected dashboard listing pages.
- [ ] Creating a listing persists it in Postgres and it appears after refresh.
- [ ] A sponsor only sees their own listings (row-level security is intentional).
- [ ] No service-role or other secret key appears in the client bundle or in a committed `.env`.
- [ ] `.env.example` documents required variable names without real secret values.

## Server-only boundary (must not ship to the browser)

- Supabase **service role** key (and any other privileged secrets)
- Direct privileged database URLs if used outside Supabase client helpers
- Any server-only env vars used for admin or bypass operations

Client-safe (when intentionally exposed by Supabase design):

- Project URL
- Anon / publishable key (still respect row-level security; never treat it as a secret bypass)

## Implementation notes for later prompts

- Prefer TanStack Start server loaders and actions for reads and writes that need the user session or privileged checks.
- Reuse `InvestorListing` from `src/types/index.ts` when the listings table and forms are designed. Do not invent a second listing shape beside that model unless a later decision record says a field is out of scope.
- Data model and row-level security policies will be designed in later steps. This brief only locks the product contract.
- The handoff should map deliverables back to the goals and success criteria above.
