# Sprint 2 Topic 1 — Types Handoff: PREIshare Investor Listings

**Audience:** next sprint topic owners, PREIshare eng, product partners  
**Status:** Topic 1 (TypeScript foundations) complete — implementation topics not started  
**Date:** 2026-09-19

## 1. Client story recap

PREIshare was shipping investor listing data as loose objects and ad-hoc JSON.
That let bad data reach production: missing prices, status strings spelled
several ways, and nested address fields that disappeared on some screens.
Sprint 2 Topic 1 modeled investor listings with **strict TypeScript types** so
those mistakes fail at **compile time** (while the developer is still building)
instead of in front of users.

The data model is typed and verified. Product surfaces are next.

## 2. What we shipped this topic

| Deliverable | Path | Why it matters |
| --- | --- | --- |
| Domain brief + field inventory | `docs/domain/investor-listing-domain-brief.md`, `docs/domain/listing-field-inventory.md` | Business rules before code (`published` / `sold`, not sample `active` / `closed`) |
| Types package (barrel) | `src/types/index.ts` | Single import surface for `InvestorListing` and related types |
| Core + nested + relationship types | `src/types/*.ts` | Interfaces, string unions, nested `Address` / `FinancialSummary`, contacts, ownership |
| Valid fixtures | `src/fixtures/sample-investor-listings.ts` | Prove good listings type-check for every `ListingStatus` |
| Invalid / error cases + expected errors | `src/fixtures/invalid-listings.errors.ts`, `docs/type-safety/expected-type-errors.md` | Prove bad data is rejected |
| Typecheck script + verification checklist | `package.json` (`npm run typecheck` → `tsc --noEmit`), `docs/type-safety/verification-checklist.md` | Repeatable safety gate; intentional errors are excluded from the clean run |
| Decision record | `docs/decisions/ADR-001-investor-listing-types.md` | Stakeholder-facing type decisions |

**How to verify locally:** walk `docs/type-safety/verification-checklist.md` and
run `npm run typecheck` from the project root. Valid fixtures must pass.
Intentional invalid cases must remain type errors as documented; they are not
part of the clean gate.

Do not copy ADR-001 into this file. Read it for the mapping of business rules
to types.

## 3. What we must NOT claim is done yet

- No TanStack Start UI or listing forms are built or wired to these types.
- No Supabase / PostgreSQL tables, migrations, or pgvector work from this model.
- No HTTP API routes, request/response validation at the network boundary, or
  auth rules.
- No runtime schema library (for example Zod) is required by this topic.
- No production deployment of listing create/edit flows.

If a demo only shows green typecheck on fixtures, say: **“the data model is
typed and verified; product surfaces are next.”**

## 4. Next sprint pickups (use the types — do not reinvent them)

### A. TanStack Start forms (UI)

- Build create/edit listing forms whose field names and option lists match
  `InvestorListing`, `ListingStatus`, and `PropertyType` from `src/types`.
- Prefer importing types from `src/types/index.ts` rather than copying string
  literals into components.
- Use `src/fixtures/sample-investor-listings.ts` as realistic form defaults /
  Story-style examples.
- Acceptance sketch: a form cannot submit a status outside the union without a
  type or validation failure during development.

### B. Supabase / PostgreSQL schema alignment (data)

- Draft table columns that mirror required listing fields, nested address /
  financial concepts (as columns or related tables), and constrained status /
  property-type values.
- Document any intentional difference between TypeScript optional fields and
  database NULL rules in a follow-up ADR—do not silently diverge.
- Plan indexes and relationships (contacts, ownership) from the same domain
  brief that drove the types.
- Acceptance sketch: a row that would fail `InvestorListing` assignment is also
  rejected by DB constraints or insert validation.

### C. API boundaries (server)

- Define request/response shapes for list/get/create/update that re-export or
  compose types from `src/types/index.ts` instead of anonymous JSON.
- Keep write endpoints from accepting free-form status strings; align with the
  same unions tightened in Topic 1.
- Add tests that send fixture-shaped payloads (valid) and known-bad payloads
  (invalid) at the boundary.
- Acceptance sketch: API handlers never widen listing status back to plain
  `string` without an explicit, documented escape hatch.

```text
Client pain (loose JSON)
        |
        v
 Domain brief + field inventory
        |
        v
 Strict TS types + fixtures + typecheck + ADR-001   <-- you are here
        |
        +--> TanStack Start forms (UI)
        +--> Supabase/PostgreSQL schema (data)
        +--> API routes & validation (boundary)
```

## 5. Prompting and review self-assessment

- **Prompting habit that helped:** I pointed the agent at
  `docs/domain/listing-field-inventory.md` and the current
  `src/types/investor-listing.ts` instead of the tutorial sample shapes. That
  kept statuses as `draft` / `published` / `under_offer` / `sold` / `archived`
  and address fields as `line1` / `region`, not `active` / `closed` / `street`.
- **Second prompting habit that helped:** I told the agent not to replace the
  existing TanStack `package.json` or `tsconfig.json`—only add
  `"typecheck": "tsc --noEmit"` and exclude
  `src/fixtures/invalid-listings.errors.ts` from the default compile set.
- **Review habit that caught an agent mistake:** I asked what `address.city`
  being nested actually meant, and whether fixtures required an `index.ts`
  change, instead of assuming a green compile meant the model matched PREIshare.
  I also compared nested names to the inventory so tutorial fields (`noi`,
  `listing_agent`) did not land in our types.
- **What I would do differently next topic:** Copy each new file into the clone
  and commit there before PAUL checks, so the checker does not look at an
  unrelated `vite.config.ts` commit. Walk the verification checklist on the
  clone, not only in the agent workspace.
- **Confidence (1–5) explaining InvestorListing to a teammate:** 4 — I can
  explain required address vs optional return metrics, why `sold` needs
  `closedAt`, and that forms/DB/API are not done. I would still keep ADR-001
  open for the exact union members.

## 6. Handoff checklist for the next owner

- [ ] Read ADR-001 and this handoff before opening a UI or SQL PR
- [ ] Import listing types from `src/types/index.ts` only
- [ ] Keep `npm run typecheck` green on valid fixtures
- [ ] Do not delete intentional invalid fixture files; they document safety
- [ ] File a new ADR if product changes allowed statuses or required fields
