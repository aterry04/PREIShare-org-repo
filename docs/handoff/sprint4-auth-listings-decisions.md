# Sprint 4 Handoff — Sponsor Auth & Postgres Property Listings

**Project:** PREIshare dashboard
**Sprint:** 4 (Topic 1) — Supabase auth & database
**Audience:** Sponsors and the next-sprint implementer
**Status date:** 2026-10-25

## 1. Client story recap

PREIshare sponsors need a secure way to sign in and manage real property listings stored in PostgreSQL, not mock data in the browser. Secret keys and privileged database access stay on the server and must not ship in the client bundle.

## 2. Delivered vs original request

| Client need | Delivered? | Where / evidence |
| --- | --- | --- |
| Secure sponsor login | Yes | Email and password signup at `/auth/signup` and login at `/auth/login`. A confirmed sponsor reached `/dashboard`. Signed-out visits to `/dashboard` and `/dashboard/listings` redirect to `/auth/login`. Sign-out clears the session. See checklist sections 2.1–2.4. |
| Postgres-backed listings (create/read/display) | Yes | Table `property_listings`. Create at `/dashboard/listings/new` and read on `/dashboard/listings` go through `listMyListings` and `createListing` in `src/server/listings.ts`. A created row showed title, city, region, status, and asking price after save. Checklist sections 1.1, 1.4, and 3. |
| Row-level security so sponsors only see allowed rows | Partial | Two signed-in sponsors were compared. The second sponsor’s listings page and a direct `listMyListings` read showed only that sponsor’s row, not the other sponsor’s title (checklist 4.2–4.4). The Table Editor RLS toggle and the live policy names were not opened (checklist 1.2 and 1.3, NOT RUN). |
| Secrets kept out of the client bundle | Yes | `.env.example` has placeholders only. Real env files are gitignored. Browser code reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Signed-in listing calls stayed on the local server and did not send a service-role token. Checklist section 5. |

The verification checklist overall is PASS for login, create/read, two-sponsor isolation, and secret hygiene. It does not prove the Supabase RLS toggle is on or that the live policies are named `listings_select_own`, `listings_insert_own`, `listings_update_own`, and `listings_delete_own`. Those two checks were not run.

## 3. Architecture decisions (keep short)

- **Auth:** Supabase email and password. Protected dashboard routes require a session and send a signed-out visitor to `/auth/login`. Email confirmation is on in the project used for verification: an unconfirmed login stays on `/auth/login` and shows “Email not confirmed.”
- **Data:** PostgreSQL table `property_listings`, as specified in `docs/data-model/property-listings-schema.md`. `owner_id` is the signed-in sponsor (`auth.users`). It is not the same thing as asset ownership on the Sprint 2 listing type. Columns include title, summary, property type, address, asking price (USD), optional IRR and cap rate, status (`draft`, `published`, `under_offer`, `sold`, `archived`), and `closed_at` only when sold. Migration file: `supabase/migrations/20250321000000_property_listings.sql`.
- **Authorization:** Designed RLS lets an authenticated sponsor select, insert, update, and delete only rows where `owner_id` matches their user id. There is no public “read all published listings” policy. The service-role key bypasses RLS and is for server maintenance only.
- **Clients:** `src/lib/supabase/client.ts` is the browser client (public URL and anon key only). `src/lib/supabase/server.ts` is server-only. Listing create and read run as the signed-in user so RLS applies. The service-role key must not be renamed to a `VITE_` name and must not ship to the browser.
- **Env hygiene:** Public: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. Server-only: `SUPABASE_SERVICE_ROLE_KEY`. Optional server URL: `SUPABASE_URL`. Commit `.env.example` only. Do not commit `.env` or `.env.local`.

## 4. How to run locally (sponsor-friendly)

1. Copy `.env.example` to `.env.local` (or `.env`). Fill the names from Supabase Project Settings → API. Use the project URL, the anon or publishable key, and the service-role or secret key. Do not put real values in git, chat, or this handoff. Details: `docs/setup/supabase-env-checklist.md`.
2. Apply `supabase/migrations/20250321000000_property_listings.sql` in the Supabase SQL Editor if this database does not already have `property_listings`. Confirm row-level security is enabled and that the four own-row policies from the schema doc are present. That dashboard check was not completed in verification.
3. Install dependencies, then start the app with `npm run dev`. The verification run used http://localhost:3000. Restart the dev server after changing the env file.
4. Open `/auth/signup`, create a sponsor with a real inbox (the project rejects some fake domains), confirm the email, then log in at `/auth/login`. Open `/dashboard/listings/new`, create one listing, and confirm it appears on `/dashboard/listings` after the save. Sign out and confirm those dashboard URLs return to login.

## 5. Known limitations

- Checklist 1.2 and 1.3 were **NOT RUN**. Anonymous access was denied, and two sponsors did not see each other’s rows, but nobody opened the Table Editor or the live policy list.
- Update and delete are in the data-model design. Verification only passed create and read.
- Email confirmation is required. The built-in mailer rate-limited a second signup (“email rate limit exceeded”). The second test account was created already confirmed through the Auth admin API, then logged in through `/auth/login`.
- Portfolio, activity, deals, and profile were left as they were. This sprint did not replace them with live data. Home metrics were still placeholders when the sprint started.
- No contacts table, no asset-ownership rows, no images, no payments, no document vault, no admin roles, no multi-sponsor organization, and no public catalog of published listings.
- `summary` is required by the app for `published`, `under_offer`, and `sold`. The TypeScript model also expects contacts for those statuses. This table does not store contacts.
- No branded email templates, no password-reset flow, no approvals workflow, and no pgvector or other search. Status values exist; they are not an approve/reject process.
- The visible shell still uses the older “investor” label in places. The product actor for this sprint is the sponsor.

## 6. Recommended next-sprint work (pick with stakeholders)

Each option assumes the current login, `property_listings`, own-row access, and the server-only service-role split stay in place.

1. **Richer listing fields** — Finish edit and delete on the current table, and decide the open schema questions (contacts, enums versus text checks, hard delete versus `deleted_at`) before adding columns. Keep `owner_id` set from the session.
2. **Approvals workflow** — Add a submit and approve/reject path on top of `draft`, `published`, `under_offer`, `sold`, and `archived`. New transitions need their own RLS rules and UI. Do not open a public read-all policy unless sponsors explicitly ask for one.
3. **pgvector search** — Add similarity search only after create/read (and any new edit flow) stay behind the same auth and own-row rules. The schema already defers pgvector. Do not put the service-role key in the browser to run it.

## 7. Open questions for stakeholders

- Who may create listings, and who may only view them? This sprint allows each sponsor to create and read their own rows. Logged-out visitors get none.
- Is one owner per listing enough, or does a later sprint need shared listings or organizations? The brief deferred multi-tenant organizations. The schema does not allow two sponsors to own one row.
- Can a listing be `published`, `under_offer`, or `sold` before a contacts table exists?
- Keep hard delete plus `archived`, or add `deleted_at` later? The design chose hard delete and `ON DELETE CASCADE` when the auth user is removed.
- Preferred next theme: richer fields, approvals, or pgvector search?

## 8. Source artifacts

- `docs/requirements/sponsor-auth-and-listings-brief.md`
- `docs/verification/sprint4-auth-listings-checklist.md`
- `docs/data-model/property-listings-schema.md`
- `docs/setup/supabase-env-checklist.md`
