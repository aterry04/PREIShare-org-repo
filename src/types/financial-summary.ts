/**
 * Deal metrics nested on a PREIshare listing.
 * Field names follow the Financial summary group in
 * docs/domain/listing-field-inventory.md.
 *
 * Amounts and rates are numbers. Only metrics the inventory allows to be
 * blank are optional; asking price and currency are always required inside
 * this object.
 */
export type ListingCurrency = "USD"

export interface FinancialSummary {
  /** Listed price amount (inventory: financials.askingPrice). */
  askingPrice: number

  /** Currency code. Inventory currently allows only `USD`. */
  currency: ListingCurrency

  /** Optional projected IRR, as a percent (e.g. 12.5). */
  projectedIrrPercent?: number

  /** Optional capitalization rate, as a percent (e.g. 5.8). */
  capRatePercent?: number
}
