# Expected type errors for invalid investor listings

`src/fixtures/invalid-listings.errors.ts` is supposed to fail typechecking.
Do not “fix” those errors. Update this table if you add or remove cases.

Happy-path samples live in `src/fixtures/sample-investor-listings.ts` and must
stay valid.

| id | business problem | rule that should catch it | expected TS kind |
| --- | --- | --- | --- |
| `invalidStatusSpelling` | A status typo (`availble`) would break filters and hide the listing from the right queue | `ListingStatus` string union (`draft`, `published`, `under_offer`, `sold`, `archived`) | invalid string literal |
| `missingAddressCity` | Investors and maps cannot place a pin without a city | `Address.city` is a required string | missing property |
| `priceAsString` | Asking price must be numeric so totals, sorts, and cap-rate math work | `FinancialSummary.askingPrice: number` | type not assignable (`string` vs `number`) |
| `invalidContactRole` | Roles like `listing_agent` are not in PREIshare’s contact list, so screens could not label the person | `ContactRole` union (`broker` \| `owner_rep`) | invalid string literal |
| `soldMissingClosedAt` | A sold (closed) deal with no close date looks still open in history views | Discriminated union: `status: "sold"` requires `closedAt: string` | missing property |
| `emptyPublishedContacts` | A published listing with nobody to call is not shareable with investors | Published / under_offer / sold require a non-empty `contacts` tuple | source has fewer elements than target / not assignable to non-empty contacts |

## How to read the invalid file

Each export is annotated `: InvestorListing` so TypeScript must check it.
There is no `any`, no `@ts-ignore`, and no `as InvestorListing`.

Red squiggles in the editor are the proof. A later typecheck script can treat
those failures as expected; until then, `npm run typecheck` will report them.

## Hole hunt (gaps the types still cannot catch)

These match real PREIshare concerns but are not encoded as TypeScript errors
yet. Do not invent extra legal structures to “fix” them in this step.

| gap | why it still typechecks | what would catch it later |
| --- | --- | --- |
| `primaryContactId` that is not in `contacts` | `primaryContactId` is a `string`; TypeScript cannot prove array membership | runtime validation when saving a listing |
| `ownershipPercent` of `150` or `-5` | the field is `number`, not a 0–100 range | runtime check or a later branded number, not this model |
| empty `contacts` on `draft` / `archived` | the brief allows incomplete drafts | keep allowed; publish-time rules already cover live statuses |
| `closedAt` that is not a real datetime | it is a `string`, not a parsed date | format check in forms/API |

Tightening in this step: published, under_offer, and sold listings now require
at least one contact. That matches the field inventory. Valid fixtures already
had contacts, so the happy path still compiles.
