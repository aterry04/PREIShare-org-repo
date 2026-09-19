# Listing Field Inventory (PREIshare)

Use this table as the source of truth for the listing shape. Field names are
suggestions later steps may adopt; meanings and shapes are mandatory.

## Identity and classification
| Field | Meaning | Shape | Required? | Example / allowed values |
| --- | --- | --- | --- | --- |
| id | Stable unique id for the listing | text | yes | `lst_1001` |
| title | Short name shown to investors | text | yes | `Riverfront Multifamily Offering` |
| description | Longer investor-facing summary | text | yes for `published`, `under_offer`, and `sold`; optional for `draft` and `archived` | `Value-add asset near transit...` |
| status | Lifecycle state | fixed choice | yes | `draft`, `published`, `under_offer`, `sold`, `archived` |
| propertyType | Asset class | fixed choice | yes | `multifamily`, `office`, `retail`, `industrial`, `mixed_use`, `land` |
| createdAt | When the listing record was created | datetime text | yes | `2026-03-01T10:00:00Z` |
| updatedAt | Last meaningful edit | datetime text | yes | `2026-03-15T16:30:00Z` |

## Address (nested object)
| Field | Meaning | Shape | Required? | Example |
| --- | --- | --- | --- | --- |
| address.line1 | Street number and name | text | yes | `500 River Rd` |
| address.line2 | Unit/suite (if any) | text | no | `Suite 200` |
| address.city | City | text | yes | `Austin` |
| address.region | State/province/region | text | yes | `TX` |
| address.postalCode | Postal code | text | yes | `78701` |
| address.country | Country code or name | text | yes | `US` |

## Financial summary (nested object)
| Field | Meaning | Shape | Required? | Example |
| --- | --- | --- | --- | --- |
| financials.askingPrice | Listed price amount | number | yes | `12500000` |
| financials.currency | Currency code | fixed choice | yes | `USD` |
| financials.projectedIrrPercent | Optional projected IRR | number | no | `12.5` |
| financials.capRatePercent | Optional cap rate | number | no | `5.8` |

## Investor contacts (list of nested objects)
| Field | Meaning | Shape | Required? | Example |
| --- | --- | --- | --- | --- |
| contacts[].name | Person or firm name | text | yes (each contact) | `Jordan Lee` |
| contacts[].role | Why they appear on the listing | fixed choice | yes | `broker`, `owner_rep` |
| contacts[].email | Email if used | text | at least one of email or phone required per contact | `jordan@example.com` |
| contacts[].phone | Phone if used | text | at least one of email or phone required per contact | `+1-512-555-0142` |

A published, under-offer, or sold listing must have **at least one** contact in this list.

## Ownership (list tied to contacts)
| Field | Meaning | Shape | Required? | Example |
| --- | --- | --- | --- | --- |
| ownership[].contactNameOrId | Which contact the row refers to | text | yes | `Jordan Lee` or a contact id |
| ownership[].relationship | Relationship to the asset | fixed choice | yes | `primary_owner`, `co_owner`, `broker`, `property_manager` |
| ownership[].sharePercent | Optional ownership share | number | no | `60` |

## Closed lists (not free text)
- **status:** `draft`, `published`, `under_offer`, `sold`, `archived`
- **propertyType:** `multifamily`, `office`, `retail`, `industrial`, `mixed_use`, `land`
- **financials.currency:** `USD` (add more codes only by updating this inventory)
- **contacts[].role:** `broker`, `owner_rep`
- **ownership[].relationship:** `primary_owner`, `co_owner`, `broker`, `property_manager`

## Inventory rules (must hold)
1. Do not invent extra top-level groups beyond identity, address, financials, contacts, and ownership without updating the domain brief.
2. Status and propertyType must remain closed lists—never free text.
3. Address and financials are nested objects, not flat optional strings only.
4. Contacts are a list (array); a valid published listing needs at least one contact.
5. Every required field above must appear in later typed listing definitions unless a decision record deliberately relaxes it.
6. Do not replace these groups with a catch-all such as “details” or “metadata.”
