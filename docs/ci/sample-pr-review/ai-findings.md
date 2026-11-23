# Sample pull request AI findings

This file records one chat-assistant review of the PREIshare sample pull request. It is advisor notes only. It is not a GitHub approval. It does not merge the pull request.

## Run record

- Date: 2026-11-23
- Human who ran the chat: Alexis Terry
- Tool used: chat assistant, in a new chat. A coding agent did not edit the repository for this review.
- Sequence followed: docs/ci/ai-review-orchestration.md
- System instruction source: docs/ci/ai-pr-review-prompts.md
- Sample pull request: https://github.com/aterry04/PREIShare-org-repo/pull/1
- CI before review: green
- CI note: The pr-ci workflow on that pull request finished with status Success for Quality checks at https://github.com/aterry04/PREIShare-org-repo/actions/runs/45290479549. That green result means the commands passed. It does not decide the privacy question.
- Change text pasted: docs/ci/samples/planted-privacy-snippet.ts (the sample diff) and docs/ci/samples/sample-pr-body.md
- Not pasted: secrets, .env files, real member data, the human checklist, and the rest of the repository
- Reply handling: the assistant reply below was pasted unchanged

## Assistant reply

### Review limits

- role: advisor only
- can_approve: no
- can_merge: no
- can_declare_preishare_safe: no

This reply cannot approve the pull request and cannot merge the pull request. A human remains the decision maker.

### Findings

- severity: high
- evidence: docs/ci/samples/planted-privacy-snippet.ts — `export type PublicSharePreview` includes `memberEmail` and `memberPhone`, and `buildPublicSharePreview` sets `memberEmail: member.email` and `memberPhone: member.phone` on a value titled "PREIshare public preview".
- category: privacy
- question_for_human: Should a public share preview include the member email and phone, or should those fields stay off a view meant for people who are not that member?

### Not found

- category: sign-in
- result: not-found
- note: In docs/ci/samples/planted-privacy-snippet.ts I looked for login, logout, or session changes and did not see an issue there.

- category: money
- result: not-found
- note: In docs/ci/samples/planted-privacy-snippet.ts I looked for prices, payments, balances, or refunds and did not see an issue there.

- category: product intent
- result: not-found
- note: In docs/ci/samples/planted-privacy-snippet.ts and docs/ci/samples/sample-pr-body.md I looked for a new audience or a new product job and did not see an issue there.

## Shape check

Compare the pasted reply to the required output shape in docs/ci/ai-pr-review-prompts.md. The reply above was not rewritten in this section.

- Required heading: Review limits — present
- Required heading: Findings — present
- Required heading: Not found — present
- The reply says the assistant cannot approve or merge, and it does not tell a human to click Approve or Merge: yes
- The reply names planted-privacy-snippet.ts or quotes lines from that sample: yes
- I did not add a finding the assistant did not write: yes
- I did not edit the planted snippet, and I did not merge the pull request: yes
- Note for the next step, optional and not a new finding: The privacy note is a question for a human. The next step should critique whether that question is enough, not treat it as a decision.
