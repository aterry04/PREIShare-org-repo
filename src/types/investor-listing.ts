/**
 * Core PREIshare investor listing.
 * Nested address, financials, contacts, and ownership stay on the shared base.
 *
 * Field names follow docs/domain/listing-field-inventory.md.
 * `summary` is the inventory’s `description` (investor-facing copy).
 */
import type { Address } from "./address"
import type { FinancialSummary } from "./financial-summary"
import type { InvestorContact } from "./investor-contact"
import type { Ownership } from "./ownership"
import type { PropertyType } from "./property-type"

/** At least one contact — used on published, under_offer, and sold. */
type NonEmptyContacts = [InvestorContact, ...InvestorContact[]]

/** Fields every investor listing has, regardless of status. */
export interface InvestorListingBase {
  /** Stable identity — do not reassign after create. */
  readonly id: string

  /** Set once when the row is created. */
  readonly createdAt: string

  /** May change when the listing is edited; still not a business key. */
  readonly updatedAt: string

  /** Short public headline shown in search results and cards. */
  title: string

  /** Longer plain-text description of the investment opportunity. */
  summary: string

  /** Asset class. Must be one of the inventory’s allowed labels. */
  propertyType: PropertyType

  /**
   * Physical location. Always required — PREIshare listings have a pin,
   * even when deal metrics are still being underwritten.
   */
  address: Address

  /**
   * Nested deal metrics (inventory group: financials).
   * The object itself is required so asking price and currency cannot
   * disappear; only projectedIrrPercent and capRatePercent may be blank.
   */
  financials: FinancialSummary

  /**
   * People associated with this listing.
   * Draft and archived may be empty; published, under_offer, and sold
   * require at least one contact (narrowed on those union branches).
   */
  contacts: InvestorContact[]

  /**
   * Must match InvestorContact.id of one entry in `contacts`.
   * TypeScript cannot fully enforce "id exists in array" alone;
   * we still type it as string so callers pass an id, not a whole loose object.
   */
  primaryContactId: string

  /**
   * Who owns the asset and how they relate to it.
   * A published listing should also have at least one contact.
   */
  ownership: Ownership
}

/**
 * Discriminated union: TypeScript uses `status` to know which shape you have.
 * PREIshare’s closed deal is `sold` (not the tutorial sample `closed`).
 * `closedAt` is required only when status is `sold`.
 * Published, under-offer, and sold listings must include at least one contact.
 */
export type InvestorListing =
  | (InvestorListingBase & {
      status: "draft" | "archived"
      /** Not used unless the listing is sold. */
      closedAt?: undefined
    })
  | (InvestorListingBase & {
      status: "published" | "under_offer"
      /** Not used unless the listing is sold. */
      closedAt?: undefined
      contacts: NonEmptyContacts
    })
  | (InvestorListingBase & {
      status: "sold"
      /** ISO-8601 datetime string — required when the listing is sold. */
      closedAt: string
      contacts: NonEmptyContacts
    })

export type ClosedInvestorListing = Extract<InvestorListing, { status: "sold" }>
export type OpenInvestorListing = Exclude<InvestorListing, { status: "sold" }>