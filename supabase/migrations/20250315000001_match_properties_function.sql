-- Rank property_listings by cosine distance from a query embedding.
-- <=> is cosine distance: smaller means closer in meaning.
-- similarity is 1 - that distance, so a higher similarity is a better match.
-- Order by the distance itself so the closest row is first.
-- This file runs right after 20250315000000, so it uses only id, title, summary, and embedding.
-- summary is the description. Null embeddings are left out.

create or replace function public.match_properties(
  query_embedding vector(1536),
  match_count int default 5
)
returns table (
  id uuid,
  title text,
  description text,
  similarity float
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    p.id,
    p.title,
    p.summary as description,
    (1 - (p.embedding <=> query_embedding))::float as similarity
  from public.property_listings p
  where p.embedding is not null
  order by p.embedding <=> query_embedding
  limit least(greatest(coalesce(match_count, 5), 1), 50);
$$;

revoke all on function public.match_properties(vector(1536), int) from public;
revoke all on function public.match_properties(vector(1536), int) from anon;
grant execute on function public.match_properties(vector(1536), int) to authenticated;
grant execute on function public.match_properties(vector(1536), int) to service_role;
