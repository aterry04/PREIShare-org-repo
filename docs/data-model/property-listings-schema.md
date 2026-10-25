# Property Listings Data Model & Auth Boundaries

> Sprint 4 design doc for PREIshare. Source of truth for migrations and row-level security.
> Inputs: `docs/requirements/sponsor-auth-and-listings-brief.md`,
> `docs/setup/supabase-env-checklist.md`, and `src/types/investor-listing.ts`.
> This file is a blueprint. It is not a SQL migration.

## 1. Purpose

Sponsors sign in and manage real property listings stored in Postgres.
Listings are not mock arrays in the browser. The service-role key never ships to the client.

A sponsor can create a listing and read the listings they own. Logged-out visitors get no listing rows. Field names follow `InvestorListing` in `src/types/index.ts`. This doc adds one column that type does not have: `owner_id`, the signed-in sponsor.

Two different “owners” stay separate:

- `owner_id` is the Supabase Auth user who created the row.
- `InvestorListing.ownership` is who owns the real estate asset (broker, co-owner, and so on). That list is out of scope for this table.

## 2. Entity: `property_listings`

One table. Nested TypeScript objects become columns. Names are `snake_case` in Postgres and match the existing camelCase fields.

| Column | Type (Postgres) | Nullable | Maps to | Notes |
| --- | --- | --- | --- | --- |
| `id` | `uuid` | no | `id` | Primary key. Default `gen_random_uuid()`. |
| `owner_id` | `uuid` | no | (new) | Foreign key to `auth.users(id)`. The sponsor who owns the row. |
| `title` | `text` | no | `title` | Short display name. |
| `summary` | `text` | yes | `summary` | Longer listing copy. The field inventory calls this description. |
| `property_type` | `text` | no | `propertyType` | One of `multifamily`, `office`, `retail`, `industrial`, `mixed_use`, `land`. |
| `address_line1` | `text` | no | `address.line1` | Street address. |
| `address_line2` | `text` | yes | `address.line2` | Unit or suite. |
| `city` | `text` | no | `address.city` | |
| `region` | `text` | no | `address.region` | State or province. Required on `Address`. |
| `postal_code` | `text` | no | `address.postalCode` | Required on `Address`. |
| `country` | `text` | no | `address.country` | Default `'US'`. |
| `asking_price` | `numeric(14,2)` | no | `financials.askingPrice` | Listing price. Must be >= 0. |
| `currency` | `text` | no | `financials.currency` | Default `'USD'`. Only `USD` in this sprint. |
| `projected_irr_percent` | `numeric(6,2)` | yes | `financials.projectedIrrPercent` | Optional. |
| `cap_rate_percent` | `numeric(6,2)` | yes | `financials.capRatePercent` | Optional. |
| `status` | `text` | no | `status` | One of `draft`, `published`, `under_offer`, `sold`, `archived`. Not `active` or `closed`. |
| `closed_at` | `timestamptz` | yes | `closedAt` | Required only when `status` is `sold`. Must be empty otherwise. |
| `created_at` | `timestamptz` | no | `createdAt` | Default `now()`. |
| `updated_at` | `timestamptz` | no | `updatedAt` | Default `now()`. Set again on update. |

`summary` may be empty while `status` is `draft` or `archived`. The field inventory requires it for `published`, `under_offer`, and `sold`. The app checks that. This sprint does not store contacts, so that extra published-listing rule waits (see open questions).

### Indexes (recommended)

- Primary key on `id`
- Index on `owner_id` for “my listings”
- Index on `status` if the dashboard filters by status

### Out of scope for this sprint

- Contact rows and `primaryContactId`
- Asset-ownership rows (`InvestorListing.ownership`)
- Images or other media
- Full-text search and pgvector
- More than one sponsor owning the same row
- Payments, document uploads, and admin roles

## 3. Ownership model

- Every listing row must set `owner_id` to the Supabase Auth user id of the sponsor who created it.
- `owner_id` references `auth.users(id)` with `ON DELETE CASCADE`. If that auth user is removed, their listing rows are removed too.
- Insert and update must set `owner_id` from the signed-in session. The browser does not get to choose another user’s id.
- `status = archived` is the in-table way to hide a listing without deleting the auth user.

## 4. Proposed Row Level Security (RLS) — plain language

Enable RLS on `property_listings`. With no policy, nobody can read or change a row.

| Policy name (suggested) | Command | Who | Rule |
| --- | --- | --- | --- |
| `listings_select_own` | SELECT | authenticated | `owner_id = auth.uid()` |
| `listings_insert_own` | INSERT | authenticated | `WITH CHECK`: `owner_id = auth.uid()` |
| `listings_update_own` | UPDATE | authenticated | `USING` and `WITH CHECK`: `owner_id = auth.uid()` |
| `listings_delete_own` | DELETE | authenticated | `owner_id = auth.uid()` |

Notes:

- Logged-out (anon) users get no listing access in this sprint.
- Do not add a public “read all published listings” policy. The requirements brief does not ask for one.
- The service-role key bypasses RLS. It stays on the server for maintenance only. Browser code never imports it. The env name is `SUPABASE_SERVICE_ROLE_KEY`, not a `VITE_` name.

## 5. Server vs browser operation map

| Operation | Runs where | Client type | Notes |
| --- | --- | --- | --- |
| Sign up / sign in / sign out | Browser + Supabase Auth | Browser anon key (`VITE_SUPABASE_ANON_KEY`) plus the user session | No service-role key |
| Session check for protected routes | Server loader | Server Supabase client with the user session | Redirect to login if there is no session |
| List my listings | Server loader | Server client as the user. RLS applies | UI receives that user’s rows only |
| Create listing | Server action | Server client as the user. `owner_id` comes from the session | Validate fields on the server |
| Update listing | Server action | Server client as the user | RLS blocks edits to someone else’s row |
| Delete listing | Server action | Server client as the user | Same own-row rule |
| Admin or maintenance jobs | Server only | Service-role key | Out of scope for the sponsor UI. Never import into the client bundle |

### Environment boundary reminder

- Browser-safe: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` only.
- Server-only: `SUPABASE_SERVICE_ROLE_KEY`. Optional server URL: `SUPABASE_URL`.
- See `docs/setup/supabase-env-checklist.md`.

## 6. Acceptance checks for the next (migration) step

- [ ] Table `property_listings` matches the column list above
- [ ] `owner_id` is a required foreign key to `auth.users`
- [ ] `status` allows only `draft`, `published`, `under_offer`, `sold`, `archived`
- [ ] RLS is enabled with own-row SELECT, INSERT, UPDATE, and DELETE policies
- [ ] No policy grants world-readable access
- [ ] SQL lives in a migration file, not only in unrecorded dashboard clicks

## 7. Open questions (resolve before or during migration)

- Can a row be `published`, `under_offer`, or `sold` before a contacts table exists? The TypeScript type requires at least one contact for those statuses. This sprint’s table has no contacts.
- Should `status` and `property_type` be Postgres enums, or `text` plus a check constraint? Either way the allowed strings stay the lists above.
- Is hard DELETE enough, or do sponsors need `deleted_at` later? This sprint uses hard DELETE plus `archived`.
- Should removing an auth user cascade-delete listings (`ON DELETE CASCADE`, chosen above) or be blocked until listings are removed (`ON DELETE RESTRICT`)?
