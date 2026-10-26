# PREIshare — Data model and RLS policy matrix

## Purpose

Design-only blueprint for sponsor auth and property listings. No SQL in this file. The migration step must follow this document. Do not add tables or open policies here without updating this file first.

## Source requirements

Consumed from: `docs/sponsor-auth-requirements.md`

Listings are one collection: `property_listings`. That table is the properties resource. `owner_id` is who may manage the row. It is not who owns the building.

## Actors and identities

| Actor | How identity is established | Notes |
| --- | --- | --- |
| Anonymous visitor | No Supabase session | Must not read or write properties |
| Sponsor (authenticated) | Supabase Auth user. `auth.uid()` is their user id | May manage only rows they own |
| Service role / server admin tasks | `SUPABASE_SERVICE_ROLE_KEY` on the server only | Bypasses RLS. Never used from the browser |

Login for this topic is email and password. Admin, public catalog, and team ownership are out of scope.

## Tables

### `profiles` (sponsor linkage)

Links a Supabase Auth user to sponsor display data. The id is the same value as `auth.uid()`. Listing ownership does not depend on this row. `property_listings.owner_id` points at `auth.users.id`.

| Column | Type (intent) | Required | Notes |
| --- | --- | --- | --- |
| id | uuid (PK, = auth.users.id) | yes | Same value as `auth.uid()` after signup or login |
| display_name | text | yes | Shown in dashboard chrome |
| created_at | timestamptz | yes | Default now() |

### `property_listings` (properties owned by a sponsor)

| Column | Type (intent) | Required | Notes |
| --- | --- | --- | --- |
| id | uuid (PK) | yes | Generated default |
| owner_id | uuid (FK → auth.users.id) | yes | RLS hinge. Policies compare it to `auth.uid()` |
| title | text | yes | Card title |
| summary | text | no | Longer copy. Required by the app when status is `published`, `under_offer`, or `sold` |
| property_type | text | yes | `multifamily`, `office`, `retail`, `industrial`, `mixed_use`, or `land` |
| address_line1 | text | yes | Street |
| address_line2 | text | no | Unit or suite |
| city | text | yes | Card location |
| region | text | yes | State or province |
| postal_code | text | yes | |
| country | text | yes | Default `US` |
| asking_price | numeric | yes | Must be >= 0 |
| currency | text | yes | `USD` only this topic |
| projected_irr_percent | numeric | no | |
| cap_rate_percent | numeric | no | |
| status | text | yes | `draft`, `published`, `under_offer`, `sold`, or `archived` |
| closed_at | timestamptz | no | Set only when status is `sold` |
| created_at | timestamptz | yes | Default now() |
| updated_at | timestamptz | yes | Set again on change |

## RLS posture

- Enable RLS on `profiles` and `property_listings` before the API is trusted.
- No policy uses “any logged-in user” or `USING (true)` on `property_listings`.
- Anonymous gets no policy and no grant on either table.
- Browser clients use the anon key plus the sponsor session. They never use the service-role key.
- A known listing id is not enough. SELECT, UPDATE, and DELETE still require `owner_id = auth.uid()`.
- INSERT must check the new row, not only the caller’s login. The app sets `owner_id` from the session. The browser cannot send a different owner.

## RLS policy matrix

| Table | Operation | Who | Rule (plain English) | Intended SQL shape (for the migration step) |
| --- | --- | --- | --- | --- |
| profiles | SELECT | Authenticated sponsor | Read own profile only | `id = auth.uid()` |
| profiles | INSERT | Authenticated sponsor | Create own profile row only | `WITH CHECK (id = auth.uid())` |
| profiles | UPDATE | Authenticated sponsor | Update own profile only | `USING (id = auth.uid())` and `WITH CHECK (id = auth.uid())` |
| profiles | DELETE | Authenticated sponsor | Not allowed this topic | No policy |
| property_listings | SELECT | Authenticated sponsor | Read only properties they own | `owner_id = auth.uid()` |
| property_listings | INSERT | Authenticated sponsor | Insert only when they are the owner | `WITH CHECK (owner_id = auth.uid())` |
| property_listings | UPDATE | Authenticated sponsor | Update only owned rows, and the row must stay theirs | `USING (owner_id = auth.uid())` and `WITH CHECK (owner_id = auth.uid())` |
| property_listings | DELETE | Authenticated sponsor | Delete only owned rows | `owner_id = auth.uid()` |
| property_listings | SELECT, INSERT, UPDATE, DELETE | Anonymous | No access | No policy for `anon` |
| profiles | SELECT, INSERT, UPDATE, DELETE | Anonymous | No access | No policy for `anon` |

There is no SELECT policy that returns every published listing.

## Requirement → design mapping

| Requirement (from sponsor-auth-requirements) | Satisfied by |
| --- | --- |
| Sponsors sign in with email and password before managing listings | Supabase Auth session. `auth.uid()` is the sponsor id. Anonymous has no policy on `property_listings` |
| A signed-out visitor cannot open the dashboard or see listing rows | No anon policy. The app also redirects `/dashboard` and listing routes to login |
| Sign-out clears the session | Session cookie is cleared. The next call has no `auth.uid()`, so RLS returns no rows |
| A sponsor sees only their properties | `property_listings` SELECT: `owner_id = auth.uid()` |
| A second sponsor does not see the first sponsor’s rows | Same SELECT rule. Sponsor B’s `auth.uid()` does not match sponsor A’s `owner_id` |
| A sponsor can create a property they own, even if the form sends no owner id | INSERT `WITH CHECK (owner_id = auth.uid())`. The server sets `owner_id` from the session |
| The browser cannot assign the row to someone else | INSERT and UPDATE `WITH CHECK` reject a different `owner_id` |
| Guessing a property id still cannot read or edit it | SELECT, UPDATE, and DELETE all require `owner_id = auth.uid()` |
| Hiding buttons is not the control | These policies are on the table. The UI is not the rule |
| Listing cards can show a title, place, status, and time | `title`, `city`, `status`, `created_at` on `property_listings` |
| Secrets stay off the client | Browser uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` only. `SUPABASE_SERVICE_ROLE_KEY` is server-only and is not an RLS role for the UI |
| A separate sponsors table is not required to own a listing | `owner_id` references `auth.users.id`. `profiles` is display data only |

## Out of scope this sprint

- Public read of published listings
- Anonymous create, update, or delete
- Admin console and cross-sponsor moderation
- More than one sponsor owning one property
- Asset-ownership rows, contacts, images, payments, document uploads
- pgvector search and an approvals workflow
- Password reset, OAuth, and multi-factor auth
- Using the service-role key from the browser

## Open questions for review

- [ ] Confirm sponsors may hard-delete their own rows. `status = archived` can hide a listing without deleting it. This matrix still allows DELETE of owned rows.
- [ ] Confirm whether the `profiles` row is created by a signup trigger or by the app on first login. List and create still work if that row is missing, because `owner_id` points at `auth.users`.

## Ready for the migration step when

- [ ] Every sponsor-facing action in the requirements maps to a matrix row
- [ ] `owner_id` exists on `property_listings` and is compared to `auth.uid()`
- [ ] No policy grants every authenticated user access to every property
