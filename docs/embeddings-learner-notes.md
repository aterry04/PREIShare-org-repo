# Embeddings learner notes (PREIshare)

These are my notes before any search code. I am still learning this. Ranking comes in the next step.

## Plain-language definition

An embedding turns a piece of text into a list of numbers that stands for its meaning. For PREIshare that text is a property description or a buyer’s search phrase. The list is also called a vector. It is a meaning fingerprint, not a copy of the sentence and not a bag of keywords.

## Tiny intuition (not real model output)

A real embedding is a long list, often hundreds or thousands of numbers. Every list from the same model has the same length. That length is the number of dimensions. I picture a toy list of three numbers so “near” and “far” are easy to see:

- “lakefront cabin, quiet, strong Airbnb history” → [0.9, 0.8, 0.1]
- “waterfront cottage, peaceful, good short-term rental” → [0.88, 0.82, 0.12] (nearby)
- “downtown loft near nightlife and offices” → [0.1, 0.2, 0.95] (far from the cabin)

The cottage uses different words from the cabin and still lands next to it. The loft is a different kind of place, so its numbers sit somewhere else. One number by itself is not a score I can read. The pattern of the whole list is what matters.

## PREIshare examples from our requirements

From `docs/semantic-search-requirements.md`.

- Buyer query I care about: “quiet cabin near water with good rental upside”
- Listing A (should feel close): “Small cottage on a still shore. Guests book short stays through the summer, and the path to the water is private.”
- Listing B (should feel far): “Second-floor flat above a cafe street in the city center, a short walk from dinner spots and offices.”
- Why A is closer in meaning than B: A is a small, peaceful place by water where short stays earn rent. That is the life the buyer described. B is an urban apartment built around dining and offices. The words “cabin,” “quiet,” and “upside” can be missing from A and it should still sit nearer the query than B.
- Extra far example for the control query “large irrigated farmland for crop production”: neither A nor B is a crop farm. A cabin or a downtown flat should not be treated as the strong match for that search.

## Generation vs storage (do not mix these up)

| Stage | What happens | Where |
| --- | --- | --- |
| Generation | Text goes into an embedding model through an embedding API. A number-list comes back. | App side, later a TypeScript module. This happens outside the database. |
| Storage | That finished number-list is saved next to the property row. | Database: Supabase PostgreSQL with the pgvector extension. |

Search will later generate an embedding for the buyer’s phrase, then compare that new list with the lists already stored on the properties. Comparison and ranking are the next step. pgvector is what lets PostgreSQL keep and compare these lists. I am not choosing a vendor or a dimension count yet.

## Misconceptions to watch for when reviewing agent code later

- The vector does not contain the original sentence as text. The description stays in its own text field. The vector is only the numbers.
- Two listings do not need the same words to be close. “Cottage on a still shore” can sit near “quiet cabin near water.”
- Every embedding from the same model must have the same list length. Mixing two models, or two dimension counts, in one table breaks comparison.
- Creating the number-list is not the same as inserting the row. Generation can succeed and storage can still be missing.
- A single number inside the list is not a human-readable match score. Closeness comes from comparing two whole lists.

## What I can explain to a teammate in 60 seconds

An embedding is a list of numbers that stands for the meaning of a property description or a search phrase. Similar meanings get similar lists, even when the wording is different. A lakeside cottage with short-stay income should land near “quiet cabin near water with good rental upside.” A downtown flat above a cafe street should land far from that phrase. The model or API creates the numbers. That is generation, and it happens in our code, outside the database. Supabase then saves those numbers on the property row with pgvector. That is storage. Keyword search only hits when the same words are already in the text, so it can miss the cottage. We have not ranked results yet. Next we figure out how “close” becomes an ordered list.

## Open questions before similarity ranking (Step 3)

- How do we turn “these two lists are close” into an ordered list of properties, best match first?
- What happens if two different embedding models, or two different list lengths, get saved in the same table?
- Which distance measure should PREIshare use, and does a smaller number mean a closer match?
