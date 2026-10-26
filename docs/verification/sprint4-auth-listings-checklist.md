# Sprint 4 — Auth & Listings Verification Checklist

**Project:** PREIshare dashboard
**Date:** 2026-10-25
**Verifier:** Alexis Terry
**Environment:** local dev (`npm run dev`, http://localhost:3000) + Supabase project ref `twvlvorheamrmrfktcgi`. No secrets are written here.

## How to use this doc

A row is **PASS** only when that check was run in this session. **NOT RUN** means it was not observed. **FAIL** means it was tried and did not meet the check.

---

## 1. Database & migration

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| 1.1 | `property_listings` exists in Supabase | PASS | A server request to `/rest/v1/property_listings?select=id&limit=1` returned HTTP 200 and one row. The key value was not recorded. |
| 1.2 | RLS is enabled on the listings table | NOT RUN | The Supabase Table Editor was not opened. A request with no user session returned HTTP 401, so anonymous callers are denied. That does not by itself prove the RLS toggle is on. Section 4 is the behavioral check. |
| 1.3 | Policies match `docs/data-model/rls-policy-review.md` | NOT RUN | The review doc names `listings_select_own`, `listings_insert_own`, `listings_update_own`, and `listings_delete_own`. Those names were not confirmed in the live policy list. |
| 1.4 | Migration file present | PASS | `supabase/migrations/20250321000000_property_listings.sql` is in the repo. |

## 2. Authentication & session

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| 2.1 | Sponsor can sign up with email/password | PASS | User A: `sprint4-usera-20261025@mailinator.com`. Signup stayed on `/auth/signup` and showed “Check your email to confirm the account, then log in.” The confirm message in that inbox was opened. An earlier try with `preishare-sprint4-check@example.com` was rejected as an invalid email. |
| 2.2 | Sponsor can log in via `src/routes/auth/login.tsx` | PASS | After User A was confirmed, login left `/auth/login` and landed on `/dashboard`. Before confirmation, the same form stayed on `/auth/login` and showed “Email not confirmed.” |
| 2.3 | Signed-out user hitting `/dashboard` or listings is redirected to login | PASS | `curl -sI` on `/dashboard` and `/dashboard/listings` both returned HTTP 307 to `/auth/login`. After sign-out, the browser did the same. |
| 2.4 | Sign-out clears the session | PASS | Signed in as User A on `/dashboard/listings` (the Harbor Court card was on screen). Sign out navigated to `/auth/login` and that card was gone. Opening `/dashboard` and `/dashboard/listings` again both landed on `/auth/login` with no listing data. |

## 3. Listings happy path (User A)

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| 3.1 | Create listing via the UI succeeds | PASS | Signed in as User A. Submitted `/dashboard/listings/new` with title “User A Harbor Court”, Seattle, WA, 98101, asking price 2500000, status draft. The button showed “Saving…”, then the app navigated to `/dashboard/listings`. |
| 3.2 | New row visible on the listings index | PASS | `/dashboard/listings` showed “User A Harbor Court”, “Seattle, WA”, “Status: draft”, and “$2,500,000”. Route file: `src/routes/dashboard/listings/index.tsx`. |
| 3.3 | Data matches Postgres, not a mock array | PASS | The index was empty of this title until the form submit. The following read came from `listMyListings` in `src/server/listings.ts`. The page is not the Sprint 2 fixture list. |
| 3.4 | Create and read go through `src/server/listings.ts` | PASS | While signed in, the create and the list both requested `http://localhost:3000/_serverFn/...` for `src/server/listings.ts` (`createListing` and `listMyListings`). No listings call went to a mock module. |

## 4. Row Level Security (User B)

User B email: `sprint4-userb-20261025@mailinator.com`.

The in-app signup form returned “email rate limit exceeded” after User A’s confirmation mail. The second account was then created already confirmed through the Auth admin API (the key was not recorded). Login used `/auth/login`.

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| 4.1 | Second account User B can sign up / log in | PASS | Distinct email `sprint4-userb-20261025@mailinator.com`. Login left `/auth/login` and landed on `/dashboard`. |
| 4.2 | User B cannot see User A’s listings | PASS | Signed in as User B, `/dashboard/listings` first showed “No properties yet. Add your first listing to get started.” It did not show “User A Harbor Court”. After User B created “User B Pike Place”, the page showed that title only. “Harbor Court” was not on the page. |
| 4.3 | A direct read as User B shows no foreign rows | PASS | With User B’s session, `GET` `listMyListings` (`src/server/listings.ts`) returned HTTP 200. The response body contained the title “User B Pike Place” and did not contain “Harbor Court”. |
| 4.4 | User B can create and see only their own listing | PASS | User B submitted `/dashboard/listings/new` with title “User B Pike Place”, Seattle, WA, asking price 1800000, status draft. The index then showed “User B Pike Place” and not “User A Harbor Court”. The same direct read returned only “User B Pike Place”. |

## 5. Secret-hygiene audit

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| 5.1 | Real env files are not committed | PASS | `git check-ignore -v` matches `.env` (`.gitignore` line `.env`) and `.env.local` (`.gitignore` line `.env.*`). `git ls-files` lists `.env.example` only. |
| 5.2 | `.env.example` has placeholders only | PASS | Values are `https://your-project-ref.supabase.co`, `your-anon-or-publishable-key`, and `your-service-role-key`. |
| 5.3 | No live service-role key material in tracked source or docs | PASS | Search for `service_role` and `SUPABASE_SERVICE_ROLE_KEY` hits the variable name in `src/lib/supabase/server.ts`, the placeholder in `.env.example`, and docs. No live key string was found in those files. |
| 5.4 | Browser code uses only public env names | PASS | `src/lib/supabase/client.ts` reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Login, signup, and the listings UI do not read `SUPABASE_SERVICE_ROLE_KEY`. Compared with `docs/setup/supabase-env-checklist.md`. |
| 5.5 | Network tab does not send a service-role header | PASS | Signed in as User A, create and list resources were only `http://localhost:3000/_serverFn/...` for `src/server/listings.ts`. Signed in as User B, the create and list fetches used host `localhost:3000`, path `/_serverFn/...`, and header names `accept`, `content-type`, and `x-tsr-serverfn`. None of those header values was a `service_role` token. No listings request host was `supabase.co`. Header and cookie values were not copied into this file. |

## 6. Gaps fixed this session

| Gap | Agent fix summary | Re-test result |
| --- | --- | --- |
| Login hid Supabase’s confirmation error as “Email or password is incorrect.” | `src/routes/auth/login.tsx` now shows the Supabase error message when sign-in fails. | PASS. Before confirmation the form showed “Email not confirmed.” After confirmation, login reached `/dashboard`. |
| Section 4 had no second user, so foreign-row isolation was NOT RUN. | Confirmed User A, created User B, and re-ran sections 2.4, 3, 4, and 5.5 with a live session. | PASS. User B’s UI and `listMyListings` response omitted “User A Harbor Court”. |

## 7. Sign-off

- [x] Client story covered: sponsors can log in; listings load from Postgres under RLS; secrets kept out of the client bundle
- [x] Critical rows 2.4, 3, 4.2, 4.3, and 5.5 are PASS
- [x] No real secrets written into this markdown file

**Overall:** PASS

**Notes for handoff:**

- Rows 1.2 and 1.3 stay NOT RUN. The Table Editor and the live policy list were not opened. Section 4 is the isolation evidence that was re-tested.
- User B’s in-app signup hit “email rate limit exceeded”. The account used above was created already confirmed through the Auth admin API, then logged in through `/auth/login`.
- Passwords, access tokens, and key values are not in this file.
