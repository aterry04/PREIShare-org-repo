# Semantic search verification report (PREIshare)

## Scope checked

- Requirements source: `docs/semantic-search-requirements.md`
- UI: `src/routes/search.tsx`
- API: `src/routes/api/properties/search.ts`
- Search helper: `src/lib/property-search.ts`
- Seed inputs: `data/sample-properties.json`, `scripts/seed-property-embeddings.ts`

## Environment

- Date tested: 2026-11-04
- Supabase project (name or ref only, no secrets): `twvlvorheamrmrfktcgi`
- App run method (e.g. local dev server): local dev server at `http://localhost:3000`
- Embedding model / dimension expected: `text-embedding-3-small`, 1536 numbers, cosine distance (`<=>`, smaller is closer; similarity is `1 - distance`)

`EMBEDDING_API_KEY` and `SEED_OWNER_ID` were not set in `.env.local` during this check. No embedding request succeeded.

## Data checks

| Check | Result | Notes |
| --- | --- | --- |
| Sample properties present | FAIL | Live `property_listings` row count: 4. Titles: Property 1, User A Harbor Court, User B Pike Place, User B Ballard Works. None of the 8 titles in `data/sample-properties.json` are in that list. |
| Embeddings non-null for all samples | FAIL | Selecting `embedding` returned: `column property_listings.embedding does not exist`. Null count could not be taken because the column is not in the live table. `match_properties` is also missing: `Could not find the function public.match_properties(match_count, query_embedding) in the schema cache`. |
| Seed script re-runnable without breaking search | FAIL | `npx tsx scripts/seed-property-embeddings.ts` exited before any write with: `Set SEED_OWNER_ID to an existing Supabase Auth user id before seeding.` The 4 existing rows were left as they were. Search still cannot rank until the column, the function, the API key, and a real owner id are in place. |

## Query results (semantic)

Each query was sent as `POST /api/properties/search` with `{ "query": "..." }`. The cabin query was also submitted on `/search`. No query returned titles or similarity scores.

| # | Query | Top 3 results (title or id) | Sensible neighbors? | Notes |
| --- | --- | --- | --- | --- |
| 1 | quiet cabin near water with good rental upside | none | NO | API HTTP 500 `{"error":"Search failed","results":[]}`. UI showed the alert “Search failed” after the button read “Searching…”. |
| 2 | family-friendly home close to good schools | none | NO | API HTTP 500, same body. |
| 3 | downtown condo walkable to restaurants | none | NO | API HTTP 500, same body. |
| 4 | large irrigated farmland for crop production | none | NO | Control. API HTTP 500, same body. No ranking to compare a farm against a cabin or condo. |

## Keyword-trap check

- Trap query (paraphrase, not exact listing text): `peaceful shore cottage where summer guests pay for short stays`
- Expected kind of property: Still Shore Cottage (water, short stays). That listing is only in the seed file; it is not in the live table.
- Actual top results: none. API HTTP 500 `{"error":"Search failed","results":[]}`.
- Did semantic search beat exact-keyword matching? NO
- Evidence (one sentence): The search never returned a neighbor list, so a paraphrase could not be compared with an exact-word search.

## Safety / edge cases

| Case | Expected | Actual | PASS / FAIL |
| --- | --- | --- | --- |
| Empty query | Clear error or empty list, no crash | UI alert: “Type a description of the property you want.” API `{}` returned HTTP 400 `{"error":"Query is required","results":[]}`. | PASS |
| Nonsense tokens | Low similarity or empty, no crash | Query `zzz` returned HTTP 500 `{"error":"Search failed","results":[]}`. The server answered JSON and the page stayed up. | FAIL |
| Very short query | Stable response | Query `a` returned HTTP 500 `{"error":"Search failed","results":[]}`. | FAIL |

## Refine cycle (required)

