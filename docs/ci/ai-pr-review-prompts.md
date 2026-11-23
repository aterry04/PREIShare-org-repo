# AI-assisted PR review prompt pack (PREIshare)

## Purpose

Use these prompts with a chat assistant or an editor copilot when reviewing a pull request on the PREIshare dashboard. They help a person read a diff faster. They do not replace CI, and they do not replace a human merge decision.

**CI already covers** (`.github/workflows/pr-ci.yml`, `docs/ci/pipeline-design.md`): on a pull request into `main`, `npm ci`, `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build`. Lint only checks that client and route files do not name the service-role key. Tests check a listing-summary rule and one nav helper. They do not log anyone in, call Supabase, or apply SQL.

**Humans still cover:** whether the change matches the product, auth and session behavior, who can read or write a listing, SQL migrations, secrets, and the decision to approve or merge (`docs/ci/pr-pain-and-goals.md`, `docs/ci/project-ci-inventory.md`).

## How to use this pack

1. Open the pull request diff on GitHub, or locally with `git diff main...HEAD`.
2. Paste one prompt below into the assistant.
3. Paste the diff hunks and file paths the prompt asks for. Do not paste the whole repo if a few files are enough.
4. Treat the answer as advice. You still write the GitHub review and decide the merge.
5. Never paste production secrets, `.env` or `.env.local` values, or live credentials into the assistant. Names from `.env.example` are fine. Values are not.

## Boundaries (read before every review)

- The AI is a review assistant, not a reviewer of record.
- The AI must not say approve, LGTM, request-changes-as-a-gate, or merge.
- The AI must not claim CI is green unless the human pastes the check result.
- Only a human PREIshare teammate may approve the pull request and click merge.
- Branch protection is a maintainer setting (`docs/ci/branch-protection-checklist.md`). This pack does not turn it on.

---

## Prompt 1 — Plain-language diff summary

**When to use:** First pass, so you know what changed before a deeper review.

**Copy-paste prompt:**

```text
You are a review assistant for the PREIshare dashboard (TypeScript, TanStack Start, React, Supabase). Summarize the pull request diff I paste below.

Output format:
1. One-sentence goal of the change (best guess from the diff).
2. Bullet list of files touched, grouped by area (UI, routes/server, Supabase/data, config/CI).
3. Bullet list of behavior changes a reviewer should verify by reading or running the app.
4. Open questions for the author (max 5).

Hard rules:
- Do not approve, reject, or recommend merge.
- Do not write LGTM.
- Do not invent files or behavior that are not in the diff.
- If the diff is incomplete, say what else you need.
- Label every claim as observed in diff or inference.
- Do not claim the CI check is green unless I paste a check result.

Diff:
<PASTE DIFF OR FILE HUNKS HERE>
```

---

## Prompt 2 — Risk flags (auth, Supabase, migrations, secrets)

**When to use:** After the summary, when the diff touches login, listings, Supabase clients, SQL, search, embeddings, or env names.

**Copy-paste prompt:**

```text
You are a security-and-data risk assistant for the PREIshare dashboard. Review the diff below ONLY for risk signals. CI already runs npm ci, lint, typecheck, test, and build. Do not repeat style nits or type errors unless they hide one of the risks below.

PREIshare facts you must use. Skip a bucket if the diff does not touch it.
- Auth / session: sponsors sign in with email and password. Dashboard and property routes should send a signed-out visitor to login. Do not invent a new auth provider.
- Supabase access: src/lib/supabase.client.ts is browser-safe and uses VITE_SUPABASE_URL plus VITE_SUPABASE_ANON_KEY. src/lib/supabase.server.ts may create a session client (anon key plus the sponsor access token, so row-level security still applies) or a service-role client. The service-role client bypasses row-level security and is for maintenance only. Listing rows are property_listings. A sponsor should read and write only rows they own (owner_id matches the signed-in user). Anonymous users have no listing policy.
- Migrations / schema: SQL lives in supabase/migrations/*.sql. CI does not apply those files. A new or edited SQL file is a human review item, not a green build.
- Secrets / env: server-only names are SUPABASE_SERVICE_ROLE_KEY, EMBEDDING_API_KEY, EMBEDDING_MODEL, SEED_OWNER_ID, and optional SUPABASE_URL. None of these may use a VITE_ prefix. The pull-request workflow may set only the public placeholders for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. The seed script writes rows and is not a CI step.
- Search: embedding and match_properties calls are not covered by the unit tests. A change that reads every listing with the service-role key is a risk even if build passes.

Flag risks in these buckets (skip a bucket if nothing relevant appears):
- Auth / session / route protection
- Supabase client choice and who can read or write which rows
- Migrations / schema / SQL
- Secrets, env names, service-role usage, embedding key
- Writes that are hard to undo (seed, delete, or a policy that returns every listing)

For each flag output:
- Severity: high | medium | low
- File and rough location
- Why it matters for a PREIshare sponsor or their listing data
- A concrete question the human reviewer should ask
- Label: observed in diff or inference

Hard rules:
- Do not approve or merge.
- Do not write LGTM.
- Do not claim the code is safe.
- If unsure, write needs human verification. Never invent a pass.
- Prefer questions over verdicts.
- Do not ask me to paste secret values.

Diff:
<PASTE DIFF OR FILE HUNKS HERE>
```

---

## Prompt 3 — Human review question checklist

**When to use:** Before you submit the GitHub review, to build a short list for this pull request.

**Copy-paste prompt:**

```text
You help PREIshare reviewers prepare questions. From the pull request description and diff below, write 5–8 questions a human should answer before merging.

Rules for questions:
- Prefer this repo: dashboard screens, TanStack Start routes, sponsor login, property_listings ownership, Supabase row-level security, SQL migrations, search or embeddings, and what happens when a step fails.
- Do not spend a question on "does TypeScript compile?" unless the diff shows a test gap CI will not catch. CI already runs typecheck, lint, test, and build.
- Each question must be answerable by reading the diff, running the app, or asking the author.

Output format:
- Checklist of questions as markdown "- [ ]" items
- Group them: Product / UX, Data and auth, Ops and rollback
- End with this sentence and nothing that softens it: Reminder: only a human may approve or merge this PR.

Hard rules:
- Do not approve, LGTM, or recommend merge.
- Do not speak as a required gate. Speak as a helper.
- Do not claim CI passed unless I paste the check result.

PR description:
<PASTE PR BODY>

Diff:
<PASTE DIFF OR FILE HUNKS HERE>
```

---

## Optional follow-up — Map AI notes back to CI

If the assistant points at something CI should have caught, compare it with `docs/ci/pipeline-design.md` and `.github/workflows/pr-ci.yml`. Known limits, so they are not surprise gaps: lint is not ESLint, tests do not hit Supabase, and build does not prove login or row-level security. File a follow-up for a later sprint if the team wants a new check. Do not drop human review to hide a missing automated check.

## Human merge authority (non-negotiable)

- AI output in this pack is advice only.
- The automated gate is the `PR CI / Quality checks` status check (`docs/ci/branch-protection-checklist.md`). A maintainer still has to require that check. This file does not do that.
- A named human reviewer owns the GitHub review and the merge click.
- If the assistant sounds sure and the diff does not show the evidence, trust the diff and your teammates.
