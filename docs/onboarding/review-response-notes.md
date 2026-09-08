# Review response notes — first PREIshare PR

## PR under review
- Branch name: `docs/first-contribution-aterry04`
- PR title (after any edits): `docs: add onboarding contributor entry for aterry04`
- Link or local identifier: https://github.com/EdTechForLearning/PREIShare-org-repo/compare/main...aterry04:PREIShare-org-repo:docs/first-contribution-aterry04 (replace with `/pull/N` once the GitHub PR exists)
- Related files: `CONTRIBUTORS.md`, `docs/onboarding/pr-description.md`, `docs/onboarding/first-contribution-notes.md`

## Simulated reviewer setup
- Tool used (chat-assistant / coding-agent): chat-assistant role-play as a kind but strict PREIshare mentor, then coding-agent for the smallest file fixes
- What context I pasted for the reviewer: full `docs/onboarding/pr-description.md`, `CONTRIBUTORS.md`, and a summary of `docs/onboarding/first-contribution-notes.md` (cycles, allowed paths, no `src/` edits)
- Date of simulation: 2026-09-08

## Feedback received

### Comment 1
- **Theme:** PR clarity
- **Blocking?** yes
- **Reviewer said:** The **PR URL** field is still an HTML comment (`<!-- paste after opening, e.g. https://github.com/EdTechForLearning/PREIShare-org-repo/pull/N -->`). A mentor who only has the onboarding folder cannot open a live review thread or confirm the cross-fork direction.
- **My decision:** accept-now
- **Why:** A first PR record without a locatable compare/PR link fails Step 12 and Step 13 handoff. Inventing a `/pull/N` number would be dishonest; using the real compare URL is enough until GitHub assigns a number.
- **Action taken:** edit PR description
- **Evidence:** `docs/onboarding/pr-description.md` now sets **PR URL** to the cross-fork compare link `.../compare/main...aterry04:PREIShare-org-repo:docs/first-contribution-aterry04`, with a note to replace it with `/pull/N` after open.

### Comment 2
- **Theme:** verification
- **Blocking?** yes
- **Reviewer said:** Test plan step 1 says “confirm only the expected path(s) appear (`CONTRIBUTORS.md`, `README.md`, and any onboarding markdown you intentionally staged`).” “Any onboarding markdown you intentionally staged” is not something a reviewer can pass/fail. Name the exact allow-list.
- **My decision:** accept-now
- **Why:** The plan already named files. The PR text was vaguer than the plan, which is the opposite of what a reviewer needs.
- **Action taken:** edit PR description
- **Evidence:** Test plan step 1 now lists `CONTRIBUTORS.md`, `README.md`, `docs/onboarding/first-contribution-notes.md`, `docs/onboarding/pr-description.md`, and `docs/onboarding/review-response-notes.md`, and says to reject the PR if `src/`, `package-lock.json`, or `.env` appear.

### Comment 3
- **Theme:** PR clarity
- **Blocking?** yes
- **Reviewer said:** Every box under **What reviewers should look at** and **Checklist before requesting review** is unchecked. That reads as “I wrote a test plan I have not run,” which is a merge blocker for a first contribution.
- **My decision:** accept-now
- **Why:** Content checks we actually performed (roster accuracy, README append-only, no secrets, specific title) should be marked done. GitHub push/cross-fork confirmation still belongs to the clone operator, so those two boxes stay unchecked until they are true on GitHub.
- **Action taken:** edit PR description
- **Evidence:** Content checkboxes in `pr-description.md` are now `[x]`. Push and cross-fork boxes remain `[ ]` until confirmed on the Windows clone.

### Comment 4
- **Theme:** scope
- **Blocking?** no
- **Reviewer said:** “Consider shipping only `CONTRIBUTORS.md` and dropping the `README.md` pointer so the first PR is a single file.”
- **My decision:** decline
- **Why:** `docs/onboarding/first-contribution-plan.md` explicitly allowed one second touch: append-only `README.md`. Removing it would change the agreed contract, not fix a defect. The README hunk must stay an append; a rewrite of install steps would be blocking if it appeared.
- **Action taken:** none (no file removed)
- **Evidence:** N/A — README Contributors section retained; decline documented here so it is not silent.

### Comment 5
- **Theme:** other (roster usability / commits)
- **Blocking?** no
- **Reviewer said:** The HTML comment `<!-- Add a new row... -->` in `CONTRIBUTORS.md` does not show on GitHub’s rendered Markdown. The next onboarding engineer may not see the instruction.
- **My decision:** accept-now
- **Why:** Replacing the HTML comment with a visible one-line instruction is a smallest-diff docs fix inside the allowed file. It does not add fake contributors or secrets.
- **Action taken:** follow-up commit
- **Evidence:** `CONTRIBUTORS.md` now ends with the visible sentence “Add a new row for yourself. Do not remove existing contributors.”

## Follow-up commits (if any)
| Commit message | Files touched | Addresses which comment # |
| --- | --- | --- |
| `docs: address simulated review on first-PR artifacts` | `CONTRIBUTORS.md`, `docs/onboarding/pr-description.md`, `docs/onboarding/review-response-notes.md` | 1, 2, 3, 5 |

Comment 4 produced no commit (declined as out of contract).

## PR description edits (if any)
- Sections changed (summary / test plan / risk / other): PR URL, What reviewers should look at, Test plan (exact paths), new Risk section, Checklist (honest ticks)
- Before → after: URL was an HTML placeholder → compare-across-forks URL; test plan said “any onboarding markdown you intentionally staged” → named allow-list plus reject paths; all checkboxes empty → content checks ticked, GitHub push/cross-fork left for the clone
- Why the edit helps a reviewer: they can find the branch, know which files must appear, and see which checks are already done vs still on the author

## Re-verification checklist
- [x] Same feature branch **name** as the plan: `docs/first-contribution-aterry04` (create/checkout that branch on the Windows clone before pushing; this Cursor workspace tracks onboarding files on `main` for the cloud record)
- [ ] Latest commits pushed; PR shows updated head — **do this on the clone:** `git push origin docs/first-contribution-aterry04`
- [x] Diff includes only intended onboarding files (roster, README append, onboarding markdown). No `src/` or lockfile edits in this review cycle
- [x] No secrets, `.env` values, or API keys added (GitHub handle only in `CONTRIBUTORS.md`)
- [x] Manual checks claimed in the PR still pass: table renders; README append is still at the bottom; no `npm` instruction rewrite in this workspace README
- [x] Blocking comments (1–3) all have a written resolution
- [x] Non-blocking items: #5 fixed; #4 parked with a scope reason

## Merge-readiness statement
From a beginner-onboarding perspective, the **content** of this PR is ready: one real contributor row, an append-only README pointer, a test plan a reviewer can execute on the Files changed tab, and every blocking comment resolved or declined in writing. It is **not** merge-ready until the learner pushes these follow-up files on `docs/first-contribution-aterry04` to `origin` (the fork), opens or updates the **cross-fork** PR against `EdTechForLearning/PREIShare-org-repo:main`, and pastes the live `/pull/N` URL into `pr-description.md`. A human mentor should still double-check those four GitHub compare fields and that the clone’s TanStack `README.md` was appended, not replaced.

## What I learned about review culture
- One habit I will keep: triage every comment as accept-now, accept-later, or decline with a plan-based reason—never ignore.
- One mistake I will avoid next time: shipping a PR description with an empty URL and a test plan that says “whatever I staged” instead of an exact file list.
