-- Enable pgvector so PostgreSQL can store and compare embedding vectors.
-- Safe to re-run: IF NOT EXISTS skips the work when the extension is already on.
-- This file does not create a second listings table. The properties resource is
-- public.property_listings (see docs/embedding-data-model.md).
create extension if not exists vector;

-- The listings table is created in 20250321000000_property_listings.sql.
-- This tutorial filename is earlier in sort order, so the alter runs only when
-- that table is already present (SQL editor, or a database that already has it).
-- Primary key stays property_listings.id. title (text) and summary (text) stay
-- as they are. summary is the description. Do not add a description column.
-- embedding is one nullable vector per listing. Logical type: vector(DIMENSION_TODO).
-- No model size has been chosen, so the column is an unconstrained vector until
-- DIMENSION_TODO is replaced in the data model, this file, and the TypeScript
-- module together. Do not store two different lengths in this column.
-- A null embedding is allowed until seed or backfill. Rows with a null vector
-- are not searchable. No vector index in this file: a small demo can compare
-- rows one by one, and an ivfflat index waits until rows and a fixed dimension exist.
do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'property_listings'
  ) then
    alter table public.property_listings
      add column if not exists embedding vector;

    comment on column public.property_listings.embedding is
      'pgvector embedding of title plus summary. Logical type vector(DIMENSION_TODO). Nullable until backfill. Rank later with cosine distance <=> (smaller is closer).';
  end if;
end $$;
