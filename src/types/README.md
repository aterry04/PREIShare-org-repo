# PREIshare investor listing types

This folder holds **shared TypeScript types** for PREIshare investor listings.

## Why this exists
PREIshare listings must be trustworthy for investors. Loose objects and ad-hoc JSON
let bad data reach production: a missing asking price, a status spelled three
ways, or a nested address field that vanishes on one screen. These types catch
those mistakes at **compile time**—before users see them.

## What belongs here
- Domain type modules only (listing, address, status, contacts, ownership, etc.)
- `index.ts` — barrel file; import from `src/types` instead of individual files
- No UI components, no API route handlers, no database clients
- No sample data (those live in `src/fixtures/`)

## Typecheck

From the project root, run:

```bash
npm run typecheck
```

What success looks like: the command finishes with **no type errors** (exit code 0).
Empty output from `tsc` is success.

Notes for beginners:
- `tsc --noEmit` means “check types only; do not write compiled JavaScript files.”
- Valid sources include `src/types/**` and `src/fixtures/sample-investor-listings.ts`.
- Intentional bad examples live in `src/fixtures/invalid-listings.errors.ts` and are
  documented in `docs/type-safety/expected-type-errors.md`. They are for learning
  and review, not for the clean gate. `tsconfig.json` excludes that file so
  `npm run typecheck` can pass.
- If `tsc` is not found, run `npm install` first (`typescript` is a devDependency).

In an existing PREIshare app `package.json`, **add** `"typecheck": "tsc --noEmit"`
to `scripts`. Do not replace the rest of the file.

## Strict mode (plain language)
`strict: true` in `tsconfig.json` turns on the checker’s safest rules. Combined
with flags like `noUncheckedIndexedAccess`, it refuses incomplete or loosely
typed data so the team can trust shared listing models. Incomplete data fails
the check instead of reaching a live listing.

## Source of truth
Business vocabulary and field rules come from:
`docs/domain/investor-listing-domain-brief.md`
and `docs/domain/listing-field-inventory.md`.