- Failing or weak example (query + bad ranking or error): Query `quiet cabin near water with good rental upside`. Expected neighbor: Still Shore Cottage. Actual: no titles. API and UI both say search failed (HTTP 500).
- Suspected layer (seed data / embedding text / SQL distance / helper / API / UI): Seed data and the live database. The helper asks for an embedding, then calls `match_properties`. The provider key is unset, the `embedding` column is not on the live table, and `match_properties` is not in the schema cache. The sample JSON and the SQL files exist in the repo; they were not applied to this project.
- Change made (files touched): No ranking code change. A keyword fallback or a one-query boost would hide this failure and would not create vectors. This report is the only file added for the cycle.
- Re-test result: After the seed script failed again on the missing owner id, the cabin query was sent once more. HTTP 500 and the UI alert “Search failed” were unchanged. Empty submit still shows the local alert and does not call the API.
- Keep or revert decision: Keep the current search helper and SQL (`<=>` ascending, similarity `1 - distance`, null embeddings excluded, top 5). Those choices were not the failure. Do not add a special case for the cabin sentence.

## Requirements traceability

| Requirement / success criterion | Met? | Evidence |
| --- | --- | --- |
| A small set of sample properties is loaded, each with description text and a stored embedding vector | NO | 8 sample rows are in `data/sample-properties.json` only. Live table has 4 other listings and no `embedding` column. |
| Submitting one of the example queries returns a ranked list with the closest meaning first | NO | All four requirement queries returned HTTP 500 and an empty `results` array. |
| For query 1, a waterfront or lakeside sample appears in the top results even though at least one of “cabin,” “quiet,” or “upside” is missing from that listing’s text | NO | Still Shore Cottage never appeared. Its summary omits “cabin,” “quiet,” and “upside,” but the row is not stored. |
| A tester can point at that listing and say which query words are missing, which is why keyword search would skip it | PARTIAL | The seed text for Still Shore Cottage can be pointed at on paper. The live search did not return the listing, so the demo did not show the miss. |
| For the farmland control, a cabin, school-neighborhood house, or downtown apartment is not shown as the strong match | NO | The farmland query returned no ranked list, so the control was not observed. |
| The same embedding size and the same similarity measure are used when vectors are stored and when they are searched | PARTIAL | Code, data model, and SQL agree on 1536 and cosine distance. Nothing was stored or searched, so the live path did not prove it. |
| Later code and docs stay inside the in-scope list | YES | This check did not add maps, filters, auth changes, payments, or a production embedding job. |

## Remaining limitations (honest handoff)

- What this tutorial slice does **not** do yet (filters, auth, production embedding jobs, etc.): Price, bedroom, and map filters are absent. Sponsor login and row policies were not changed. There is no production embedding job, no ivfflat index, and no hybrid keyword-plus-vector rank. The search helper uses the service-role client so a demo can read seeded rows; that is not the same as a signed-in sponsor query.
- Known ranking weaknesses on the sample set: Ranking quality is unknown. No similarity score was returned for any query, so neighbor order cannot be judged.
- Follow-ups for the next topic: Apply `supabase/migrations/20250315000000_enable_pgvector_properties.sql` and `supabase/migrations/20250315000001_match_properties_function.sql` on project `twvlvorheamrmrfktcgi` if those objects are still missing. Set `EMBEDDING_API_KEY` and `SEED_OWNER_ID` (an existing Auth user id) in `.env.local`, then run `npx tsx scripts/seed-property-embeddings.ts`. Re-run the four requirement queries and the paraphrase, and replace the NO rows above with the real top titles.

## Sign-off

- Verified by: Alexis Terry
- Ready to demo to a stakeholder? NO
- Blockers before demo: The live database has no `embedding` column and no `match_properties` function. The seed did not insert the sample listings because `SEED_OWNER_ID` is unset, and `EMBEDDING_API_KEY` is unset, so a query cannot become a vector. Until those are done, `/search` can only show the empty-query message or “Search failed.”
