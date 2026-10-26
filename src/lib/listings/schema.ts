import { z } from 'zod'

/** Allowed listing statuses. Matches the Postgres check on property_listings. */
export const listingStatusSchema = z.enum([
  'draft',
  'published',
  'under_offer',
  'sold',
  'archived',
])

export const propertyTypeSchema = z.enum([
  'multifamily',
  'office',
  'retail',
  'industrial',
  'mixed_use',
  'land',
])

const statusesThatNeedSummary = new Set(['published', 'under_offer', 'sold'])

function refineListingRules(
  value: {
    status?: z.infer<typeof listingStatusSchema>
    summary?: string
    closed_at?: string | null
  },
  ctx: z.RefinementCtx,
) {
  if (value.status && statusesThatNeedSummary.has(value.status)) {
    if (!value.summary || value.summary.trim().length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['summary'],
        message: 'Summary is required for this status.',
      })
    }
  }

  if (value.status === 'sold' && !value.closed_at) {
    ctx.addIssue({
      code: 'custom',
      path: ['closed_at'],
      message: 'Sold listings need a closed date.',
    })
  }

  if (value.status && value.status !== 'sold' && value.closed_at) {
    ctx.addIssue({
      code: 'custom',
      path: ['closed_at'],
      message: 'Only sold listings can have a closed date.',
    })
  }
}

export const createListingSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required').max(200),
    summary: z.string().trim().max(5000).optional(),
    property_type: propertyTypeSchema,
    address_line1: z.string().trim().min(1, 'Address is required').max(300),
    address_line2: z.string().trim().max(300).optional(),
    city: z.string().trim().min(1, 'City is required').max(120),
    region: z.string().trim().min(1, 'Region is required').max(120),
    postal_code: z.string().trim().min(3, 'Postal code is required').max(20),
    country: z.string().trim().min(2).max(80).default('US'),
    asking_price: z.coerce.number().nonnegative('Price must be zero or greater'),
    currency: z.literal('USD').default('USD'),
    projected_irr_percent: z.coerce.number().nullable().optional(),
    cap_rate_percent: z.coerce.number().nullable().optional(),
    status: listingStatusSchema.default('draft'),
    closed_at: z.string().trim().min(1).nullable().optional(),
  })
  .strict()
  .superRefine(refineListingRules)

export const updateListingSchema = z
  .object({
    id: z.string().uuid('Listing id must be a valid UUID'),
    title: z.string().trim().min(1, 'Title is required').max(200).optional(),
    summary: z.string().trim().max(5000).optional(),
    property_type: propertyTypeSchema.optional(),
    address_line1: z.string().trim().min(1, 'Address is required').max(300).optional(),
    address_line2: z.string().trim().max(300).nullable().optional(),
    city: z.string().trim().min(1, 'City is required').max(120).optional(),
    region: z.string().trim().min(1, 'Region is required').max(120).optional(),
    postal_code: z.string().trim().min(3, 'Postal code is required').max(20).optional(),
    country: z.string().trim().min(2).max(80).optional(),
    asking_price: z.coerce
      .number()
      .nonnegative('Price must be zero or greater')
      .optional(),
    currency: z.literal('USD').optional(),
    projected_irr_percent: z.coerce.number().nullable().optional(),
    cap_rate_percent: z.coerce.number().nullable().optional(),
    status: listingStatusSchema.optional(),
    closed_at: z.string().trim().min(1).nullable().optional(),
  })
  .strict()
  .superRefine(refineListingRules)

export type CreateListingInput = z.infer<typeof createListingSchema>
export type UpdateListingInput = z.infer<typeof updateListingSchema>

export function listingFieldErrors(error: z.ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {}
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? String(issue.path[0]) : 'form'
    const messages = fieldErrors[key] ?? []
    messages.push(issue.message)
    fieldErrors[key] = messages
  }
  return fieldErrors
}
