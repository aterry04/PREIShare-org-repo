-- supabase/migrations/20250321000000_property_listings.sql
-- Implements docs/data-model/property-listings-schema.md.
-- No secrets. Service-role access is not granted to anon or public.

create extension if not exists "pgcrypto";

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

-- 20250315000000 may already have created id, title, summary, and embedding.
-- CREATE TABLE IF NOT EXISTS then does nothing, so add the sponsor columns here.
alter table public.property_listings
  add column if not exists owner_id uuid references auth.users (id) on delete cascade,
  add column if not exists property_type text,
  add column if not exists address_line1 text,
  add column if not exists address_line2 text,
  add column if not exists city text,
  add column if not exists region text,
  add column if not exists postal_code text,
  add column if not exists country text default 'US',
  add column if not exists asking_price numeric(14, 2),
  add column if not exists currency text default 'USD',
  add column if not exists projected_irr_percent numeric(6, 2),
  add column if not exists cap_rate_percent numeric(6, 2),
  add column if not exists status text default 'draft',
  add column if not exists closed_at timestamptz,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now(),
  add column if not exists embedding vector(DIMENSION_TODO);

-- The early table does not include these checks. Skip them when CREATE TABLE already added them.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'property_listings_property_type_check'
  ) then
    alter table public.property_listings
      add constraint property_listings_property_type_check
      check (property_type in (
        'multifamily', 'office', 'retail', 'industrial', 'mixed_use', 'land'
      ));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'property_listings_asking_price_check'
  ) then
    alter table public.property_listings
      add constraint property_listings_asking_price_check
      check (asking_price >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'property_listings_currency_check'
  ) then
    alter table public.property_listings
      add constraint property_listings_currency_check
      check (currency = 'USD');
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'property_listings_status_check'
  ) then
    alter table public.property_listings
      add constraint property_listings_status_check
      check (status in ('draft', 'published', 'under_offer', 'sold', 'archived'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'property_listings_closed_at_sold'
  ) then
    alter table public.property_listings
      add constraint property_listings_closed_at_sold
      check (
        (status = 'sold' and closed_at is not null)
        or (status <> 'sold' and closed_at is null)
      );
  end if;
end $$;

alter table public.property_listings
  alter column owner_id set not null,
  alter column property_type set not null,
  alter column address_line1 set not null,
  alter column city set not null,
  alter column region set not null,
  alter column postal_code set not null,
  alter column country set not null,
  alter column asking_price set not null,
  alter column currency set not null,
  alter column status set not null,
  alter column created_at set not null,
  alter column updated_at set not null;

create index if not exists property_listings_owner_id_idx
  on public.property_listings (owner_id);

create index if not exists property_listings_status_idx
  on public.property_listings (status);

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

alter table public.property_listings enable row level security;

revoke all on table public.property_listings from anon, public;
grant select, insert, update, delete on table public.property_listings to authenticated;

drop policy if exists "listings_select_own" on public.property_listings;
create policy "listings_select_own"
  on public.property_listings
  for select
  to authenticated
  using (owner_id = auth.uid());

drop policy if exists "listings_insert_own" on public.property_listings;
create policy "listings_insert_own"
  on public.property_listings
  for insert
  to authenticated
  with check (owner_id = auth.uid());

drop policy if exists "listings_update_own" on public.property_listings;
create policy "listings_update_own"
  on public.property_listings
  for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "listings_delete_own" on public.property_listings;
create policy "listings_delete_own"
  on public.property_listings
  for delete
  to authenticated
  using (owner_id = auth.uid());
