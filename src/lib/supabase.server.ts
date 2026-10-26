// Server-only. Do not import this file from browser components or from
// src/lib/supabase.client.ts. Env names match docs/env-var-checklist.md.
import { createClient } from '@supabase/supabase-js'
import type { Database } from './supabase/types'

const checklist = 'docs/env-var-checklist.md'

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing server env ${name}. See ${checklist}.`)
  }
  return value
}

function readServerUrl(): string {
  return requireEnv(
    'SUPABASE_URL or VITE_SUPABASE_URL',
    process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL,
  )
}

/**
 * Session-aware server client for sponsor reads and writes. Uses the public
 * anon key plus the access token from the sponsor session cookie, so
 * Postgres Row-Level Security still applies. This is the default for
 * property_listings. It does not bypass RLS.
 */
export function createSupabaseServerClient(accessToken: string) {
  const url = readServerUrl()
  const anonKey = requireEnv(
    'VITE_SUPABASE_ANON_KEY',
    process.env.VITE_SUPABASE_ANON_KEY,
  )

  if (!accessToken) {
    throw new Error(
      `Missing sponsor access token for the server Supabase client. See ${checklist}.`,
    )
  }

  return createClient<Database>(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  })
}

/**
 * Privileged admin client. Server only. Bypasses Row-Level Security.
 * Maintenance jobs only. Do not use for normal sponsor listing UI.
 */
export function createSupabaseServiceRoleClient() {
  const url = readServerUrl()
  const serviceRoleKey = requireEnv(
    'SUPABASE_SERVICE_ROLE_KEY',
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  )

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
