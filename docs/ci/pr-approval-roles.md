# PREIshare pull request approval roles

This file says who may do each job on a PREIshare pull request. It follows `docs/ci/ai-review-overlay-brief.md`. It does not start a new project. It does not edit `.github/workflows/pr-ci.yml`. It does not rewrite the review prompt pack.

## Two words, defined before the rules

**Approve** means a human has read the proposal and accepts it. Approve is a review decision. It does not put the change into the shared project by itself.

**Merge** means a human combines the accepted proposal into the shared branch, usually `main`, so the change becomes part of PREIshare for everyone.

Approve is not merge. A green pr-ci check is not approve, and it is not merge. The green check only shows that install, lint, typecheck, test, and build passed.

## The four roles

| Role | Who (name or job you can point to) | May do | Must not do |
| --- | --- | --- | --- |
| Author | The GitHub account shown as the author of that pull request | Open the pull request and update it after feedback | Be the only human who approves, or merge alone, when the change touches privacy, sign-in, or money |
| Human reviewer | Alexis Terry | Read the change, comment, approve, or request changes | Hand the approve button to the AI assistant |
| Maintainer | Alexis Terry | Merge only after Alexis Terry's human approval and the existing pr-ci check | Merge because an AI comment said the change looks fine |
| AI assistant | The chat assistant used as an advisor, following `docs/ci/ai-pr-review-prompts.md` | Comment with suggested notes for Alexis Terry | Approve, request changes as if it were a GitHub reviewer, or merge |

Alexis Terry is both the human reviewer and the maintainer. The same person reads and approves, then merges. Those are still two jobs. Approve comes first. Merge comes after.

## What the AI assistant may and must not do

The AI assistant may comment. A comment is a note. A note is not a decision.

The AI assistant must not approve.

The AI assistant must not request changes as if it were a GitHub reviewer.

The AI assistant must not merge.

Request changes is an official GitHub review outcome that sends the proposal back to the author. Only Alexis Terry, as the human reviewer, may do that. A small change is not an exception. A note that a member email leak "looks fine" is still only a comment.

## Merge paths

Every allowed path ends with Alexis Terry merging. The AI assistant is never the last actor.

1. The pull request author opens the pull request. The existing pr-ci check in `.github/workflows/pr-ci.yml` runs. Alexis Terry approves. Alexis Terry merges.
2. The pr-ci check fails. The pull request author fixes the proposal. The check passes. Alexis Terry approves. Alexis Terry merges.
3. Alexis Terry requests changes. The pull request author updates the proposal. Alexis Terry approves. Alexis Terry merges.

Forbidden path, not allowed: the AI assistant comments that the change looks fine, and the proposal is merged with no approval from Alexis Terry.

## Aligned with branch protection, not applied yet

This map agrees with `docs/ci/branch-protection-checklist.md`.

Intended gates, already described in that checklist, and restated here in plain language:

- The pr-ci check should be required before merge. The checklist names that check `PR CI / Quality checks`.
- A human approval should be required before merge. On this map, that approval is Alexis Terry's.

This document does not change GitHub settings. It does not turn branch protection on or off. It does not edit `.github/workflows/pr-ci.yml`. A later step records what the repository plan actually enforced.

## Accountability

If a bad change is merged, the person who answers is Alexis Terry, after Alexis Terry approved. The AI assistant does not answer for the merge.
