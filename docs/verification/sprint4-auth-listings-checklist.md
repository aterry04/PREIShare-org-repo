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
| 1.2 | RLS is enabled on the listings table | NOT RUN | The Supabase Table Editor was not opened. A request with no user session returned HTTP 401, so anonymous callers are denied. That does not by itself prove the RLS toggle is on. |
| 1.3 | Policies match `docs/data-model/rls-policy-review.md` | NOT RUN | The review doc names `listings_select_own`, `listings_insert_own`, `listings_update_own`, and `listings_delete_own`. Those names were not confirmed in the live policy list. |
| 1.4 | Migration file present | PASS | `supabase/migrations/20250321000000_property_listings.sql` is in the repo. |

## 2. Authentication & session

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| 2.1 | Sponsor can sign up with email/password | FAIL | User A: `sprint4-usera-20261025@mailinator.com`. Signup stayed on `/auth/signup` and showed “Check your email to confirm the account, then log in.” No dashboard session. An earlier try with `preishare-sprint4-check@example.com` was rejected as an invalid email. |
| 2.2 | Sponsor can log in via `src/routes/auth/login.tsx` | FAIL | Same User A. After the login message was corrected, the page stayed on `/auth/login` and showed “Email not confirmed.” |
| 2.3 | Signed-out user hitting `/dashboard` or listings is redirected to login | PASS | `curl -sI` on `/dashboard` and `/dashboard/listings` both returned HTTP 307 to `/auth/login`. The browser also landed on the login page. |
| 2.4 | Sign-out clears the session | NOT RUN | No confirmed session was established, so sign-out was not tested. |

## 3. Listings happy path (User A)

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| 3.1 | Create listing via the UI succeeds | NOT RUN | Blocked by 2.2. The form is at `/dashboard/listings/new`. |
| 3.2 | New row visible on the listings index | NOT RUN | Blocked by 2.2. Route file: `src/routes/dashboard/listings/index.tsx`. |
| 3.3 | Data matches Postgres, not a mock array | NOT RUN | The list page calls `listMyListings` in `src/server/listings.ts`. No signed-in create was observed. |
| 3.4 | Create and read go through `src/server/listings.ts` | NOT RUN | Code review only. No signed-in network trace was captured. |

## 4. Row Level Security (User B)

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| 4.1 | Second account User B can sign up / log in | NOT RUN | Not started. User A never got a session. |
| 4.2 | User B cannot see User A’s listings | NOT RUN | No two signed-in sponsors were compared. |
| 4.3 | A direct read as User B shows no foreign rows | NOT RUN | Not started. |
| 4.4 | User B can create and see only their own listing | NOT RUN | Not started. |

## 5. Secret-hygiene audit

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| 5.1 | Real env files are not committed | PASS | `git check-ignore -v` matches `.env` (`.gitignore` line `.env`) and `.env.local` (`.gitignore` line `.env.*`). `git ls-files` lists `.env.example` only. |
| 5.2 | `.env.example` has placeholders only | PASS | Values are `https://your-project-ref.supabase.co`, `your-anon-or-publishable-key`, and `your-service-role-key`. |
| 5.3 | No live service-role key material in tracked source or docs | PASS | Search for `service_role` and `SUPABASE_SERVICE_ROLE_KEY` hits the variable name in `src/lib/supabase/server.ts`, the placeholder in `.env.example`, and docs. No live key string was found in those files. |
| 5.4 | Browser code uses only public env names | PASS | `src/lib/supabase/client.ts` reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Login, signup, and the listings UI do not read `SUPABASE_SERVICE_ROLE_KEY`. Compared with `docs/setup/supabase-env-checklist.md`. |
| 5.5 | Network tab does not send a service-role header | NOT RUN | No signed-in browser request was inspected in the Network tab. |

## 6. Gaps fixed this session

| Gap | Agent fix summary | Re-test result |
| --- | --- | --- |
| Login hid Supabase’s confirmation error as “Email or password is incorrect.” | `src/routes/auth/login.tsx` now shows the Supabase error message when sign-in fails. | PASS for the message. Re-test showed “Email not confirmed.” Login still does not reach the dashboard. |

## 7. Sign-off

- [ ] Client story covered: sponsors can log in; listings load from Postgres under RLS; secrets kept out of the client bundle
- [ ] All critical rows above are PASS (or FAIL accepted with written follow-up)
- [x] No real secrets written into this markdown file

**Overall:** FAIL

**Notes for handoff:**

- In the Supabase dashboard, open Authentication → Providers → Email and turn off “Confirm email” for local testing, or confirm User A from the inbox, then sign in.
- Repeat sections 2.1, 2.2, 2.4, 3, and 4 with two different emails before changing this overall result to PASS.
- Open the Table Editor and the policies panel and fill 1.2 and 1.3 from what is actually enabled.
