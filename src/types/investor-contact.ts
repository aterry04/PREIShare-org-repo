/**
 * A person the team can reach about an investor listing.
 * Field meanings follow docs/domain/listing-field-inventory.md.
 * `fullName` is the inventory’s `contacts[].name`.
 */

/** Closed contact roles. Not free text. */
export type ContactRole = "broker" | "owner_rep"

export interface InvestorContact {
  /** Stable id within this listing’s contact list. */
  id: string

  /** Person or firm name (inventory: contacts[].name). */
  fullName: string

  /** Why they appear on the listing. */
  role: ContactRole

  /** Email — required identity field so every contact has a mailbox. */
  email: string

  /** Phone, when the contact shares one. Inventory allows email or phone. */
  phone?: string
}
