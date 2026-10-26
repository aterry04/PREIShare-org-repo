# PREIshare Sponsor Auth & Property Listings — Security Requirements

## 1. Context

PREIshare sponsors need a dashboard where they can sign in, view property listings they are allowed to manage, and add new properties. Listing rows live in Postgres through Supabase, in the `property_listings` table. A listing belongs to the signed-in sponsor. Secret keys must never ship in the JavaScript the browser downloads.

This file is the contract for later work. A login page that “works” is not enough if one sponsor can read another sponsor’s rows, or if a secret key is visible in the browser.

## 2. Actors

| Actor | Description | Signed in? |
| --- | --- | --- |
| Anonymous visitor | Anyone who has not logged in | No |
| Sponsor | Partner who manages their own listings | Yes (sponsor account) |
| Admin | Internal operator who might moderate every sponsor later | N/A this sprint topic |

The screens may still say “investor” in a few places. The person in this contract is the sponsor. Do not add a second in-scope role.

## 3. User stories (in scope)

1. As a **sponsor**, I can create an account and sign in with email and password so the app knows who I am on later page loads.
2. As a **sponsor**, I can open a protected dashboard and see a list of **only my** properties after sign-in.
3. As a **sponsor**, I can create a new property that is owned by my account, even if the form never sends an owner id.
4. As an **anonymous visitor**, I can open the login page (and the signup page) but I cannot open the dashboard or create, change, or read listing rows.

Default login method for this topic: **email and password**. Magic link, social login, and multi-factor auth are out of scope.

## 4. Non-goals (out of scope this topic)

- Public (anonymous) create, update, or delete of properties
- A public catalog that lets anyone read every published listing
- Full admin console, cross-sponsor moderation, or multi-organization tenancy
- Putting the Supabase **service-role** (secret) key in any client or browser bundle, including under a `VITE_` name
- Password-reset email polish, OAuth social login, or multi-factor auth
- Payments, document uploads, image galleries, pgvector search, and an approvals workflow

## 5. Success criteria

- [ ] A sponsor can sign up and log in with email and password and land on a protected dashboard route (`/dashboard`)
- [ ] A signed-out visitor who opens `/dashboard` or a listings route under it is sent to the login page and does not see listing rows
- [ ] Sign-out clears the session; the same dashboard and listings routes stay blocked afterward
- [ ] The property list returns only rows owned by the signed-in sponsor
- [ ] A second sponsor, signed in separately, does not see the first sponsor’s rows in the UI or in a direct read
- [ ] Creating a property stores the new row in Postgres and shows it again after the page reloads
- [ ] The new row’s owner is the signed-in sponsor. The browser cannot assign the row to someone else by sending another owner id
- [ ] Browser-exposed config uses only the public project URL and the anon (publishable) key. The service-role key stays in server-only environment configuration
- [ ] Listing access is enforced with Postgres Row-Level Security, not only by hiding buttons in React

## 6. Simple threat list

| Threat | What goes wrong | Requirement to mitigate |
| --- | --- | --- |
| Stolen or reused session | Someone else acts as the sponsor until the session ends | Protected routes check the session on the server. Sign-out clears that session. |
| Guessing another sponsor’s property id | Someone reads or edits a listing they do not own because they know its id | Row-Level Security, and the queries behind list/create, deny cross-sponsor access even when the id is known. |
| Leaked service-role key | Someone bypasses Row-Level Security with a key that can read and change every row | The service-role key stays in server environment variables only. It is never placed in client code, a `VITE_` variable, a git commit, or a planning doc. |
| “Security by hiding buttons” | The screen hides edit controls, but a direct request still lists or writes another sponsor’s rows | Enforce the rules in Postgres Row-Level Security and on the server path. Hiding a button is not the control. |

## 7. Environment & secret hygiene notes (requirements only)

Names and purpose only. Do not write real key values in this file.

| Name | Who may see it | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Browser | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Browser | Public anon / publishable key. Safe only together with the user session and Row-Level Security |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Privileged key. Bypasses Row-Level Security. No `VITE_` prefix |
| `SUPABASE_URL` | Server only (optional) | Server-side project URL when it should not depend on the public prefix |

Later steps add `.env.example` (placeholders only) and separate browser and server Supabase clients. Real values belong in an untracked local env file, not in git.

## 8. Open questions for the team

- Login method: **email and password** is the default for the stories above. Magic link is not the plan unless the team changes this note.
- A separate `sponsors` profile table is **not** required for these stories. The listing owner is the signed-in Supabase Auth user id (`owner_id` on `property_listings`). The data-model step can add a profile table later if sponsors need extra profile fields. Do not invent a second listing shape beside the current property listing fields.
- Asset ownership (who owns the building) is different from `owner_id` (who may manage the row). Asset-ownership records stay out of scope.

## 9. How later steps use this brief

This file is the contract for environment separation, Row-Level Security policy design, login and dashboard routes, property list and create flows, and the end-to-end security verification checklist. A later step is done only when its result can be checked against the success criteria and the threat list above.
