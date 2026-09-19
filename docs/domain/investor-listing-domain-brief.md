# Investor Listing Domain Brief (PREIshare)

## Purpose
Define what an investor listing is in PREIshare business language so later typed
listing work matches real workflows—not invented fields. An investor listing is a property
opportunity record that investors can review: identity, lifecycle status, property
class, a nested street address, money summary numbers, and one or more contacts
with ownership relationships.

## Actors
- **Listing editor (internal ops)** — creates and updates listings before investors see them.
- **Investor (end user)** — browses published listings and relies on complete, consistent data.
- **Reviewer / compliance** — checks that status, price, and contact info are trustworthy before publish.
- **Future systems** — website UI, API, and database will all read the same listing shape.

## Business goals
- One shared definition of a listing across screens and teammates.
- Catch missing or invalid data before production (at compile time once types exist).
- Support nested real-world data: address, financial summary, investor contacts, ownership.
- Stop production bugs such as a missing asking price, three spellings of the same
  status, or an address that disappears on one screen.

## Listing lifecycle statuses (allowed values only)
- `draft` — internal only; not visible to investors.
- `published` — visible to investors; must meet full validity rules.
- `under_offer` — active interest; still structured like a published listing.
- `sold` — closed deal; retained for history.
- `archived` — removed from active browse; not deleted.

Do not use free-text status. Values such as `Published`, `under offer`, or `active`
are invalid.

## Nested data groups
- **Address** — street line(s), city, region/state, postal code, country.
- **Financial summary** — asking price, currency, optional projected return metrics
  the team agrees to track (projected IRR percent, cap rate percent).
- **Investor contacts** — one or more people tied to the listing (name, role, email
  or phone). A list, not a single optional name field.
- **Ownership** — how contacts relate to the asset (primary owner, co-owner, broker,
  property manager) and optional ownership share.

## Core identity fields (high level)
- Stable listing id
- Human-readable title
- Property class (fixed set: multifamily, office, retail, industrial, mixed_use, land)
- Status (from the lifecycle list above)
- Short description for investors
- Created and updated timestamps (business concepts; exact format decided later)

## Success criteria — “a valid investor listing”
1. Has a non-empty id and title.
2. Status is exactly one of the allowed lifecycle values (no free-text variants).
3. Property class is exactly one of the allowed property-class values.
4. Address includes enough fields to locate the property (street, city, region/state,
   postal code, country).
5. Financial summary includes a numeric asking price and a currency code.
6. At least one investor contact with a name and a reachable channel (email or phone).
7. Ownership relationship for each contact is from an agreed fixed set (not free text).
8. Optional fields may be absent; required fields above must never be missing for
   `published`, `under_offer`, or `sold`.
9. `draft` and `archived` may be incomplete internally, but they still use the same
   field names and allowed status/property-class values—never a parallel “loose” shape.

## Out of scope for this topic
- Building UI forms, API routes, or database tables.
- Authentication, payments, or document uploads.
- Exact TypeScript syntax (comes in later steps).

## Handoff note
Later steps must honor this brief and the companion field inventory at
`docs/domain/listing-field-inventory.md`. If a later definition allows a status
or field not listed here, that definition is wrong.
