# PREIshare review overlay brief

This note names the human layer that sits on top of the check we already have. It does not rebuild that check.

## Words we will use

- **Pull request:** A pull request is a proposal to change the shared project. It is not part of the main copy until a person accepts it.
- **CI check:** A CI check is the automatic run of install, lint, typecheck, test, and build. A green check means those commands passed. It is not permission to merge.
- **Merge:** A merge is a person accepting the proposal so the change becomes part of the main shared copy, usually the branch named `main`.
- **Review comment:** A review comment is a note left on the proposal. A comment is not an approval, and it is not a merge.

## What topic 1 already finished

These files are done and working. This topic does not set them up again.

- Existing workflow (do not create another): `.github/workflows/pr-ci.yml`
- What that check already runs: install, lint, typecheck, test, and build
- Branch-protection notes already written: `docs/ci/branch-protection-checklist.md`
- Prompt pack already drafted (refine this file later; do not invent a new name): `docs/ci/ai-pr-review-prompts.md`
- Verification log already written: `docs/ci/e2e-verification-log.md`
- Stakeholder handoff already written: `docs/ci/stakeholder-handoff.md`
- Hosting: keep the existing Production URL. Do not create a new hosting project.

## What this topic adds

Later steps will write these. This brief only names them.

1. Who may approve a pull request, and who may merge it
2. A constrained system instruction with a required output shape, edited later inside `docs/ci/ai-pr-review-prompts.md`
3. A human-judgment checklist
4. A practice review on a sample pull request
5. An honest record of which branch-protection rules the GitHub plan actually saved

## What this topic will not rebuild

- No second workflow file
- No second CI design and no second dashboard inventory
- No second prompt-pack filename
- No new hosting project
- No claim that a green CI check is permission to merge

## Risks a green check cannot decide

- **Sign-in:** Sign-in is who is allowed to be logged in. A passing test does not decide that, because the commands can pass while a change lets the wrong person in.
- **Money:** Money means charges, payments, or money records. A passing test does not decide that, because the commands do not judge whether a charge is correct.
- **Privacy:** Privacy means member information, such as an email, stays with only the people who should see it. A passing test can miss a change that shows that information to the wrong people.
- **Product intent:** Product intent is whether the change still matches what PREIshare is for. A passing test does not decide that, because the commands do not know the product goal.

## Who is allowed to decide

- The AI may suggest findings in a review comment.
- The AI may not approve a pull request.
- The AI may not merge a pull request.
- A person approves. A person merges.

## How we will direct the agent

We plan what the file must say, let the agent draft only `docs/ci/ai-review-overlay-brief.md`, then check the draft against this list. If something required is missing, we ask for one revision of this same file. We do not edit `.github/workflows/pr-ci.yml` or add another prompt pack in this step.
