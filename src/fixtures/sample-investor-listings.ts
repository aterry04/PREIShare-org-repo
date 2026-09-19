/**
 * Realistic PREIshare sample listings typed against InvestorListing.
 * Field names and union members match src/types — not the tutorial scaffold
 * (no `active`/`closed` status, no `state`/`noi`/`listing_agent`).
 *
 * Plain object literals only. Do not add `as InvestorListing`.
 */
import type { InvestorListing } from "../types"

/** Draft retail pad — optional return metrics omitted while underwriting. */
export const sampleDraftListing: InvestorListing = {
  id: "lst_1001",
  createdAt: "2026-03-01T10:00:00Z",
  updatedAt: "2026-03-02T09:15:00Z",
  title: "Draft — Oak Street Retail Pad",
  summary: "Small retail pad near a grocery-anchored center. Still being underwritten.",
  status: "draft",
  propertyType: "retail",
  address: {
    line1: "88 Oak St",
    city: "Dallas",
    region: "TX",
    postalCode: "75201",
    country: "US",
  },
  financials: {
    askingPrice: 980000,
    currency: "USD",
  },
  contacts: [
    {
      id: "ctc_1001",
      fullName: "Jordan Lee",
      role: "broker",
      email: "jordan.lee@example.com",
    },
  ],
  primaryContactId: "ctc_1001",
  ownership: {
    ownerName: "PREI Draft Vehicles LLC",
    relationship: "primary_owner",
    contactId: "ctc_1001",
  },
}

/** Published multifamily — full nested shapes, including optional suite and rates. */
export const samplePublishedListing: InvestorListing = {
  id: "lst_1002",
  createdAt: "2026-02-10T14:00:00Z",
  updatedAt: "2026-03-15T16:30:00Z",
  title: "Riverfront Multifamily — 24 Units",
  summary: "Value-add multifamily near transit with in-place cash flow and unit upside.",
  status: "published",
  propertyType: "multifamily",
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
    currency: "USD",
    projectedIrrPercent: 12.5,
    capRatePercent: 5.8,
  },
  contacts: [
    {
      id: "ctc_1002",
      fullName: "Jordan Lee",
      role: "broker",
      email: "jordan.lee@example.com",
      phone: "+1-512-555-0142",
    },
    {
      id: "ctc_1003",
      fullName: "Morgan Patel",
      role: "owner_rep",
      email: "morgan.patel@example.com",
    },
  ],
  primaryContactId: "ctc_1002",
  ownership: {
    ownerName: "PREI Riverfront Holdings LLC",
    relationship: "primary_owner",
    contactId: "ctc_1003",
    ownershipPercent: 100,
  },
}

/** Under-offer industrial — PREIshare equivalent of the tutorial under-contract branch. */
export const sampleUnderOfferListing: InvestorListing = {
  id: "lst_1003",
  createdAt: "2026-01-20T11:00:00Z",
  updatedAt: "2026-03-18T13:45:00Z",
  title: "Cedar Industrial — Under Offer",
  summary: "Last-mile warehouse with a signed LOI. Still shown as an active investor deal.",
  status: "under_offer",
  propertyType: "industrial",
  address: {
    line1: "4500 Cedar Blvd",
    city: "Houston",
    region: "TX",
    postalCode: "77002",
    country: "US",
  },
  financials: {
    askingPrice: 6100000,
    currency: "USD",
    capRatePercent: 6.4,
  },
  contacts: [
    {
      id: "ctc_1004",
      fullName: "Sam Rivera",
      role: "broker",
      email: "sam.rivera@example.com",
      phone: "+1-713-555-0198",
    },
  ],
  primaryContactId: "ctc_1004",
  ownership: {
    ownerName: "PREI Cedar JV",
    relationship: "co_owner",
    contactId: "ctc_1004",
    notes: "JV split; remaining interest held by a local operating partner.",
    ownershipPercent: 60,
  },
}

/** Sold office — closed-deal branch; closedAt is required only here. */
export const sampleSoldListing: InvestorListing = {
  id: "lst_1004",
  createdAt: "2025-09-01T08:00:00Z",
  updatedAt: "2026-02-28T17:00:00Z",
  title: "Summit Office — Sold",
  summary: "Closed office sale retained for history and comparable analysis.",
  status: "sold",
  propertyType: "office",
  address: {
    line1: "1 Summit Plaza",
    city: "San Antonio",
    region: "TX",
    postalCode: "78205",
    country: "US",
  },
  financials: {
    askingPrice: 2750000,
    currency: "USD",
    projectedIrrPercent: 9.1,
    capRatePercent: 7.2,
  },
  contacts: [
    {
      id: "ctc_1005",
      fullName: "Alex Chen",
      role: "owner_rep",
      email: "alex.chen@example.com",
    },
  ],
  primaryContactId: "ctc_1005",
  ownership: {
    ownerName: "PREI Summit LLC",
    relationship: "primary_owner",
    contactId: "ctc_1005",
    ownershipPercent: 100,
  },
  closedAt: "2026-02-28T17:00:00Z",
}

/** Archived mixed-use — removed from browse, same field names as live listings. */
export const sampleArchivedListing: InvestorListing = {
  id: "lst_1005",
  createdAt: "2025-06-12T12:00:00Z",
  updatedAt: "2026-03-01T10:00:00Z",
  title: "Harbor Mixed-Use — Archived",
  summary: "Withdrawn mixed-use offering. Kept on file; not shown to investors.",
  status: "archived",
  propertyType: "mixed_use",
  address: {
    line1: "210 Harbor Way",
    line2: "Building B",
    city: "Tampa",
    region: "FL",
    postalCode: "33602",
    country: "US",
  },
  financials: {
    askingPrice: 8900000,
    currency: "USD",
  },
  contacts: [
    {
      id: "ctc_1006",
      fullName: "Riley Nguyen",
      role: "broker",
      email: "riley.nguyen@example.com",
      phone: "+1-813-555-0160",
    },
  ],
  primaryContactId: "ctc_1006",
  ownership: {
    ownerName: "Harbor Way Partners",
    relationship: "property_manager",
    notes: "Archived after the seller paused the process.",
  },
}

/** All valid samples — useful for later UI mocks and typecheck scripts. */
export const sampleInvestorListings: InvestorListing[] = [
  sampleDraftListing,
  samplePublishedListing,
  sampleUnderOfferListing,
  sampleSoldListing,
  sampleArchivedListing,
]
