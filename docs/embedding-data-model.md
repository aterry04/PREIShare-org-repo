# PREIshare embedding data model

## Purpose

Software-ready design for property listings and their embedding vectors. This doc is the contract for a later pgvector migration, TypeScript types, seed/backfill, and similarity search. It is not SQL and not application code.

## Sources

- `docs/semantic-search-requirements.md`
- `docs/embeddings-learner-notes.md`
- `docs/vector-search-learner-notes.md`
- Existing listings live in `property_listings`, described in `docs/data-model-and-rls-matrix.md`

## Overview

Each property is one row in `property_listings`. Humans read the text and number columns. Search reads one extra column, `embedding`: a fixed-length list of numbers that captures the meaning of the listing text. A buyer query is embedded the same way, then compared with these stored vectors. That comparison is similarity ranking. Keyword overlap is not the ranking rule.

Do not add a second listings table. `property_listings` is the properties resource. This tutorial adds the embedding column and the text recipe below. It leaves sponsor login and row ownership as they already are.

## Identifiers

| Field | Type (logical) | Required | Notes |
| --- | --- | --- | --- |
| id | uuid | yes | Primary key. One unique id per listing. |

`owner_id` already exists on the row. It decides who may manage the listing. It is not part of the embedding and this doc does not redesign it.

## Core listing fields (this tutorial slice)

| Field | Type (logical) | Required | Notes |
| --- | --- | --- | --- |
| title | text | yes | Short headline. Part of the embedding input. |
| summary | text | yes for any row that should be searchable | The description: the longer write-up a buyer would read. Part of the embedding input. The column name stays `summary`. Do not add a second column named `description`. |
| city | text | yes on current listings | Display and a later filter. Not part of the embedding input. |
| asking_price | number | yes on current listings | Display only. Must be >= 0. Not part of the embedding input. |
| created_at | timestamp | yes | When the row was inserted. Not a search rank. |

Other columns already on `property_listings` (address, status, property type, and the rest) stay as they are. This slice does not require them for the embedding recipe.

## What text is embedded

**Embedding input (canonical string):** concatenate `title` and `summary` with a blank line between them.

```text
{title}

{summary}
```

Rules:

- `summary` is the description. Always build the embedding from title plus that description, in this order, with this separator.
- Re-embeds use the same recipe. Embedding only the title, or only the summary, does not match this contract.
- Do not embed `id`, `owner_id`, `city`, or `asking_price`. Those are not the narrative meaning.
- Store `title` and `summary` unchanged. The vector is derived from them and lives in its own column.

Worked check from the requirements: a lakeside cottage can be titled “Still Shore Cottage” with a summary about a private path to the water and short-stay income. The buyer query “quiet cabin near water with good rental upside” is embedded as its own string. The two vectors can sit near each other even when the summary never contains “cabin” or “upside.”

## Embedding column

| Field | Type (logical) | Required | Notes |
| --- | --- | --- | --- |
| embedding | vector(1536) | yes after backfill | One vector per property. Same length on every row and on every query. |

### Dimension

- The only vector length in this contract is **1536**.
- The embedding model is `text-embedding-3-small`. That model returns 1536 numbers. `src/lib/embeddings/types.ts` uses the same count.
- Query vectors and stored vectors must use that same model and the same 1536 length. A different length breaks insert or search.
- One property has one embedding for this tutorial. Do not store a second vector for a different model on the same row.

### Nullability and backfill

- A brand-new listing may have `embedding` null for the moment between saving the text and generating the vector.
- A row with a null embedding, or with an empty `summary`, is not eligible for semantic search.
- After seed and backfill, every searchable sample property has a non-empty `title`, a non-empty `summary`, and a non-null `embedding` of length 1536.
- Lifecycle: save listing text, build the canonical string, generate the embedding outside the database, store the vector on the row, then the row can be ranked.

## Separation of concerns

| Concern | Where it lives |
| --- | --- |
| Human-readable listing | `title`, `summary`, `city`, `asking_price`, and the other existing columns |
| Meaning for search | `embedding` only |
| Similarity style | Planned as cosine similarity, from `docs/vector-search-learner-notes.md`. The SQL operator is chosen in the migration step. Confirm whether the returned score is similarity (larger is better) or distance (smaller is better) before sorting. |

The description stays in `summary` so the page can show it. The vector is only for ranking. Replacing the summary with the vector would hide the listing text.

## In scope vs out of scope (data model)

**In scope**

- The existing `property_listings` row, plus one `embedding` column
- One embedding per property
- The title + summary recipe and the single length 1536
- Sample rows a later seed can load for the four requirements queries

**Out of scope**

- A second table named `properties` or a second description column
- Multiple embedding versions per property
- New user accounts, saved searches, or permission tables
- Changes to sponsor login or to who may read or edit a listing
- Photos, maps, payments, and messaging
- A keyword index that replaces the vector
- Production model keys, rate limits, and batch-job infrastructure

## Consistency checklist (must pass before migration)

- [x] Every search field has a purpose tied to the requirements
- [x] Primary key is `id` on `property_listings`
- [x] Embedding input is `{title}` then a blank line then `{summary}`
- [x] Vector size is only 1536
- [x] Raw text and the vector are separate columns
- [x] `embedding` may be null only before backfill; searchable rows must have a vector
- [x] Auth, photos, and payments are listed as out of scope

## Open questions

- Model and length are chosen: `text-embedding-3-small`, 1536. The provider key name is `EMBEDDING_API_KEY` (server-only).
- The SQL similarity or distance operator. Cosine similarity is the planned style. Sort direction waits on whether the function returns similarity or distance.
- Whether the demo seed inserts new sample rows or backfills embeddings onto listings that already exist
- Default top-K for the first search call (learner notes suggest 5)

## Handoff

Next: plan Supabase pgvector enablement and migration order from this contract, in `docs/pgvector-setup-plan.md`.
