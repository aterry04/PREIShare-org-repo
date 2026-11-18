# Semantic search verification report (PREIshare)

## Scope checked

- Requirements source: `docs/semantic-search-requirements.md`
- UI: `src/routes/search.tsx`
- API: `src/routes/api/properties/search.ts`
- Search helper: `src/lib/property-search.ts`
- Seed inputs: `data/sample-properties.json`, `scripts/seed-property-embeddings.ts`

## Environment

- Date tested: 2026-11-18
- Supabase project (name or ref only, no secrets): `twvlvorheamrmrfktcgi`
- App run method (e.g. local dev server): search helper `searchPropertiesByText` (the function the API calls). The local dev server was not running.
- Embedding model / dimension expected: `gemini-embedding-001`, 1536 numbers, cosine distance (`<=>`, smaller is closer; similarity is `1 - distance`)

The seed and these queries used `EMBEDDING_API_KEY` from `.env.local`. The provider is Google’s free embedding model, not OpenAI.

## Data checks

| Check | Result | Notes |
| --- | --- | --- |
| Sample properties present | PASS | 12 rows in `property_listings`. The 8 sample titles from `data/sample-properties.json` are present. Four older listings remain: Property 1, User A Harbor Court, User B Pike Place, User B Ballard Works. |
| Embeddings non-null for all samples | PASS | 8 rows have an embedding. Null count: 4, and those are the older listings, not the samples. `match_properties` leaves null embeddings out. |
| Seed script re-runnable without breaking search | PASS | `npx tsx scripts/seed-property-embeddings.ts` seeded all 8 listings at 1536 numbers, then the queries below returned ranked titles. |

## Query results (semantic)

Each query was run through `searchPropertiesByText`. Scores are similarity (`1 - cosine distance`). Higher is closer.

| # | Query | Top 3 results (title or id) | Sensible neighbors? | Notes |
| --- | --- | --- | --- | --- |
| 1 | quiet cabin near water with good rental upside | Dock House with Guest Bookings (0.663); Still Shore Cottage (0.591); Irrigated Crop Parcel (0.552) | YES | The first two are water plus short stays or guest income. The cottage summary never says “cabin,” “quiet,” or “upside.” |
| 2 | family-friendly home close to good schools | Lincoln Cul-de-sac House (0.702); Dock House with Guest Bookings (0.594); Cafe Street Flat (0.587) | YES | Lincoln Cul-de-sac House is first. Its text names Lincoln Elementary and a fenced yard, and does not say “family-friendly” or “good schools.” |
| 3 | downtown condo walkable to restaurants | Cafe Street Flat (0.636); Midnight Venue Loft (0.627); Weekday Office Floor (0.605) | YES | Cafe Street Flat is first. It says a flat above a cafe street, not “condo” or “walkable.” |
| 4 | large irrigated farmland for crop production | Irrigated Crop Parcel (0.829); Loading Dock Warehouse (0.529); Dock House with Guest Bookings (0.523) | YES | The farm is the strong match. The cabin, the school house, and the cafe flat are not. |

## Keyword-trap check

- Trap query (paraphrase, not exact listing text): `peaceful lakeside place where visitors rent for a few nights`
- Expected kind of property: a waterfront place with guest stays. Still Shore Cottage never says “peaceful,” “lakeside,” “visitors,” “rent,” or “nights.”
- Actual top results: Dock House with Guest Bookings (0.691); Still Shore Cottage (0.674); Irrigated Crop Parcel (0.585)
- Did semantic search beat exact-keyword matching? YES
- Evidence (one sentence): Still Shore Cottage ranked second even though that paraphrase does not use the cottage’s words, while an exact-word search would have skipped it.

## Safety / edge cases

