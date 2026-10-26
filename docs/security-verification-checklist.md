# Security verification checklist — PREIshare sponsor auth & properties

**Date:** 2026-10-26
**Verifier:** Alexis Terry
**Build / branch:** `main` at `0fe286a` (local app on http://localhost:3000)
**Related docs:** docs/sponsor-auth-requirements.md, docs/env-var-checklist.md, docs/data-model-and-rls-matrix.md

Status values: `pass` | `fail` | `not-run`

Two test sponsors were used. Sponsor A created “User A Harbor Court”. Sponsor B (`sprint4-userb-20261025@mailinator.com`) created “User B Pike Place” and “User B Ballard Works”. No passwords or key values are written here.

---

## 1. Environment and secret hygiene

| # | Check | How you verified | Status | Notes |
| --- | --- | --- | --- | --- |
| 1.1 | Browser-safe client (`src/lib/supabase.client.ts`) uses only public URL + anon key | Opened the file. It reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` and calls `createClient`. A search of that file for `SERVICE_ROLE`, `service_role`, and `SUPABASE_SERVICE_ROLE_KEY` had no matches. | pass | |
| 1.2 | Service-role / secret key used only in server module (`src/lib/supabase.server.ts`) or never used in this topic | `createSupabaseServiceRoleClient` reads `SUPABASE_SERVICE_ROLE_KEY`. Listing and create routes call `createSupabaseServerClient(accessToken)`, which uses `VITE_SUPABASE_ANON_KEY` plus the session token. A search of `src/routes` found no `SUPABASE_SERVICE_ROLE_KEY`, `service_role`, or `createSupabaseServiceRoleClient`. | pass | The service-role helper exists for server maintenance. These routes do not call it. |
| 1.3 | No raw secrets committed in source or checklist | `git check-ignore -v` ignores `.env` and `.env.local`. `git ls-files` lists `.env.example` only. This file has no key values. | pass | |
| 1.4 | `.env.example` documents required vars without real values | Compared with `docs/env-var-checklist.md`. Placeholders are `https://your-project-ref.supabase.co`, `your-anon-or-publishable-key`, and `your-service-role-key`. The service-role name has no `VITE_` prefix. | pass | |

**Section result:** pass

---

## 2. Login and session-aware routing

| # | Check | How you verified | Status | Notes |
| --- | --- | --- | --- | --- |
| 2.1 | Unauthenticated visit to dashboard (or properties) redirects or blocks access | `curl -sI` on `/dashboard`, `/dashboard/properties`, and `/dashboard/properties/new` each returned HTTP 307 to `/login`. After sign-out, opening `/dashboard/properties` in the browser landed on the sign-in form and did not show listing titles. | pass | |
| 2.2 | Valid sponsor credentials reach an authenticated dashboard session | Signed in as Sponsor B through `src/routes/login.tsx`. The browser landed on `/dashboard` and showed that sponsor’s email. | pass | |
| 2.3 | Invalid credentials do not grant dashboard access | Wrong password on `/login` stayed on `/login` and showed “Invalid login credentials”. | pass | |
| 2.4 | Logout clears session; protected routes no longer load data as that user | Sign out from `/dashboard/properties` went to `/login` and the listing titles were gone. Opening `/dashboard/properties` again stayed on `/login`. | pass | |

**Section result:** pass

---

## 3. Property list isolation (RLS)

| # | Check | How you verified | Status | Notes |
| --- | --- | --- | --- | --- |
| 3.1 | Signed-in sponsor sees property list UI from `src/routes/dashboard/properties.tsx` | Signed in as Sponsor B and opened `/dashboard/properties`. The heading “Your properties” and the Add property link rendered. | pass | |
| 3.2 | List shows only rows owned by the current sponsor (per docs/data-model-and-rls-matrix.md) | Sponsor B’s list showed “User B Ballard Works” and “User B Pike Place”, both Seattle, status draft. It did not show Sponsor A’s “User A Harbor Court”. | pass | The page query uses the session server client. It does not filter the list in React. |
| 3.3 | Empty state is safe (no error that leaks other tenants’ data) | The list Sponsor B saw contained only that sponsor’s titles. No error text included another sponsor’s data. | pass | The zero-row empty copy was not on screen because this sponsor already had rows. |

**Section result:** pass

---

## 4. Property create under RLS

| # | Check | How you verified | Status | Notes |
| --- | --- | --- | --- | --- |
| 4.1 | Create form on `src/routes/dashboard/properties.new.tsx` requires an authenticated session | Signed out, `curl -sI http://localhost:3000/dashboard/properties/new` returned HTTP 307 to `/login`. Signed in, the form rendered. | pass | |
| 4.2 | Successful create inserts a row owned by the current sponsor | Sponsor B submitted “User B Ballard Works”, Seattle, WA. A fresh load of `/dashboard/properties` showed that title. Sponsor A’s title was still absent. The form has no owner field. The server sets `owner_id` from `getUser` on the session client. | pass | |
| 4.3 | Create failure (validation or RLS) does not expose secret keys or raw DB internals in the UI | Submitting the form with required fields empty stayed on `/dashboard/properties/new`. The browser focused Title. No success navigation and no key material appeared. | pass | An insert that Postgres rejects with a policy error was not forced in the browser. The code returns that error and does not navigate. |

**Section result:** pass

---

## 5. Cross-sponsor access attempt

| # | Check | How you verified | Status | Notes |
| --- | --- | --- | --- | --- |
| 5.1 | Sponsor B cannot list Sponsor A’s properties in the UI | Compared the two sponsors’ known titles. Sponsor B’s `/dashboard/properties` list had Ballard Works and Pike Place only. Harbor Court was not listed. | pass | |
| 5.2 | Direct read/update of another sponsor’s row is denied by RLS (UI and/or Supabase policy behavior) | The list above is the result of the server query as Sponsor B, not a React filter. Harbor Court was absent from that result. | pass | An UPDATE or DELETE aimed at Sponsor A’s row id was not sent. See residual risks. |

**Section result:** pass

---

## 6. Gaps found and fixes applied

| Gap (checklist #) | What was wrong | Fix applied (files) | Re-test status |
| --- | --- | --- | --- |
| 4.2 | After a successful create, returning to the list reused the cached loader, so the new title was missing until a full reload. | `src/routes/dashboard/properties.new.tsx` calls `router.invalidate()` before navigating back. | not-run for a second create. A full reload after the first create showed “User B Ballard Works”. |

No security check in sections 1–5 failed on this pass.

---

## 7. Residual risks (honest leftovers)

- An UPDATE or DELETE of another sponsor’s listing id was not sent. List isolation was tested. A write to a known foreign id was not.
- The zero-row empty state was not on screen for Sponsor B, because that account already had listings.
- A Postgres policy-rejection message was not provoked in the create form. Empty required fields were blocked before the request.
- The Supabase Table Editor was not opened, so the live RLS toggle and policy names were not read from the dashboard. Behavior was checked through the app.
- `createSupabaseServiceRoleClient` remains in server code. These routes do not call it. A later change could.
- Email confirmation is still on. A second in-app signup previously hit the mail rate limit.

---

## 8. Stakeholder verdict

**Ready to show stakeholders?** yes

**Summary:**

I signed in as Sponsor B, saw only that sponsor’s properties, created “User B Ballard Works”, and saw it on a fresh load of the list. Sponsor A’s “User A Harbor Court” was not in Sponsor B’s list. A wrong password stayed on `/login` with “Invalid login credentials”. Sign-out returned to `/login`, and `/dashboard`, `/dashboard/properties`, and `/dashboard/properties/new` redirect there with no session. `src/lib/supabase.client.ts` reads only the public URL and anon key. The service-role key is read only in `src/lib/supabase.server.ts`, and the property routes use the session client instead. An update or delete of another sponsor’s row id was not tested.

**Sign-off:** Alexis Terry, 2026-10-26
