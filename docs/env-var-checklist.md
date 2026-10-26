# PREIshare environment variable checklist

Names and purpose only. Real values belong in a local `.env` or `.env.local` copied from `.env.example`. Do not put live keys in this file, in git, or in screenshots.

Source contract: `docs/sponsor-auth-requirements.md`. Template: `.env.example`.

Vite embeds any variable whose name starts with `VITE_` into the browser bundle. Only public values may use that prefix. `SUPABASE_SERVICE_ROLE_KEY` must never be renamed to `VITE_SUPABASE_SERVICE_ROLE_KEY`.

## Variables

| Name | Exposure | Used for | Never do this |
| --- | --- | --- | --- |
| `VITE_SUPABASE_URL` | Client-safe | Public project URL. The browser uses it for sponsor login and for listing calls that still go through Row-Level Security. | Do not treat the URL as a secret, and do not hard-code a live project URL in a `.ts` or `.tsx` file. |
| `VITE_SUPABASE_ANON_KEY` | Client-safe | Public anon / publishable key. It identifies the app. It does not bypass Row-Level Security. Safe in the browser only together with the signed-in sponsor’s session and database policies. | Do not use this key for admin or maintenance jobs that need to ignore row rules. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | Admin bypass. This key skips Row-Level Security and can read or change every row. Read it only in trusted server code. | Do not import it in browser code or shared React components. Do not give it a `VITE_` prefix. Do not commit it, paste it into docs, or send it from the browser. |
| `SUPABASE_URL` | Server-only (optional) | Same project URL for server code that should not depend on a `VITE_` variable. | Do not put the service-role key in this variable. It is a URL, not a secret key. |

## What gets committed

| File | Commit? | Why |
| --- | --- | --- |
| `.env.example` | Yes | Placeholders only: `https://your-project-ref.supabase.co`, `your-anon-or-publishable-key`, `your-service-role-key`. |
| `.env`, `.env.local`, `.env.*.local` | No | Real keys. `.gitignore` ignores `.env` and `.env.*`, and keeps `.env.example` with `!.env.example`. |
| This checklist | Yes | Labels each name client-safe or server-only. No live values. |

Later client setup should read `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in browser code, and read `SUPABASE_SERVICE_ROLE_KEY` only on the server.
