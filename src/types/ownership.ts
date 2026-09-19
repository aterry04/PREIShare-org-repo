/**
 * Who owns the property and how they relate to the asset.
 * Field meanings follow docs/domain/listing-field-inventory.md.
 * `ownershipPercent` is the inventory’s `ownership[].sharePercent`.
 */

/** Closed ownership relationships. Not free text. */
export type OwnershipRelationship =
  | "primary_owner"
  | "co_owner"
  | "broker"
  | "property_manager"

export interface Ownership {
  /** Person or entity name shown on the listing. */
  ownerName: string

  /**
   * How this owner relates to the asset (inventory: ownership[].relationship).
   */
  relationship: OwnershipRelationship

  /**
   * Contact id this ownership row refers to, when it maps to `contacts`.
   * Inventory: ownership[].contactNameOrId.
   */
  contactId?: string

  /** Optional free-text about splits, trusts, or co-owners. */
  notes?: string

  /** When known, percent owned by this owner (0–100). */
  ownershipPercent?: number
}
