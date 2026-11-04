// Contract for property embeddings. Dimension matches docs/embedding-data-model.md.

/** Must match property_listings.embedding vector(1536). */
export const EMBEDDING_DIMENSIONS = 1536

/**
 * Text fields turned into one embedding.
 * `description` is the listing write-up stored as `summary` on property_listings.
 * City and price are not part of this input.
 */
export type PropertyEmbeddingInput = {
  title: string
  description: string
}

export type EmbeddingSuccess = {
  embedding: number[]
  /** Provider model id. Not used as the search score. */
  model: string
  dimensions: number
}

export type EmbeddingErrorCode =
  | 'EMPTY_INPUT'
  | 'MISSING_API_KEY'
  | 'PROVIDER_ERROR'
  | 'DIMENSION_MISMATCH'

export type EmbeddingFailure = {
  ok: false
  code: EmbeddingErrorCode
  message: string
}

export type EmbeddingResult = ({ ok: true } & EmbeddingSuccess) | EmbeddingFailure
