// Server-only. Embeds a buyer query and asks Postgres to rank stored listings.
// Do not import this file from browser components.

import { EMBEDDING_DIMENSIONS } from './embeddings/types.ts'
import { generatePropertyEmbedding } from './embeddings/generate.ts'
import { createSupabaseServiceRoleClient } from './supabase.server.ts'

export type PropertyMatch = {
  id: string
  title: string
  /** Listing write-up. Stored as summary on property_listings. */
  description: string
  /** Higher means closer in meaning. This is 1 minus cosine distance. */
  similarity: number
}

/**
 * Plain-language query in, top matches out.
 * An empty query does not call the embedding provider or the database.
 * The SQL function is SECURITY INVOKER. This helper uses the service-role
 * client so the demo can read the seeded sample rows from the server.
 */
export async function searchPropertiesByText(
  query: string,
  matchCount = 5,
): Promise<PropertyMatch[]> {
  const trimmed = query.trim()
  if (!trimmed) return []

  const limit = Math.min(Math.max(matchCount, 1), 50)
  const embedded = await generatePropertyEmbedding({
    title: '',
    description: trimmed,
  })
  if (!embedded.ok) {
    throw new Error(`${embedded.code}: ${embedded.message}`)
  }
  if (embedded.dimensions !== EMBEDDING_DIMENSIONS) {
    throw new Error(
      `DIMENSION_MISMATCH: expected ${EMBEDDING_DIMENSIONS} numbers, got ${embedded.dimensions}.`,
    )
  }

  const supabase = createSupabaseServiceRoleClient()
  const { data, error } = await supabase.rpc('match_properties', {
    query_embedding: `[${embedded.embedding.join(',')}]`,
    match_count: limit,
  })

  if (error) {
    throw new Error(`match_properties failed: ${error.message}`)
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    similarity: row.similarity,
  }))
}
