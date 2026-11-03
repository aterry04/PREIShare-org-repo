-- Enable pgvector so PostgreSQL can store and compare embedding vectors.
-- Safe to re-run: IF NOT EXISTS skips the work when the extension is already on.
create extension if not exists vector;

-- This migration owns the listing identity and the text that will be embedded.
-- id is the primary key. title and summary are text. summary is the description.
-- Do not add a second description column or a table named properties.
-- embedding is one nullable vector per listing. Dimension matches
-- docs/embedding-data-model.md: vector(DIMENSION_TODO).
-- A null embedding is allowed until seed or backfill. No ivfflat index here:
-- a small demo compares rows one by one, and the index needs a numeric dimension.
create extension if not exists pgcrypto;

create table if not exists public.property_listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  embedding vector(DIMENSION_TODO)
);

comment on column public.property_listings.embedding is
  'pgvector embedding of title plus summary. Type vector(DIMENSION_TODO). Nullable until backfill. Rank later with cosine distance <=> (smaller is closer).';
