/**
 * INTENTIONAL TYPE ERRORS — this file should NOT typecheck cleanly.
 * Each export demonstrates a failure mode documented in
 * docs/type-safety/expected-type-errors.md
 *
 * Do not add `any`, `@ts-ignore`, or `as InvestorListing` to hide errors.
 * Field names match our types (region, fullName, published/sold) except
 * for the one deliberate break in each case.
 */
import type { InvestorListing } from "../types"

/** Shared valid published fields — not exported, not annotated. */
const publishedOk = {
  id: "lst_bad_base",
  createdAt: "2026-02-10T14:00:00Z",
  updatedAt: "2026-03-15T16:30:00Z",
  title: "Riverfront Multifamily — invalid cases",
  summary: "Same nested shape as the happy-path published sample.",
  status: "published" as const,
  propertyType: "multifamily" as const,
  address: {
    line1: "1200 River Rd",
    line2: "Suite 100",
    city: "Austin",
    region: "TX",
    postalCode: "78701",
    country: "US",
  },
  financials: {
    askingPrice: 12500000,
    currency: "USD" as const,
    projectedIrrPercent: 12.5,
    capRatePercent: 5.8,
  },
  contacts: [
    {
      id: "ctc_bad_1",
      fullName: "Jordan Lee",
      role: "broker" as const,
      email: "jordan.lee@example.com",
    },
  ],
  primaryContactId: "ctc_bad_1",
  ownership: {
    ownerName: "PREI Riverfront Holdings LLC",
    relationship: "primary_owner" as const,
    contactId: "ctc_bad_1",
    ownershipPercent: 100,
  },
}

/** Status typo that would break filters and badges. */
export const invalidStatusSpelling: InvestorListing = {
  ...publishedOk,
  status: "availble",
}

/** City is required so a listing can be placed on a map. */
export const missingAddressCity: InvestorListing = {
  ...publishedOk,
  address: {
    line1: "22 Lake Rd",
    region: "TX",
    postalCode: "78702",
    country: "US",
  },
}

/** Asking price must be a number so totals and filters can do math. */
export const priceAsString: InvestorListing = {
  ...publishedOk,
  financials: {
    askingPrice: "12500000",
    currency: "USD",
  },
}

/** Contact role is a closed list — not free text like listing_agent. */
export const invalidContactRole: InvestorListing = {
  ...publishedOk,
  contacts: [
    {
      id: "ctc_bad_1",
      fullName: "Jordan Lee",
      role: "listing_agent",
      email: "jordan.lee@example.com",
    },
  ],
}

/** Sold (closed deal) must record when it closed. */
export const soldMissingClosedAt: InvestorListing = {
  ...publishedOk,
  status: "sold",
}

/** A published listing must have at least one investor contact. */
export const emptyPublishedContacts: InvestorListing = {
  ...publishedOk,
  contacts: [],
}