| Case | Expected | Actual | PASS / FAIL |
| --- | --- | --- | --- |
| Empty query | Clear error or empty list, no crash | Helper returned no rows. Earlier UI check: alert “Type a description of the property you want.” API `{}` returned HTTP 400. | PASS |
| Nonsense tokens | Low similarity or empty, no crash | Query `zzz` returned Weekday Office Floor (0.558), Still Shore Cottage (0.533), Midnight Venue Loft (0.515). No crash. A tiny sample still has a nearest row. | PASS |
| Very short query | Stable response | Query `a` returned Weekday Office Floor (0.551), Irrigated Crop Parcel (0.542), Still Shore Cottage (0.538). No crash. | PASS |

## Refine cycle (required)

- Failing or weak example (query + bad ranking or error): On 2026-11-04 every query returned HTTP 500 because the column and `match_properties` were missing. On 2026-11-18 the seed then failed with `PROVIDER_ERROR` HTTP 429 from OpenAI before any row was written.
- Suspected layer (seed data / embedding text / SQL distance / helper / API / UI): Embedding provider. The SQL distance and the helper were already correct. OpenAI rejected the key for lack of quota.
- Change made (files touched): `src/lib/embeddings/generate.ts` now calls `gemini-embedding-001` and asks for 1536 numbers. The seed script, SQL function, and search helper were not changed. Docs that named the old model were updated to the same name.
- Re-test result: The seed stored 8 embeddings. The cabin query returns Dock House with Guest Bookings, then Still Shore Cottage. The schools, downtown, and farmland queries each put the expected listing first.
- Keep or revert decision: Keep the Gemini provider and the existing rank (`<=>` ascending, similarity `1 - distance`, top 5). Do not add a boost to force the cottage into first place. The dock house is also a water-and-guest-income listing, so second place for the cottage is a sensible order.

## Requirements traceability

| Requirement / success criterion | Met? | Evidence |
| --- | --- | --- |
| A small set of sample properties is loaded, each with description text and a stored embedding vector | YES | 8 sample rows, each with a 1536-number embedding. |
| Submitting one of the example queries returns a ranked list with the closest meaning first | YES | All four requirement queries returned ordered titles and similarity scores. |
| For query 1, a waterfront or lakeside sample appears in the top results even though at least one of “cabin,” “quiet,” or “upside” is missing from that listing’s text | YES | Dock House with Guest Bookings and Still Shore Cottage are the top two. The cottage text omits those three words. |
| A tester can point at that listing and say which query words are missing, which is why keyword search would skip it | YES | Still Shore Cottage does not contain “cabin,” “quiet,” or “upside.” |
| For the farmland control, a cabin, school-neighborhood house, or downtown apartment is not shown as the strong match | YES | Irrigated Crop Parcel is first at 0.829. The next score is 0.529. |
| The same embedding size and the same similarity measure are used when vectors are stored and when they are searched | YES | Seed and search both use 1536 numbers from `gemini-embedding-001`. Ranking uses cosine distance. |
| Later code and docs stay inside the in-scope list | YES | This pass did not add maps, filters, auth changes, payments, or a production embedding job. |

## Remaining limitations (honest handoff)

- What this tutorial slice does **not** do yet (filters, auth, production embedding jobs, etc.): Price, bedroom, and map filters are absent. Sponsor login and row policies were not changed. There is no production embedding job and no ivfflat index. The search helper uses the service-role client so the demo can read seeded rows.
- Known ranking weaknesses on the sample set: For the cabin query, Dock House with Guest Bookings ranks above Still Shore Cottage. Both are water-and-stay listings. Nonsense and one-letter queries still return the nearest sample instead of an empty list. Four older listings have null embeddings and never appear.
- Follow-ups for the next topic: Put the same `EMBEDDING_API_KEY` on Vercel and deploy the Gemini generator before judging the live site. Filters, hybrid search, and re-embed on edit are still later work.

## Sign-off

- Verified by: Alexis Terry
- Ready to demo to a stakeholder? YES locally, once the app is running. The live Vercel site still needs this generator and the Google key.
- Blockers before demo: None for a local demo after `npm run dev`. Production search stays on the old provider until that deploy.
