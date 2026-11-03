# PREIshare semantic search — requirements brief

## Problem (one paragraph)

PREIshare buyers look for investment properties by describing how they want to live and earn, in ordinary sentences. Keyword search returns a listing only when the same words already sit in the stored text. A query such as “quiet cabin near water with good rental upside” can miss a strong lakeside cottage whose description talks about a still shore and short-term rental income and never uses those exact words together. This tutorial adds one small slice: turn each sample property description into a list of numbers that captures meaning (an embedding, stored as a vector), keep those vectors in Supabase PostgreSQL with the pgvector extension, and rank the sample listings by how close their meaning is to the query. The slice is for a demo a beginner can explain. It is not a finished search product.

## Actors

| Actor | Goal |
| --- | --- |
| Property buyer | Type everyday intent and see sample listings that match that meaning, with the closest match first |
| PREIshare operator (us) | Run a demo on a small sample set, tell a stakeholder why a result ranked highly, and leave notes the next topic can trust |
| Coding agent (assistant) | Draft only the migration, embedding helper, seed path, similarity search, and minimal search page that this brief allows |

Sponsor accounts that already manage their own listings stay as they are. This brief does not add a new role for them.

## Example queries (must drive later tests)

Each note says what a tester should see in the top of the list. No SQL and no column names here.

1. **“quiet cabin near water with good rental upside”**
   A good top result is a small waterfront or lakeside place described as peaceful, with some note that guests or short stays could earn rent. The listing may never say “cabin,” “quiet,” and “upside” together.
   Keyword search misses it when those query words are absent from the description even though the meaning matches.

2. **“family-friendly home close to good schools”**
   A good top result is a house described with a yard, a calm street, and a nearby elementary or similar school by name. The listing may never say “family-friendly” or “good schools.”
   Keyword search misses it when the text names the school and the yard and never uses the buyer’s adjectives.

3. **“downtown condo walkable to restaurants”**
   A good top result is an urban apartment described as a short walk from dining or a cafe district in the city center. The listing may say “flat” or “above the cafe street” and never say “condo” or “walkable.”
   Keyword search misses it when the description uses different words for the same place and habit.

4. **Control: “large irrigated farmland for crop production”**
   A good outcome is that this query does not treat the cabin, the school-neighborhood house, or the downtown apartment as strong matches. If the sample set includes a farm listing, that farm ranks above those homes. If it does not, the demo still shows the homes as weak matches for crop production, and the tester can say the control failed if a cabin or condo is presented as the best hit.

## Success criteria (observable)

- [ ] A small set of sample properties is loaded, each with description text and a stored embedding vector
- [ ] Submitting one of the example queries returns a ranked list with the closest meaning first
- [ ] For query 1, a waterfront or lakeside sample appears in the top results even though at least one of “cabin,” “quiet,” or “upside” is missing from that listing’s text
- [ ] A tester can point at that listing and say which query words are missing, which is why keyword search would skip it
- [ ] For the farmland control, a cabin, school-neighborhood house, or downtown apartment is not shown as the strong match
- [ ] The same embedding size and the same similarity measure are used when vectors are stored and when they are searched
- [ ] Later code and docs stay inside the in-scope list below

## In scope for this tutorial

- A plain-language picture of embeddings and vector similarity, enough to explain a demo result
- A data model for sample properties plus embedding vectors that fits Supabase PostgreSQL and pgvector
- A migration that enables pgvector and stores those vectors
- A TypeScript helper that turns property text into an embedding
- A seed or backfill path for a small sample set, including the listings the example queries need
- A similarity search in SQL and a TypeScript helper that returns a ranked list
- A minimal search route and a simple React search page in the TanStack Start app
- End-to-end verification notes and a handoff doc

## Out of scope (explicit non-goals)

- Production embedding billing, rate limits, or large batch jobs
- Map search, price or bedroom filters, payments, and messaging
- New authentication work, changes to existing sponsor login, or changes to who may read or edit a listing
- Personalized ranking, business-rule ranking, or a tuned mix of keyword and vector search beyond one basic similarity demo
- Visual polish and a separate mobile app

## Assumptions and open questions

- A free-tier Supabase project is enough for this sample set
- The embedding model, the length of each vector, and the distance measure (for example cosine) are chosen in the data-model step and then kept the same in the migration, the generator, the seed, and the search
- How many sample listings, which embedding provider, the vector length, and the distance measure stay open until that design step
- Existing sponsor login and listing ownership from earlier topics stay in place. This tutorial does not rebuild them and does not require them for the search demo
- Sample text can be written for the demo. It does not have to be live market data

## Handoff note for later steps

Every implementation step should be checkable against the four example queries and the success criteria above. If a prompt would add maps, filters, auth changes, payments, or a production embedding pipeline, cut it.
