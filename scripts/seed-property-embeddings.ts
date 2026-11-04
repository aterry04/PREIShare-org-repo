// Seed sample listings and their embeddings.
// Run from the repo root:
//   npx tsx scripts/seed-property-embeddings.ts
//
// Reads SUPABASE_URL or VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
// EMBEDDING_API_KEY, and SEED_OWNER_ID from the environment or from .env.local.
// Does not print secret values. Upserts by the stable ids in data/sample-properties.json.

import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { EMBEDDING_DIMENSIONS } from '../src/lib/embeddings/types.ts'
import { generatePropertyEmbedding } from '../src/lib/embeddings/generate.ts'
import { createSupabaseServiceRoleClient } from '../src/lib/supabase.server.ts'
import type { PropertyType } from '../src/lib/supabase/types.ts'

type SampleProperty = {
  id: string
  title: string
  summary: string
  property_type: PropertyType
  address_line1: string
  city: string
  region: string
  postal_code: string
  asking_price: number
}

const propertyTypes = new Set<PropertyType>([
  'multifamily',
  'office',
  'retail',
  'industrial',
  'mixed_use',
  'land',
])

async function loadEnvFile(fileName: string) {
  try {
    const text = await readFile(path.join(process.cwd(), fileName), 'utf8')
    for (const line of text.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      let value = trimmed.slice(eq + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      if (process.env[key] === undefined) process.env[key] = value
    }
  } catch {
    // A missing env file is fine when the variables are already set.
  }
}

function requireOwnerId(): string {
  const ownerId = process.env.SEED_OWNER_ID
  if (!ownerId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ownerId)) {
    throw new Error(
      'Set SEED_OWNER_ID to an existing Supabase Auth user id before seeding.',
    )
  }
  if (ownerId === '00000000-0000-4000-8000-000000000000') {
    throw new Error('Replace the SEED_OWNER_ID placeholder with a real Auth user id.')
  }
  return ownerId
}

async function main() {
  await loadEnvFile('.env.local')
  await loadEnvFile('.env')

  const ownerId = requireOwnerId()
  const filePath = path.join(process.cwd(), 'data', 'sample-properties.json')
  const raw = await readFile(filePath, 'utf8')
  const parsed = JSON.parse(raw) as { properties: SampleProperty[] }
  if (!Array.isArray(parsed.properties) || parsed.properties.length < 6) {
    throw new Error('data/sample-properties.json needs at least 6 properties.')
  }

  const supabase = createSupabaseServiceRoleClient()

  for (const property of parsed.properties) {
    if (!propertyTypes.has(property.property_type)) {
      throw new Error(`${property.id} has a property_type the listings table will reject.`)
    }

    const result = await generatePropertyEmbedding({
      title: property.title,
      description: property.summary,
    })
    if (!result.ok) {
      throw new Error(`${property.id} embedding failed: ${result.code}. ${result.message}`)
    }
    if (result.dimensions !== EMBEDDING_DIMENSIONS || result.embedding.length !== 1536) {
      throw new Error(
        `${property.id} embedding length ${result.embedding.length} does not match vector(1536).`,
      )
    }

    const { error } = await supabase.from('property_listings').upsert(
      {
        id: property.id,
        owner_id: ownerId,
        title: property.title,
        summary: property.summary,
        property_type: property.property_type,
        address_line1: property.address_line1,
        city: property.city,
        region: property.region,
        postal_code: property.postal_code,
        country: 'US',
        asking_price: property.asking_price,
        currency: 'USD',
        status: 'draft',
        embedding: `[${result.embedding.join(',')}]`,
      },
      { onConflict: 'id' },
    )

    if (error) {
      throw new Error(`Failed to seed ${property.id}: ${error.message}`)
    }

    console.log(`Seeded ${property.id} ${property.title} embedding dims: ${result.dimensions}`)
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Seed failed.'
  console.error(message)
  process.exit(1)
})
