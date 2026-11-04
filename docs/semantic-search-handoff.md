# PREIshare semantic search — handoff

## 1. Client story recap

PREIshare helps a property buyer find an investment by describing how they want to live and earn. A sentence such as “quiet cabin near water with good rental upside” can miss a lakeside cottage whose write-up talks about a still shore and short stays and never uses those exact words. This tutorial built a beginner slice of semantic search: listing text becomes an embedding (a fixed list of numbers that stands for meaning), PostgreSQL stores that list with pgvector, and a search ranks the closest listings first. The slice is a demo a teammate can explain. It is a small path through sample listings, and the live project has not stored those vectors yet (`docs/semantic-search-verification.md`).

Actors, from `docs/semantic-search-requirements.md`: the buyer types everyday intent and expects the closest match first; the operator runs the demo and explains a rank; sponsor accounts that already manage listings stay as they are.

## 2. Stakeholder goals ↔ deliverables

| Stakeholder goal | What we delivered | Where to look |
| --- | --- | --- |
| Search by meaning, using the same text recipe for every listing | App-side embedding helper. Input is title, a blank line, then `summary`. | `src/lib/embeddings/`, `docs/embedding-data-model.md` |
| Keep vectors on the existing listing row | pgvector plan and SQL for nullable `property_listings.embedding` as `vector(1536)`. The table stays `property_listings`. The description column stays `summary`. | `docs/pgvector-setup-plan.md`, `supabase/migrations/20250315000000_enable_pgvector_properties.sql` |
| Return a ranked list for the demo queries | `match_properties` SQL plus a TypeScript helper. Default top-K is 5. | `supabase/migrations/20250315000001_match_properties_function.sql`, `src/lib/property-search.ts` |
| Let a stakeholder type a query | POST API and a simple search page. Empty input is rejected in the page and as HTTP 400. | `src/routes/api/properties/search.ts`, `src/routes/search.tsx` |
| Show the sample set the four buyer queries need | Eight sample listings in JSON and an idempotent seed script. Verification records that this project has not loaded them yet. | `data/sample-properties.json`, `scripts/seed-property-embeddings.ts`, `docs/semantic-search-verification.md` |

## 3. Architectural decisions (record what you actually chose)

Filled from `docs/embedding-data-model.md`, `docs/pgvector-setup-plan.md`, and `docs/semantic-search-verification.md`.

- **What text is embedded:** `{title}`, a blank line, then `{summary}`. `summary` is the description. Do not add a `description` column. `id`, `owner_id`, `city`, and `asking_price` stay out of the vector. A buyer query is embedded as its own string. The helper sends the query text with an empty title so the stored recipe still applies.
- **Embedding dimensions:** 1536. Model: `text-embedding-3-small`. The column type, the TypeScript constant, and the SQL function argument use that same length.
- **Distance / similarity metric:** pgvector cosine distance, operator `<=>`. A smaller distance is closer. The function sorts by that distance (closest first) and returns `similarity` as `1 - distance`, so a larger similarity is a better match. Rows with a null embedding are left out.
- **Top-K / match count:** 5. The SQL default is 5, and the helper clamps the count between 1 and 50.
- **Where embeddings are created:** in the app, in `src/lib/embeddings/generate.ts`, using `EMBEDDING_API_KEY` on the server. PostgreSQL stores the numbers. It does not call the embedding provider.
- **Seed / backfill path:** `scripts/seed-property-embeddings.ts` reads `data/sample-properties.json` (8 listings, stable ids) and upserts `property_listings`. It needs `SEED_OWNER_ID` (an existing Auth user id) and `EMBEDDING_API_KEY`. On 2026-11-04 the script stopped before any write because `SEED_OWNER_ID` was unset.
- **Index:** none for this demo. The plan compares the small sample row by row. An ivfflat index is later work.
- **Who can read matches:** `match_properties` is `SECURITY INVOKER`. The helper uses the service-role client so the demo can read seeded rows. That is separate from a signed-in sponsor reading only their own listings.

## 4. In scope vs out of scope (this tutorial)

**In scope (files in this slice)**

- Requirements, learner notes, data model, and pgvector setup plan
- SQL for the `vector` extension, `embedding vector(1536)`, and `match_properties`
- TypeScript that builds an embedding and ranks with that function
- Sample JSON plus a seed script
- A minimal API and the `/search` page
- This handoff and `docs/semantic-search-verification.md`

**In the repo, and still not true on project `twvlvorheamrmrfktcgi`**

- Sample rows with non-null embeddings. The live table had 4 other listings and no `embedding` column when verification ran.
- A ranked answer for the cabin, schools, downtown, or farmland queries. Each returned HTTP 500 and an empty list.

**Out of scope (left for later)**

