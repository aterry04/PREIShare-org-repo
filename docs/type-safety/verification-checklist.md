# Investor listing types — verification checklist

Use this list before review. Check each box only when you have evidence.

## A. Domain coverage
- [ ] Every required field from `docs/domain/listing-field-inventory.md` appears on `InvestorListing` (or a nested type it uses): `id`, `title`, `summary` (inventory `description`), `status`, `propertyType`, `createdAt`, `updatedAt`, nested `address`, nested `financials`, `contacts`, `ownership`.
- [ ] Listing status values match the allowed business statuses only: `draft`, `published`, `under_offer`, `sold`, `archived` (no free-form strings, no tutorial `active` / `closed`).
- [ ] Property type values match the allowed property kinds: `multifamily`, `office`, `retail`, `industrial`, `mixed_use`, `land`.
- [ ] Address nested shape matches the inventory: required `line1`, `city`, `region`, `postalCode`, `country`; optional `line2`.
- [ ] FinancialSummary nested shape matches the inventory: required `askingPrice` (number) and `currency` (`USD`); optional `projectedIrrPercent` and `capRatePercent`.
- [ ] Investor contact fields match the brief: `id`, `fullName`, `role` (`broker` | `owner_rep`), `email`, optional `phone`; listings use `contacts: InvestorContact[]` plus `primaryContactId`.
- [ ] Ownership fields match the brief: `ownerName`, `relationship` (`primary_owner` | `co_owner` | `broker` | `property_manager`), optional `contactId`, `notes`, `ownershipPercent`.

## B. Type safety shape
- [ ] Public types are exported from `src/types/index.ts` (`InvestorListing`, `ListingStatus`, `PropertyType`, `Address`, `FinancialSummary`, `InvestorContact`, `Ownership`, and helpers).
- [ ] Discriminated status modeling still matches `docs/type-safety/expected-type-errors.md`: `sold` requires `closedAt`; other statuses do not; published / under_offer / sold require at least one contact.
- [ ] Readonly intent is on identifier/audit fields only: `id`, `createdAt`, `updatedAt` — not on title, price, or contacts.

## C. Fixtures
- [ ] `src/fixtures/sample-investor-listings.ts` typechecks cleanly and includes more than one realistic listing (draft, published, under_offer, sold, archived).
- [ ] `src/fixtures/invalid-listings.errors.ts` still demonstrates the intentional failures listed in `docs/type-safety/expected-type-errors.md`.
- [ ] Expected-error notes still match the real compiler messages (no stale examples, no tutorial field names like `state` or `noi`).

## D. Typecheck gate
- [ ] `package.json` defines a `typecheck` script that runs `tsc --noEmit` (added to the existing scripts object; the rest of `package.json` is unchanged).
- [ ] Running `npm run typecheck` from the project root succeeds for valid sources.
- [ ] `src/fixtures/invalid-listings.errors.ts` is excluded from the default compile set in `tsconfig.json`, so it is not required to pass the normal typecheck gate.
- [ ] `src/types/README.md` explains how a beginner runs typecheck and what success looks like.

## E. Sign-off
- [ ] I re-ran typecheck after any last fixes.
- [ ] I would hand this package to a teammate without a verbal walkthrough of secret steps.
