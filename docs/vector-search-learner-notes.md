# Vector search learner notes (PREIshare)

These notes pick up from `docs/embeddings-learner-notes.md` and the example queries in `docs/semantic-search-requirements.md`. This file is about ranking. It is not a database schema and not a finished search API.

## 1. My plain-language definition

Vector similarity ranking means: turn the buyer’s query into an embedding, compare that list of numbers to each stored property embedding, score how close the meanings are, and return the closest properties first. Those closest rows are the nearest neighbors. “Best match” means nearest in meaning on that map, not the listing that shares the most exact words.

## 2. How a search runs (steps I can explain)

1. The buyer types a natural-language query, such as one from the requirements brief.
2. The system creates a query embedding with the same embedding approach used for the listings. Same model, same list length.
3. The system compares that query embedding to the stored property embeddings.
4. Each property gets a distance score or a similarity score.
5. Results are ranked best-first and cut to top-K. For a first demo I want K = 5, so the page shows five neighbors instead of every row in the table.

```text
[Buyer query text]
        |
        v
[Query embedding] ----compare----> [Property embeddings in the database]
        |
        v
[Scores] -> [Sort best-first] -> [Top-K listings shown]
```

Generation still happens outside the database: the model makes the query’s number-list. Storage is the property embeddings already saved with pgvector. Comparison is the new step. It reads those saved lists and scores them against the query list.

## 3. Keyword search vs vector search (same query)

**Example query:** quiet cabin near water with good rental upside

| Approach | What it looks for | Likely miss |
| --- | --- | --- |
| Keyword | The words “cabin,” “water,” “quiet,” “rental,” or “upside” sitting in the text | “Small cottage on a still shore. Guests book short stays through the summer, and the path to the water is private.” |
| Vector / semantic | A nearby meaning: small peaceful place by water where short stays earn rent | Still misses a listing whose text is empty, misleading, or was never embedded |

**My takeaway:** PREIshare buyers describe a life and a return. Listings describe the same idea in other words. Vector ranking is how a cottage on a still shore can surface for that cabin query. Keyword search waits for the buyer’s words to already be in the description.

## 4. Worked ranking examples (no real math required)

These orders are my judgment of meaning. They are not computed vectors.

### Example A — clear winner

Query: “family-friendly home close to good schools”

| Listing blurb | Expected rank | Why |
| --- | --- | --- |
| “4-bedroom house on a quiet cul-de-sac, big yard, two blocks from Lincoln Elementary.” | 1 (best) | Same intent: a home for a family and a nearby school, even without the words “family-friendly” or “good schools.” |
| “Second-floor flat above a cafe street in the city center, a short walk from dinner and offices.” | lower | A place to live, but the intent is dining and offices, not a school neighborhood. |
| “Large irrigated parcel with crop rows, a pump shed, and no house.” | lowest | Farmland. Unrelated to a family home near a school. |

Keyword search can miss the winner because the blurb names Lincoln Elementary and a yard and never says “family-friendly” or “good schools.”

### Example B — different words, same intent

Query: “cabin by the lake”

Strong match listing: “Rustic woodland retreat on the water with a private dock and a short path to the shore.”

Why vector ranking should put this first: both sides mean a small getaway beside water. The listing never has to say “cabin” or “lake.”

Why keyword search can fail: the shared exact words can be none. “Retreat,” “shore,” and “dock” are not the tokens the buyer typed.

A downtown loft or the irrigated farm should rank below that retreat for this query. If the loft wins because it happens to contain the word “water” in “water bill included,” the ranking failed the meaning test.

## 5. Top-K and scores (what I will check later)

- **Top-K** means return only the K nearest neighbors. My first default is K = 5. A demo page should not dump the whole table.
- **Distance score:** smaller usually means closer, so sort ascending if the database reports distance.
- **Similarity score:** larger usually means a better match, so sort descending if the database reports similarity.
- I have to know which kind of score the later SQL returns before I trust `ORDER BY`. Sorting a distance the way I would sort a similarity puts the worst match first.
- The score is for debugging the order. Each result still needs a property id, a title or short snippet, and the score, so I can explain why that row appeared.

## 6. What good ranking is not

- Alphabetical order of titles
- Newest listing first, unless a later product rule adds that on purpose
- A keyword filter such as `ILIKE` that we then call semantic
- Comparing embeddings built with different models or different list lengths
- Treating one number inside an embedding as the match score. The score comes from comparing two whole lists.

## 7. Assessment questions for a future match_properties-style function

I will reject agent output later unless I can answer yes to these:

1. Does the function take a query embedding, or take query text and embed it with the same model and the same list length used for the listings?
2. Does it compare that vector to the stored property embedding column, rather than searching the raw description text alone?
3. Does it order results so the best semantic matches come first, in the correct direction for distance (smaller better) or similarity (larger better)?
4. Does it support top-K, a limit on how many neighbors come back?
5. Does each row include enough to explain the hit: at least a property id, a human-readable title or snippet, and the score?
6. Does it refuse to mix different embedding sizes or models in one comparison?
7. On the sample data, does the different-wording lakeside cottage rank above an unrelated listing that merely shares a word like “water”?
8. For the farmland control query, does a cabin, school-neighborhood house, or downtown apartment stay out of the “strong match” spot?

## 8. Link back to requirements

Example queries from `docs/semantic-search-requirements.md`:

- “quiet cabin near water with good rental upside”
- “family-friendly home close to good schools”
- “downtown condo walkable to restaurants”
- Control: “large irrigated farmland for crop production”

Success criteria this ranking model supports:

- Submitting one of the example queries returns a ranked list with the closest meaning first
- For the cabin query, a waterfront or lakeside sample appears in the top results even when “cabin,” “quiet,” or “upside” is missing from that listing’s text
- For the farmland control, a cabin, school-neighborhood house, or downtown apartment is not shown as the strong match
- The same embedding size and the same similarity measure are used when vectors are stored and when they are searched

From `docs/embeddings-learner-notes.md`: generation creates the number-list outside the database, storage saves it on the property row, and comparison is what this step adds at search time.

## 9. Open questions for later steps

- Which distance measure will the pgvector migration use? Name only for now. I still need to know if a smaller number means closer.
- Is K = 5 the right default for the first API, or should the page ask for a different limit?
- What minimum fields should the first UI show next to each ranked hit: title, a one-line snippet, and the score?
- How should the demo label a weak match on the farmland control so a tester can tell “best of a bad set” from “this is a strong hit”?
