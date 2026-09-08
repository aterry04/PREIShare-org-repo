# Vercel Hobby setup — PREIshare investor app

**Date:** 2026-09-08
**Vercel plan:** Hobby (free) — not Pro

## URLs (the same ones you will reuse all semester)

| Item | Value |
| --- | --- |
| GitHub repository (you can push) | `https://github.com/aterry04/PREIShare-org-repo` |
| Instructor collaborator | `thortek` added: invite sent (pending until they accept) |
| Vercel Production URL | https://prei-share-org-repo-woad.vercel.app/ |
| Preview URLs | Do **not** submit these to Canvas |

## Hobby constraints I will keep

- One Vercel project for this course
- Production deploys from `main` only
- No cron / Fluid Compute / paid add-ons
- Secrets go in the Vercel dashboard later — never in git
- Do not set `outputDirectory: "dist"` (this is SSR via TanStack Start + Nitro, not a static site)

## Nitro (required before a working Production URL)

`main` currently has `vite.config.ts` plugins `devtools()`, `tailwindcss()`, `tanstackStart()`, `viteReact()` — **no `nitro()`**. Without Nitro the Vercel build can pass while every page returns 404 (NOT_FOUND).

On the clone, on `main`:

1. `npm install nitro`
2. Import `nitro` from `nitro/vite` and insert `nitro()` immediately after `tanstackStart()`.
3. Commit and push **`main`** (Vercel production is `main`, not the feature branch).

Target plugins order:

`devtools(), tailwindcss(), tanstackStart(), nitro(), viteReact()`

Do not add a `vercel.json` that points at `dist`.

## First production deploy

- Status: not started in this record (Hobby project not imported yet)
- Incognito check of Production URL: fail until Status is Ready and the URL is pasted above
- If the first build fails: keep this same Vercel project, paste the build log into a coding-agent, fix TanStack Start + Nitro — do not create a second project

## GitHub collaborator

- Invite `thortek` on `https://github.com/aterry04/PREIShare-org-repo` → Settings → Collaborators
- After they accept, change the table row above to `yes`
