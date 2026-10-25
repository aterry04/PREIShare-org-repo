# Supabase environment setup checklist (PREIshare Sprint 4)

## Purpose

Configure the Supabase URL and keys for the TanStack Start dashboard so sponsors
can authenticate and listings can load from Postgres without shipping
service-role secrets to the browser.

## Source requirements

See `docs/requirements/sponsor-auth-and-listings-brief.md` (goals, success
criteria, and the server-only boundary). This checklist does not add login
pages, database tables, or application feature code.

## Public prefix in this repo

The app is Vite (`npm run dev` runs `vite dev`). Vite embeds only variables
whose names start with `VITE_` into browser code. Browser-safe Supabase values
use that prefix. `SUPABASE_SERVICE_ROLE_KEY` has no public prefix and must
never be renamed to something like `VITE_SUPABASE_SERVICE_ROLE_KEY`. The
service-role key bypasses row-level security and must not ship in the client
bundle.

## Supabase project

- [ ] Supabase project created (or selected) for PREIshare
- [ ] Wait until the project shows as ready before copying keys
- [ ] Project URL copied from Project Settings → API
- [ ] Anon / public key copied (dashboard may label this “anon” or “publishable”; it is the browser key used with row-level security)
- [ ] service_role key copied (dashboard may label this “service_role” or “secret”; it bypasses row-level security)
- [ ] service_role key stored only in a local untracked env file
- [ ] Database password stored in a password manager, not in the repo (it is not the same as the API keys)

## Repo files

- [ ] `.env.example` committed with placeholder values only (`your-project-ref`, `your-anon-or-publishable-key`, `your-service-role-key`)
- [ ] Local `.env.local` (or `.env`) created by copying `.env.example` and filling real values yourself
- [ ] `.gitignore` ignores real env files: `.env`, `.env.*`, and `*.local` (which covers `.env.local`). `!.env.example` keeps the placeholder template trackable
- [ ] `git status` does not list the real env file as a file to commit

## Public vs server-only rules

- [ ] Browser-safe vars use the Vite public prefix: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` has no public or client prefix
- [ ] No file under `src/` that runs in the browser reads `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `.env.example` and this checklist contain zero real key material
- [ ] The service-role key must never ship in the client bundle

## Smoke checks before feature work

- [ ] Restart the dev server after creating or editing the local env file (`npm run dev`)
- [ ] App still starts (env typos often surface later as empty URL or key errors)
- [ ] Search the repo for the real service_role key string — zero hits in tracked files
- [ ] `git check-ignore -v .env .env.local` shows both paths ignored

## Handoff notes

- Hosting providers need the same split: public vars for the client build, service-role only in server or runtime secret storage.
- Next steps in this sprint: data model, migrations and row-level security, then Supabase clients that read these env names.
- Paste real keys only into the local env file. Do not paste them into chat, screenshots, or committed docs.
