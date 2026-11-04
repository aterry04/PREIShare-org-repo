// Server-only. Do not import this file from browser components.
// Reads EMBEDDING_API_KEY and optional EMBEDDING_MODEL. Never hard-code a key.

import {
  EMBEDDING_DIMENSIONS,
  type EmbeddingResult,
  type PropertyEmbeddingInput,
} from './types'

const DEFAULT_EMBEDDING_MODEL = 'text-embedding-3-small'

/**
 * Combine title and description the same way the data model describes.
 * Same fields always produce the same text. City and price are left out.
 */
export function buildEmbeddingText(input: PropertyEmbeddingInput): string {
  return [input.title, input.description]
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .join('\n\n')
}

/**
 * True when the vector is a finite number list of the data-model length.
 * Use this locally before seeding: a sample vector must pass before it is stored.
 */
export function assertEmbeddingDimension(
  embedding: number[],
  expected = EMBEDDING_DIMENSIONS,
): boolean {
  return (
    Array.isArray(embedding) &&
    embedding.length === expected &&
    embedding.every((value) => typeof value === 'number' && Number.isFinite(value))
  )
}

/**
 * Text in, fixed-length vector or a typed failure out.
 * Empty text never calls the provider. The returned length must be 1536.
 */
export async function generatePropertyEmbedding(
  input: PropertyEmbeddingInput,
): Promise<EmbeddingResult> {
  const text = buildEmbeddingText(input)
  if (!text) {
    return {
      ok: false,
      code: 'EMPTY_INPUT',
      message: 'Property title and description are empty. Nothing to embed.',
    }
  }

  const apiKey = process.env.EMBEDDING_API_KEY
  if (!apiKey) {
    return {
      ok: false,
      code: 'MISSING_API_KEY',
      message: 'Set EMBEDDING_API_KEY in the server environment before generating embeddings.',
    }
  }

  try {
    const embedding = await callEmbeddingProvider(text, apiKey)
    if (!assertEmbeddingDimension(embedding)) {
      return {
        ok: false,
        code: 'DIMENSION_MISMATCH',
        message: `Expected ${EMBEDDING_DIMENSIONS} numbers, got ${embedding.length}.`,
      }
    }

    return {
      ok: true,
      embedding,
      model: process.env.EMBEDDING_MODEL ?? DEFAULT_EMBEDDING_MODEL,
      dimensions: embedding.length,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown provider error'
    return { ok: false, code: 'PROVIDER_ERROR', message }
  }
}

async function callEmbeddingProvider(text: string, apiKey: string): Promise<number[]> {
  const model = process.env.EMBEDDING_MODEL ?? DEFAULT_EMBEDDING_MODEL
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: text,
      dimensions: EMBEDDING_DIMENSIONS,
    }),
  })

  if (!response.ok) {
    throw new Error(`Embedding provider returned HTTP ${response.status}.`)
  }

  const body = (await response.json()) as {
    data?: Array<{ embedding?: number[] }>
  }
  const embedding = body.data?.[0]?.embedding
  if (!embedding) {
    throw new Error('Embedding provider returned no vector.')
  }
  return embedding
}