- Production embedding billing, rate limits, and large batch jobs
- Map search, price or bedroom filters, payments, and messaging
- New authentication, or changes to sponsor login and who may read or edit a listing
- Hybrid keyword plus vector ranking, personalized ranking, and business-rule ranking
- Automatic re-embed when a listing is edited
- A vector index, a large evaluation set, and a CI job that calls the embedding provider
- Visual polish and a separate mobile app

## 5. Demo limitations (be honest)

From `docs/semantic-search-verification.md` (tested 2026-11-04 by Alexis Terry). Ready to demo: no.

- The live database has no `embedding` column and no `match_properties` function. The SQL files are in the repo and were not applied on this project.
- `EMBEDDING_API_KEY` and `SEED_OWNER_ID` were unset. No embedding request succeeded. The seed wrote nothing.
- The four requirement queries and the paraphrase `peaceful shore cottage where summer guests pay for short stays` returned no titles and no similarity scores. Neighbor quality is unknown. Semantic search did not beat keyword matching in this run, because there was no neighbor list.
- Empty input is safe: the page says “Type a description of the property you want,” and `{}` returns HTTP 400. A nonsense token (`zzz`) and a one-letter query (`a`) returned HTTP 500 “Search failed.” The page stayed up.
- The intended keyword-trap listing, Still Shore Cottage, exists only in `data/sample-properties.json`. Its summary omits “cabin,” “quiet,” and “upside.” That miss was not shown on the page.
- Eight hand-written samples are the whole catalog for this slice. There is no claim about latency, cost, or the full PREIshare inventory.
- The page shows a similarity number and the listing text. It does not explain the match beyond that score.
- Ranking code was left as written (`<=>` ascending, similarity `1 - distance`, top 5). A keyword fallback was rejected because it would hide the missing vectors.

## 6. How to re-run the demo (handoff checklist)

1. On project `twvlvorheamrmrfktcgi`, apply `supabase/migrations/20250315000000_enable_pgvector_properties.sql`, then `supabase/migrations/20250315000001_match_properties_function.sql`, then the later listing migration if the sponsor columns are still missing. Confirm `embedding` is `vector(1536)`.
2. In `.env.local`, set `EMBEDDING_API_KEY`, optional `EMBEDDING_MODEL` (`text-embedding-3-small`), and `SEED_OWNER_ID` to an existing Auth user id. Keep `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` server-only. Do not commit those values.
3. From the repo root, run `npx tsx scripts/seed-property-embeddings.ts`. Confirm 8 sample rows and a null embedding count of 0.
4. Start the app (`npm run dev`) and open `/search`. Try the four queries in `docs/semantic-search-requirements.md`, plus one paraphrase that does not copy the cottage’s exact words.
5. Write the real top titles into `docs/semantic-search-verification.md`. The 2026-11-04 rows are failures, and they stay failures until this checklist is done.

## 7. Next actions for later Sprint 5 work

1. **Finish the demo path first.** Apply the two embedding migrations, set `EMBEDDING_API_KEY` and `SEED_OWNER_ID`, run the seed, and replace the NO rows in `docs/semantic-search-verification.md` with the actual top titles for the four requirement queries.
2. **Filters + vector search.** Add optional max `asking_price` and `property_type` arguments to `match_properties` and to `POST /api/properties/search`, applied in the same query that orders by `<=>`. Leave `city` and price out of the embedding text.
3. **Hybrid search.** Add a keyword or full-text signal beside the vector distance, and write down the merge rule (for example a weighted sum) in one short note so later code uses the same rule.
4. **Re-embed on update.** When `title` or `summary` changes, call `generatePropertyEmbedding` with the same title-plus-summary recipe and store the new `vector(1536)`. Add a backfill that fills rows whose embedding is null, and skips rows whose text has not changed.
5. **Grow the evaluation set.** Add more sample listings and a fixed list of queries with an expected top title for each, including the farmland control, and run that list after every ranking change.
6. **CI considerations.** In CI, run `npm run typecheck` and a migration SQL check. Keep live embedding calls and the service-role seed out of CI so a pull request does not spend provider credit or require a secret key.
7. **Observability.** Log the query length, the HTTP status, the latency, and the top similarity scores on the server. Keep the raw query out of client error bodies, matching the current “Search failed” response that does not echo secrets.

## 8. Open questions for mentor / next owner

- Is `text-embedding-3-small` at 1536 the production lock, or only the tutorial choice? Changing either value means re-embedding every stored row.
- Should PREIshare keep cosine distance (`<=>`) everywhere, with similarity shown as `1 - distance`?
- Who owns the embedding cost budget and rotation of `EMBEDDING_API_KEY`?
- For the next stakeholder demo, which filter comes first: max asking price, or property type?
- Should search keep using the service-role client, or should a signed-in buyer read published listings under row-level security?

## 9. Sources used for this handoff

- `docs/semantic-search-requirements.md`
- `docs/embedding-data-model.md`
- `docs/pgvector-setup-plan.md`
- `docs/semantic-search-verification.md`
