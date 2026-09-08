# PREIshare team orientation notes

Author: Alexis Terry
Date: 2026-09-05

## 0. Team repository of record

- **Team repo (upstream):** https://github.com/EdTechForLearning/PREIShare-org-repo
- **My fork (created in Step 3):** https://github.com/aterry04/PREIShare-org-repo
- I contribute by forking this repo and opening pull requests from my fork. I do not push to the team repo directly.

## 1. Product mission (my words)

PREIshare is a real-estate intelligence product: it takes property and market
information and turns it into something a person can actually use when deciding
where to live, buy, or invest. The engineering team owns the shared web app
that delivers that intelligence, so a careless edit on the shared line of work
can break the product for everyone. My first job is to join that shipping loop
safely—small change, reviewed, then merged—not to rebuild the product on day one.

## 2. Everyday collaboration → engineering workflow

I already know this pattern from school or work: you do not overwrite the final
shared document. You make a draft, someone checks it, then it goes live.

| Everyday picture | PREIshare engineering parallel |
| --- | --- |
| The class or team’s final shared document | The shared default branch on the team repository |
| My own draft copy of that document | My feature branch with one small, focused change |
| Save history / version notes on the draft | Commits with messages that say what changed and why |
| Ask a peer to review before we publish | Open a pull request (PR) so someone can review the diff |
| Peer says it looks good, then we publish | Review passes, then the pull request can merge |

## 3. Actors in a pull-request workflow

- **Contributor (me):** chooses a tiny, safe change; works on a separate branch; writes a clear description; answers review comments.
- **Reviewer (teammate or simulated reviewer):** reads the diff for correctness, scope, and clarity before anything joins the shared project.
- **Shared repository:** the team’s source of truth on GitHub. Even if a tool would let me edit the default branch, the process is: branch → pull request → review → merge.
- **Automation (later):** optional checks such as GitHub Actions may run on the PR. If a check fails, I treat it as a blocker, not background noise.

## 4. First-PR definition of done (beginner-safe)

My first reviewed PR is done only when all of the following are true (a reviewer
could answer yes or no to each item):

1. **Scoped:** The change is small on purpose—onboarding docs or a contributors
   list is the right size. It is not a multi-feature rewrite.
2. **Isolated:** I made the work on a feature branch. I did not edit the shared
   default branch directly.
3. **Described:** The PR says why the change exists, which files changed, and
   how a reviewer can verify it without extra guesswork.
4. **Reviewable:** A teammate can understand the diff from the PR alone. Notes
   capture decisions and any follow-ups.
5. **Verified:** I re-read the diff myself and fixed obvious mistakes before
   asking for review.
6. **Aligned:** The change matches the team conventions I will learn in later
   steps (repo map, AI rules, software engineering best practices).

## 5. Out of scope for the first PR

- Large refactors, dependency upgrades, or database schema changes
- Secrets, production credentials, or real customer data
- “While I was here” unrelated edits that make the review bigger and riskier

## 6. How I will use AI on this team

I will prompt agents in small cycles: understand → plan → prompt → review → refine.
I will not paste secrets into agents. I will not accept agent output I cannot
explain to a teammate in plain speech.

Orientation is complete when I can answer three questions without the tutorial
open: What is PREIshare? Who is in the pull-request loop? When is my first PR
actually done?
