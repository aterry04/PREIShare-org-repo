# Sprint 4 Topic 2 Handoff — PREIshare Sponsor Auth & Protected Listings

**Date:** 2026-10-26
**Author:** Alexis Terry
**Status:** Ready to demo the signed-in list and create flow. Open items are in Known limitations.

## Client story outcomes

- A sponsor can sign in with email and password at `/login` and reach `/dashboard` with a session.
- A signed-out visitor who opens `/dashboard`, `/dashboard/properties`, or `/dashboard/properties/new` is sent to `/login` and does not see listing titles.
- A wrong password stays on `/login` and shows “Invalid login credentials”. Sign-out returns to `/login`, and those routes stay blocked.
- The property list at `/dashboard/properties` shows only rows owned by the signed-in sponsor. On 2026-10-26, Sponsor B saw “User B Ballard Works” and “User B Pike Place”. Sponsor A’s “User A Harbor Court” was not in that list.
- Creating a property at `/dashboard/properties/new` stores a Postgres row whose `owner_id` comes from the session. The form has no owner field.
- The browser client uses the public project URL and the anon key. The service-role key is read only in server code, and the property routes do not call that helper.

## Architecture decisions (why we built it this way)

- **Auth.** Supabase Auth email and password. The browser signs in. The server stores the session and checks it before the dashboard renders. No session means a redirect to `/login`.
- **Data.** Listings are `property_listings`. `owner_id` is the signed-in Auth user id (`auth.uid()`). It is who may manage the row, not who owns the building. `profiles` is display data only. A separate `sponsors` table is not required. Row-Level Security allows SELECT, INSERT, UPDATE, and DELETE only when `owner_id = auth.uid()`. INSERT and UPDATE also use `WITH CHECK`. Anonymous has no policy. There is no policy that returns every listing.
- **Clients.** `src/lib/supabase.client.ts` is safe for the browser. `src/lib/supabase.server.ts` holds two helpers: a session client (anon key plus the sponsor’s access token, so RLS still applies) and `createSupabaseServiceRoleClient` (bypasses RLS, maintenance only). List and create use the session client.
- **Env hygiene.** Names live in `.env.example` and `docs/env-var-checklist.md`. Client-safe: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. Server-only: `SUPABASE_SERVICE_ROLE_KEY` (no `VITE_` prefix) and optional `SUPABASE_URL`. Real values stay in an untracked `.env` or `.env.local`.

## Source documents (read these first)

| Doc | Path | Purpose |
| --- | --- | --- |
| Requirements | `docs/sponsor-auth-requirements.md` | Who can see and change what |
| Data model & RLS | `docs/data-model-and-rls-matrix.md` | Tables, keys, policy matrix |
| Env checklist | `docs/env-var-checklist.md` | Public vs secret vars |
| Security verification | `docs/security-verification-checklist.md` | What was tested and remaining gaps |

## Key implementation files

- `src/lib/supabase.client.ts` — browser-safe Supabase client
- `src/lib/supabase.server.ts` — server-only Supabase client
- `src/routes/login.tsx` — sponsor login
- `src/routes/dashboard.tsx` — session-aware dashboard shell
- `src/routes/dashboard/properties.tsx` — protected property list
- `src/routes/dashboard/properties.new.tsx` — create under RLS
- `supabase/migrations/20250321000000_sponsors_properties_rls.sql` — schema and RLS for `profiles` and `property_listings`

## Known limitations

Copied from `docs/security-verification-checklist.md`. Sections 1–5 were pass on 2026-10-26. These leftovers are still open:

- An UPDATE or DELETE of another sponsor’s listing id was not sent. List isolation was tested. A write to a known foreign id was not.
- The zero-row empty state was not on screen, because Sponsor B already had listings.
- A Postgres policy-rejection message was not provoked in the create form. Empty required fields were blocked in the browser before the request.
- The Supabase Table Editor was not opened, so the live RLS toggle and policy names were not read there. Behavior was checked through the app.
- `createSupabaseServiceRoleClient` remains in server code. These routes do not call it. A later change could.
- Email confirmation is on. A second in-app signup previously hit the mail rate limit.
- After the first successful create, the list showed the new row on a full reload. `router.invalidate()` was added so the next navigation refreshes the list. That second create was not re-run.
- The create form collects the fields needed for a draft row. Optional matrix columns such as projected IRR and cap rate are not on that form.
- Sponsor invites, a shared organization, admin moderation, a public catalog, password reset, OAuth, and multi-factor auth are out of scope.
- CI secret injection is not set up. Production deploys still need the same server-only rule for `SUPABASE_SERVICE_ROLE_KEY`.

## Recommended next work (next topic / sprint)

1. Richer property listing fields and validation for the optional columns already in `docs/data-model-and-rls-matrix.md`.
2. A sponsor invite or role model if more than one person should manage the same listings.
3. CI secret injection so deploy pipelines receive `SUPABASE_SERVICE_ROLE_KEY` at run time and never from the repository.
4. Automated tests that sign in as two sponsors and prove sponsor A cannot read or update sponsor B’s rows, including a write to a known foreign id.

## Handoff checklist for the next learner

- [ ] Read the four source docs above before changing auth or RLS.
- [ ] Confirm the local env file matches the names in `.env.example`. Do not commit real secret values.
- [ ] Re-run `docs/security-verification-checklist.md` after any policy or client change.
- [ ] Keep service-role usage inside `src/lib/supabase.server.ts`, and keep property list and create on the session client.
