import { createServerFn } from '@tanstack/react-start'
import { getUser, readSponsorAccessToken } from '../lib/auth/session'
import {
  createListingSchema,
  listingFieldErrors,
  updateListingSchema,
  type CreateListingInput,
  type UpdateListingInput,
} from '../lib/listings/schema'
import { createUserServerSupabaseClient } from '../lib/supabase/server'
import type { PropertyListingRow, PropertyListingUpdate } from '../lib/supabase/types'

export type ListingRow = PropertyListingRow

export type ListingsResult =
  | { ok: true; listings: ListingRow[] }
  | { ok: false; error: string }

export type ListingMutationResult =
  | { ok: true; listing: ListingRow }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> }

const signInError = 'You must be signed in to manage listings.'

async function sponsorClient() {
  const user = await getUser()
  if (!user) return null
  const accessToken = readSponsorAccessToken()
  if (!accessToken) return null
  return {
    user,
    supabase: createUserServerSupabaseClient(accessToken),
  }
}

function validationError(error: Parameters<typeof listingFieldErrors>[0]): ListingMutationResult {
  return {
    ok: false,
    error: 'Check the listing fields and try again.',
    fieldErrors: listingFieldErrors(error),
  }
}

/** Listings for the signed-in sponsor, newest first. An empty list is success. */
export const listMyListings = createServerFn({ method: 'GET' }).handler(
  async (): Promise<ListingsResult> => {
    const sponsor = await sponsorClient()
    if (!sponsor) return { ok: false, error: signInError }

    const { data, error } = await sponsor.supabase
      .from('property_listings')
      .select('*')
      .eq('owner_id', sponsor.user.id)
      .order('created_at', { ascending: false })

    if (error) return { ok: false, error: 'Could not load listings. Try again.' }
    return { ok: true, listings: data ?? [] }
  },
)

/** Create a listing owned by the session user. The body cannot set owner_id. */
export const createListing = createServerFn({ method: 'POST' })
  .validator((input: unknown) => input)
  .handler(async ({ data }): Promise<ListingMutationResult> => {
    const sponsor = await sponsorClient()
    if (!sponsor) return { ok: false, error: signInError }

    const parsed = createListingSchema.safeParse(data)
    if (!parsed.success) return validationError(parsed.error)

    const input = parsed.data
    const { data: row, error } = await sponsor.supabase
      .from('property_listings')
      .insert(listingInsert(sponsor.user.id, input))
      .select('*')
      .single()

    if (error || !row) {
      return { ok: false, error: 'Could not create the listing. Check your input and try again.' }
    }
    return { ok: true, listing: row }
  })

/** Update a listing only when this sponsor owns the row. owner_id is not editable. */
export const updateListing = createServerFn({ method: 'POST' })
  .validator((input: unknown) => input)
  .handler(async ({ data }): Promise<ListingMutationResult> => {
    const sponsor = await sponsorClient()
    if (!sponsor) return { ok: false, error: signInError }

    const parsed = updateListingSchema.safeParse(data)
    if (!parsed.success) return validationError(parsed.error)

    const { id, ...patch } = parsed.data
    const changes = listingPatch(patch)
    if (Object.keys(changes).length === 0) {
      return { ok: false, error: 'No fields to update.' }
    }

    const { data: row, error } = await sponsor.supabase
      .from('property_listings')
      .update(changes)
      .eq('id', id)
      .eq('owner_id', sponsor.user.id)
      .select('*')
      .single()

    if (error || !row) {
      return {
        ok: false,
        error: 'Could not update the listing. It may not exist or you may not own it.',
      }
    }
    return { ok: true, listing: row }
  })

function listingInsert(ownerId: string, input: CreateListingInput) {
  return {
    owner_id: ownerId,
    title: input.title,
    summary: input.summary && input.summary.length > 0 ? input.summary : null,
    property_type: input.property_type,
    address_line1: input.address_line1,
    address_line2: input.address_line2 && input.address_line2.length > 0 ? input.address_line2 : null,
    city: input.city,
    region: input.region,
    postal_code: input.postal_code,
    country: input.country,
    asking_price: input.asking_price,
    currency: input.currency,
    projected_irr_percent: input.projected_irr_percent ?? null,
    cap_rate_percent: input.cap_rate_percent ?? null,
    status: input.status,
    closed_at: input.status === 'sold' ? (input.closed_at ?? null) : null,
  }
}

function listingPatch(patch: Omit<UpdateListingInput, 'id'>): PropertyListingUpdate {
  const changes: PropertyListingUpdate = {}
  if (patch.title !== undefined) changes.title = patch.title
  if (patch.summary !== undefined) changes.summary = patch.summary.length > 0 ? patch.summary : null
  if (patch.property_type !== undefined) changes.property_type = patch.property_type
  if (patch.address_line1 !== undefined) changes.address_line1 = patch.address_line1
  if (patch.address_line2 !== undefined) {
    changes.address_line2 = patch.address_line2 && patch.address_line2.length > 0 ? patch.address_line2 : null
  }
  if (patch.city !== undefined) changes.city = patch.city
  if (patch.region !== undefined) changes.region = patch.region
  if (patch.postal_code !== undefined) changes.postal_code = patch.postal_code
  if (patch.country !== undefined) changes.country = patch.country
  if (patch.asking_price !== undefined) changes.asking_price = patch.asking_price
  if (patch.currency !== undefined) changes.currency = patch.currency
  if (patch.projected_irr_percent !== undefined) changes.projected_irr_percent = patch.projected_irr_percent
  if (patch.cap_rate_percent !== undefined) changes.cap_rate_percent = patch.cap_rate_percent
  if (patch.status !== undefined) {
    changes.status = patch.status
    changes.closed_at = patch.status === 'sold' ? (patch.closed_at ?? null) : null
  } else if (patch.closed_at !== undefined) {
    changes.closed_at = patch.closed_at
  }
  return changes
}
