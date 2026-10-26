// Server-only re-export. Implementation lives in src/lib/supabase.server.ts.
// Do not import this file from browser components.
export {
  createSupabaseServerClient as createUserServerSupabaseClient,
  createSupabaseServiceRoleClient as createServerSupabaseClient,
} from '../supabase.server'
