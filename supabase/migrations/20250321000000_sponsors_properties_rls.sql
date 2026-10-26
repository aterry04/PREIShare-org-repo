-- supabase/migrations/20250321000000_sponsors_properties_rls.sql
-- Implements docs/data-model-and-rls-matrix.md only.
-- No secrets. The service-role key is not in this file and is not granted here.
--
-- Review against the matrix:
-- [x] RLS enabled on profiles and property_listings
-- [x] No USING (true) on sponsor or listing data
-- [x] INSERT and UPDATE policies include WITH CHECK tied to auth.uid()
-- [x] profiles has no DELETE policy
-- [x] anon has no policy and no grant
-- [x] property_listings.owner_id references auth.users(id)

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.property_listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  summary text,
  property_type text not null
    check (property_type in (
      'multifamily',
      'office',
      'retail',
      'industrial',
      'mixed_use',
      'land'
    )),
  address_line1 text not null,
  address_line2 text,
  city text not null,
  region text not null,
  postal_code text not null,
  country text not null default 'US',
  asking_price numeric(14, 2) not null check (asking_price >= 0),
  currency text not null default 'USD' check (currency = 'USD'),
  projected_irr_percent numeric(6, 2),
  cap_rate_percent numeric(6, 2),
  status text not null default 'draft'
    check (status in (
      'draft',
      'published',
      'under_offer',
      'sold',
      'archived'
    )),
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint property_listings_closed_at_sold check (
    (status = 'sold' and closed_at is not null)
    or (status <> 'sold' and closed_at is null)
  )
);

create index if not exists property_listings_owner_id_idx
  on public.property_listings (owner_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists property_listings_set_updated_at on public.property_listings;
create trigger property_listings_set_updated_at
before update on public.property_listings
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.property_listings enable row level security;

revoke all on table public.profiles from anon, public;
revoke all on table public.property_listings from anon, public;

grant select, insert, update on table public.profiles to authenticated;
grant select, insert, update, delete on table public.property_listings to authenticated;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles
  for insert
  to authenticated
  with check (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "property_listings_select_own" on public.property_listings;
create policy "property_listings_select_own"
  on public.property_listings
  for select
  to authenticated
  using (owner_id = auth.uid());

drop policy if exists "property_listings_insert_own" on public.property_listings;
create policy "property_listings_insert_own"
  on public.property_listings
  for insert
  to authenticated
  with check (owner_id = auth.uid());

drop policy if exists "property_listings_update_own" on public.property_listings;
create policy "property_listings_update_own"
  on public.property_listings
  for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "property_listings_delete_own" on public.property_listings;
create policy "property_listings_delete_own"
  on public.property_listings
  for delete
  to authenticated
  using (owner_id = auth.uid());
