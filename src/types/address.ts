/**
 * Physical location of a PREIshare listing.
 * Field names follow the Address group in docs/domain/listing-field-inventory.md.
 * Core location fields are required so a listing can be placed on a map.
 */
export interface Address {
  /** Street number and name. */
  line1: string

  /** Unit or suite, when the property has one. */
  line2?: string

  /** City. */
  city: string

  /** State, province, or region. */
  region: string

  /** Postal or ZIP code. */
  postalCode: string

  /** Country code or name (inventory example: `US`). */
  country: string
}
