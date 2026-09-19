/**
 * Core PREIshare investor listing.
 * Nested types (address, financials, contacts) are added in later steps.
 *
 * Field names follow docs/domain/listing-field-inventory.md.
 * `summary` is the inventory’s `description` (investor-facing copy).
 * `askingPrice` is the inventory’s `financials.askingPrice`, kept as a
 * scalar here until a nested financial summary type exists.
 */
export interface InvestorListing {
  /** Stable unique id for this listing (assigned by the system). */
  id: string

  /** Short public headline shown in search results and cards. */
  title: string

  /** Longer plain-text description of the investment opportunity. */
  summary: string

  /**
   * Asking price in whole US dollars (no currency symbol).
   * Example: 450000 means $450,000.
   */
  askingPrice: number

  /** ISO-8601 datetime string when the listing was first created. */
  createdAt: string

  /** ISO-8601 datetime string when the listing was last updated. */
  updatedAt: string
}