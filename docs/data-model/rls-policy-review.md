# RLS policy review — property_listings

## Migration file

- Path: `supabase/migrations/20250321000000_property_listings.sql`
- What it creates: `public.property_listings`, indexes on `owner_id` and `status`, an `updated_at` trigger, row-level security, and four own-row policies
- What it does not contain: API keys, the service-role key, or application TypeScript

## How to apply

Run this once against the PREIshare Supabase project (the project that has `auth.users`). A blank Postgres install without the Supabase `auth` schema will fail on the `owner_id` foreign key.

1. Open the Supabase dashboard for the PREIshare project.
2. Go to **SQL Editor → New query**.
3. Paste the full contents of `supabase/migrations/20250321000000_property_listings.sql`.
4. Run it and confirm success.
5. Open **Table Editor → property_listings**.
6. Confirm the columns match the design doc and that **RLS enabled** is on.
7. In **Authentication → Policies** (or the table’s policies panel), confirm these four policies: `listings_select_own`, `listings_insert_own`, `listings_update_own`, `listings_delete_own`.

The script drops those four policies before creating them, so running it again replaces the policies. `create table if not exists` will not change a table that already exists. If the first run failed halfway, drop `public.property_listings` in the SQL editor and run the file again. Do not turn RLS off to “see rows.” An empty table before login is expected.

## Policies (plain language)

RLS is enabled. The `anon` role has no policies and no table privileges, so a logged-out request cannot read or write listings.

| Policy | Operation | Who | Rule |
| --- | --- | --- | --- |
| `listings_select_own` | SELECT | authenticated | `USING`: `owner_id = auth.uid()` |
| `listings_insert_own` | INSERT | authenticated | `WITH CHECK`: `owner_id = auth.uid()` |
| `listings_update_own` | UPDATE | authenticated | `USING` and `WITH CHECK`: `owner_id = auth.uid()` |
| `listings_delete_own` | DELETE | authenticated | `USING`: `owner_id = auth.uid()` |

`WITH CHECK` on insert and update rejects a row whose `owner_id` is not the signed-in user. That blocks assigning a new listing to someone else and blocks changing `owner_id` on update.

`authenticated` is granted select, insert, update, and delete. Those grants are not enough on their own: RLS still filters each row. There is no `GRANT ALL` to `anon` or `public`, and no `USING (true)` policy.

## Alignment with design doc

Source: `docs/data-model/property-listings-schema.md`.

- Columns match: yes. Includes `owner_id`, `summary`, `property_type`, address fields, `asking_price`, `currency`, optional IRR and cap rate, the five statuses, and `closed_at`.
- `owner_id` references `auth.users(id)` with `ON DELETE CASCADE`.
- `status` is `text` plus a check constraint, not a Postgres enum. Allowed values are `draft`, `published`, `under_offer`, `sold`, `archived`.
- `closed_at` is required when `status` is `sold` and must be null otherwise.
- `summary` stays nullable in the database. The design says the app, not this migration, requires it for `published`, `under_offer`, and `sold`.
- Missing policies: none of the four own-row commands.
- Overly open grants: none.

## Risks and open questions

- The service role bypasses RLS. This file does not grant the service-role key to the browser. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only.
- Other sponsors cannot read `published` listings. The brief does not ask for a public read policy. Do not add `USING (true)` later to make the table look populated.
- Contacts and asset-ownership lists are still out of scope. A `published` row can exist here without the contact the TypeScript type requires.
- Hard delete is allowed for the owner. `archived` remains the non-delete hide path.
- `ON DELETE CASCADE` removes listing rows when the auth user is deleted.

## Sign-off

- Reviewed by: Alexis Terry
- Date: 2026-10-25
