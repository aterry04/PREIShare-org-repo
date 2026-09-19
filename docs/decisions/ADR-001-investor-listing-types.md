# ADR-001: Investor listing TypeScript types (PREIshare)

- **Status:** Accepted (Sprint 2, Topic 1)
- **Date:** 2026-09-19
- **Owners:** PREIshare types working group (learner + coach)
- **Related code:** `src/types/index.ts` (barrel export for the types package)

## Context

PREIshare investor listings were previously passed around as loose objects and
ad-hoc JSON. That allowed production bugs such as missing asking prices, status
values spelled several ways, and nested address fields that disappeared on some
screens. Sprint 2 Topic 1 models the listing domain with strict TypeScript types
so invalid shapes fail at compile time—before investors or editors see them.

Business inputs that drove the model:

- Domain brief: `docs/domain/investor-listing-domain-brief.md`
- Field inventory: `docs/domain/listing-field-inventory.md`
- Safety evidence: `docs/type-safety/expected-type-errors.md` and
  `docs/type-safety/verification-checklist.md`

## Decision

We adopt a small, explicit types package centered on `InvestorListing`, with
supporting types for status, property type, address, financial summary, investor
contacts, and ownership. Call sites should import from `src/types/index.ts`
rather than reaching into individual files when possible.

The three largest choices, in plain language:

1. **Closed vocabularies.** Status and property type may only be the exact
   labels the business already agreed on. Free text is rejected.
2. **Nested groups.** Location, money, people, and ownership each travel as
   their own object (or list of objects), not as scattered optional strings on
   the listing.
3. **Status picks extra rules.** A `sold` listing must record `closedAt`.
   Published, under-offer, and sold listings must include at least one contact.
   Listing `id`, `createdAt`, and `updatedAt` are `readonly` so identity is not
   rewritten in ordinary app code.

## Type choices mapped to business rules

| Business rule (plain language) | Type choice | Why this shape |
| --- | --- | --- |
| A listing always has identity, a title, investor-facing copy, timestamps, an address, and a money summary | Required properties on `InvestorListing` / `InvestorListingBase` (`id`, `title`, `summary`, `createdAt`, `updatedAt`, `address`, `financials`). `summary` is the inventory’s `description`. | Optional core fields reintroduce missing-price and missing-pin bugs |
| Listing workflow status may only be a known set of values | `ListingStatus` string union: `draft`, `published`, `under_offer`, `sold`, `archived` | Free `string` allows typos (`availble`) and three spellings of the same status. We did **not** use sample labels such as `active` or `closed`. |
| Property category is a closed vocabulary | `PropertyType` string union: `multifamily`, `office`, `retail`, `industrial`, `mixed_use`, `land` | Same reason as status: closed set, compile-time exhaustiveness |
| Street, city, region, postal code, and country travel together | Nested `Address`: required `line1`, `city`, `region`, `postalCode`, `country`; optional `line2` | Prevents half-present addresses; a listing can always be placed on a map |
| Money rollups are a structured summary, not one anonymous number | Nested `FinancialSummary` on `financials`: required `askingPrice` (`number`) and `currency` (`"USD"`); optional `projectedIrrPercent` and `capRatePercent` | Asking price cannot disappear or become a string; return metrics may arrive later |
| Who to contact about a listing is structured data | `InvestorContact` with `id`, `fullName`, `role` (`broker` \| `owner_rep`), `email`, optional `phone`; listing field `contacts` plus `primaryContactId` | Stops “contact” from being a random name string. Phone may be omitted; email is required in this model |
| Ownership stakes and relationships are first-class | `Ownership` with required `ownerName` and `relationship` (`primary_owner` \| `co_owner` \| `broker` \| `property_manager`); optional `contactId`, `notes`, `ownershipPercent` | Captures how a person or entity relates to the asset |
| A sold (closed) deal must record when it closed | Discriminated union on `status`: `status: "sold"` requires `closedAt: string`; other statuses must not carry a real close date | Stops a sold listing from looking still open, and stops a draft from carrying a fake close date |
| Investors must have someone to call on live deals | Published, `under_offer`, and `sold` require at least one contact; `draft` and `archived` may still have an empty list | Matches the inventory rule that published / under-offer / sold need ≥1 contact |
| Identity and audit stamps are not rewritten after create | `readonly id`, `readonly createdAt`, `readonly updatedAt` on `InvestorListingBase` | Signals immutability intent. Title, price, and contacts stay writable. |

## Alternatives considered

1. **Keep listings as `string` / `any` / untyped JSON**  
   Rejected: fastest short term, but pushes every bug to runtime and production.

2. **One giant flat interface with dozens of optional fields**  
   Rejected: optional everything recreates missing-field bugs; flat shapes hide
   address and financial structure.

3. **Enums (`enum`) for every closed vocabulary**  
   Avoided for this beginner package in favor of string union types, which stay
   simple to read in fixtures and error messages. Revisit only if runtime enum
   objects become a clear need.

4. **Runtime schema library (for example Zod) as the source of truth in this topic**  
   Out of scope for Topic 1. Compile-time types and fixtures come first; runtime
   validators can wrap the same decisions later.

## Consequences

**Positive**

- Invalid listings in `src/fixtures/invalid-listings.errors.ts` show the
  compiler rejecting a bad status, a missing city, a string asking price, a
  made-up contact role, a sold listing without `closedAt`, and a published
  listing with no contacts (see `docs/type-safety/expected-type-errors.md`).
- Valid samples in `src/fixtures/sample-investor-listings.ts` prove a realistic
  listing can be constructed for every `ListingStatus`.
- `npm run typecheck` (`tsc --noEmit`) is the shared gate before review. The
  intentional error file is excluded from that gate so a clean run can pass.

**Tradeoffs**

- Authors must use exact union members; “almost right” status strings fail
  typecheck by design.
- Nested objects mean fixtures and future API mappers must supply whole
  `Address` / `FinancialSummary` objects, not scattered fields.
- TypeScript still cannot prove that `primaryContactId` exists inside
  `contacts`, or that `ownershipPercent` is between 0 and 100. Those remain
  runtime checks (documented as holes in the expected-errors doc).

## Out of scope for Sprint 2 Topic 1

- Database tables, migrations, or Supabase row types
- HTTP API routes and request/response validation at runtime
- React form components and client-side validation UX
- Authentication, authorization, and multi-tenant rules
- pgvector / search indexing fields beyond what the current listing model
  already includes
- Changing production data or deploying a service

## Follow-ups (for the next topic / implementers)

1. Import domain types from `src/types/index.ts` when building UI or API layers.
2. Keep fixtures green under `npm run typecheck` before expanding the model.
3. If product adds a new listing status or property type, extend the **union**
   and update fixtures plus this ADR—do not widen the field back to free
   `string`.
4. Consider runtime validators that mirror these types once API boundaries land
   (especially `primaryContactId` membership and ownership percent range).
5. Use `docs/type-safety/verification-checklist.md` as the acceptance gate when
   types change.

## Evidence links

- Domain brief: `docs/domain/investor-listing-domain-brief.md`
- Field inventory: `docs/domain/listing-field-inventory.md`
- Expected compile errors: `docs/type-safety/expected-type-errors.md`
- Verification checklist: `docs/type-safety/verification-checklist.md`
- Types entrypoint: `src/types/index.ts`
