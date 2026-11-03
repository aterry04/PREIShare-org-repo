# PREIshare pgvector setup plan

## Purpose

Enable semantic property search storage in Supabase PostgreSQL with pgvector, aligned with `docs/embedding-data-model.md`. This plan is the contract for the SQL migration step. It does not add a search page or generate embeddings.

## Source of truth

- Data model: `docs/embedding-data-model.md`
- Table: `property_listings` (already exists; do not create a second table named `properties`)
- Description text: `summary` (do not add a `description` column)
- Embedding column: `embedding`
- Embedding dimension: `DIMENSION_TODO`
- Ranking style for the demo: cosine distance with pgvector `<=>` (a smaller number is a closer match)

`property_listings` already has `id`, `title`, `summary`, `city`, `asking_price`, `created_at`, `owner_id`, and the other listing columns from `docs/data-model-and-rls-matrix.md`. `supabase/migrations/20250315000000_enable_pgvector_properties.sql` runs first. It enables `vector` and creates `property_listings` with `id`, `title`, `summary`, and `embedding vector(DIMENSION_TODO)`. `supabase/migrations/20250321000000_property_listings.sql` then adds the remaining sponsor columns when that early table is already present.

## Migration goals (what “done” means)

1. The `vector` extension (pgvector) is installed.
2. `property_listings.embedding` exists as a nullable `vector(DIMENSION_TODO)`.
3. A row may keep `embedding` null until a later seed or backfill fills it.
4. One column, one length. No second embedding column and no other dimension.
5. Verification queries show the extension, the column shape, and that a null vector is allowed.
6. A similarity search function is a later step. This migration stores the column so that function can be written next.

## Safe migration order (must not be reordered)

| Order | Step | Why this order |
| --- | --- | --- |
| 1 | Enable extension `vector` (pgvector) | The `vector` type and the `<=>` operator do not exist until the extension is on. |
| 2 | Add nullable `embedding vector(DIMENSION_TODO)` to the existing `property_listings` table | The column type depends on the extension. The table already exists, so this is an alter, not a new listings table. |
| 3 | Skip the vector index for this demo | An index can be created only after the column exists. A handful of sample rows can be compared one by one. |
| 4 | Run the verification queries | Confirm the schema before any seed or app code. |

Do not create the vector column before enabling the extension. Do not invent a second dimension or a second embedding column name. Do not replace `summary` with the vector.

## Similarity approach (beginner demo)

- **Choice:** later search SQL uses pgvector cosine distance, operator `<=>`, on `property_listings.embedding`.
- **How to read the score:** `<=>` returns a distance. Smaller means closer in meaning. Sort ascending. Do not sort it as if a larger number were a better match.
- **Why:** the data model plans a cosine-style comparison of text embeddings. `<=>` is the pgvector operator for that comparison.
- **Tradeoff:** checking every sample row is enough for this tutorial and keeps the SQL easy to explain. An approximate index matters when the table is large. It is extra setup this demo does not need.

The canonical text that will be embedded later is still `title`, a blank line, then `summary`. This migration does not build that string. It only reserves the column the numbers will land in.

## Index recommendation

- **Demo scale (a small sample set):** no vector index. Sequential comparison is acceptable.
- **If a later change adds an index:** create it only after `embedding` exists, only for rows that already have a vector, and only with the operator class that matches `<=>` and `vector(DIMENSION_TODO)`. Do not add that index in the first pgvector migration.

## Environment values (names only)

Real values stay in the local env file and the Supabase dashboard. This plan does not contain them.

- `VITE_SUPABASE_URL` — public project URL
- `SUPABASE_URL` — optional server-side project URL
- `VITE_SUPABASE_ANON_KEY` — public anon key; it does not bypass row rules
- `SUPABASE_SERVICE_ROLE_KEY` — server-only key for trusted maintenance; never put it in browser code or in this file
- A direct database connection string, if the Supabase CLI applies migrations — server-only, not a `VITE_` name

Turning on pgvector does not need an embedding-provider key. The provider and its key name are still open in the data model. That key is for a later generation step, and it stays server-only when it is chosen.

## Verification queries (run in the Supabase SQL editor after the migration)

1. Show that extension `vector` is installed.
2. Show that `property_listings.embedding` is a `vector` of length `DIMENSION_TODO`.
3. Show that a null `embedding` is allowed on an existing or temporary row, then remove any temporary row.
4. Compare two short literal vectors with `<=>` to prove the operator works. That smoke test can use a tiny length such as 3. It does not change the column length. The column stays `vector(DIMENSION_TODO)`.

```sql
-- 1) extension present
select extname from pg_extension where extname = 'vector';

-- 2) column shape
select column_name, udt_name
from information_schema.columns
where table_name = 'property_listings'
  and column_name = 'embedding';

-- 4) operator smoke test only; not the listing column's length
-- select '[1,2,3]'::vector(3) <=> '[1,2,4]'::vector(3) as distance;
```

Check 3 is an update or insert that sets `embedding` to null and then selects that row. Do not leave a junk listing behind.

## Out of scope for this migration plan

- Generating real embeddings or seeding sample vectors
- A search API route or React search page
- A `match_properties` function
- A new `properties` table or a `description` column
- Changes to sponsor login, `owner_id`, or existing row-level security
- A vector index, hybrid keyword plus vector ranking, filters, or re-ranking
- Choosing the embedding vendor or replacing `DIMENSION_TODO` with a number (that happens in one pass across the data model, this plan, the migration, and the TypeScript types)

## Handoff to the next step

The migration implements ordered steps 1 and 2 only: enable `vector`, then add nullable `property_listings.embedding` as `vector(DIMENSION_TODO)`. It does not add an index. It must not rename the table, add a second vector column, or pick a dimension other than `DIMENSION_TODO`.
