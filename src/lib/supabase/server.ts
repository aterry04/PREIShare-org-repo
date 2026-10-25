// SERVER-ONLY. Never import this file from browser components, route UI,
// or src/lib/supabase/client.ts. The service-role key bypasses row-level security.
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const checklist = 'docs/setup/supabase-env-checklist.md'

function readServerUrl(): string {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
  if (!url) {
    throw new Error(
      `Missing SUPABASE_URL or VITE_SUPABASE_URL. See ${checklist}`,
    )
  }
  return url
}

/**
 * Privileged server client. Bypasses RLS. Maintenance only — not sponsor
 * listing create/read/update/delete. Those must use createUserServerSupabaseClient
 * so auth.uid() still applies.
 */
export function createServerSupabaseClient() {
  const url = readServerUrl()
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    throw new Error(`Missing SUPABASE_SERVICE_ROLE_KEY. See ${checklist}`)
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

/**
 * Server client acting as the signed-in sponsor. Uses the anon key plus that
 * user's access token, so property_listings policies see auth.uid().
 */
export function createUserServerSupabaseClient(accessToken: string) {
  const url = readServerUrl()
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY

  if (!anonKey) {
    throw new Error(`Missing VITE_SUPABASE_ANON_KEY. See ${checklist}`)
  }

  if (!accessToken) {
    throw new Error(
      `Missing sponsor access token for the server Supabase client. See ${checklist}`,
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
