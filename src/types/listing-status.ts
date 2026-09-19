/**
 * Closed listing lifecycle states from docs/domain/listing-field-inventory.md.
 * Only these exact strings are allowed—no free text or alternate casing.
 *
 * `sold` is PREIshare’s closed deal. InvestorListing uses that literal as
 * the discriminant that requires `closedAt`. Do not rename these to the
 * tutorial sample values (`active`, `closed`).
 */
export type ListingStatus =
  | "draft"
  | "published"
  | "under_offer"
  | "sold"
  | "archived"

/** Every allowed status except the closed-deal status `sold`. */
export type OpenListingStatus = Exclude<ListingStatus, "sold">
