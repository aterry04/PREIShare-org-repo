// Server-only session helpers. Call these from server functions, not from
// browser components. Uses the user-scoped server client so row-level
// security still sees auth.uid(). Does not use the service-role client.
import {
  deleteCookie,
  getCookie,
  setCookie,
} from '@tanstack/react-start/server'
import { createUserServerSupabaseClient } from '../supabase/server'

const sessionCookie = 'preishare-session'
const maxAgeSeconds = 60 * 60 * 24 * 7

type StoredSession = {
  accessToken: string
  refreshToken: string
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSeconds,
  }
}

function readStoredSession(): StoredSession | null {
  const raw = getCookie(sessionCookie)
  if (!raw) return null
  try {
    const parsed: unknown = JSON.parse(
      Buffer.from(raw, 'base64url').toString('utf8'),
    )
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('accessToken' in parsed) ||
      !('refreshToken' in parsed) ||
      typeof parsed.accessToken !== 'string' ||
      typeof parsed.refreshToken !== 'string' ||
      parsed.accessToken.length === 0 ||
      parsed.refreshToken.length === 0
    ) {
      return null
    }
    return {
      accessToken: parsed.accessToken,
      refreshToken: parsed.refreshToken,
    }
  } catch {
    return null
  }
}

function writeStoredSession(session: StoredSession) {
  const value = Buffer.from(JSON.stringify(session), 'utf8').toString('base64url')
  setCookie(sessionCookie, value, cookieOptions())
}

function clearStoredSession() {
  deleteCookie(sessionCookie, cookieOptions())
}

export async function saveSponsorSession(
  accessToken: string,
  refreshToken: string,
) {
  const supabase = createUserServerSupabaseClient(accessToken)
  const { data, error } = await supabase.auth.getUser(accessToken)
  if (error || !data.user) {
    throw new Error('Could not verify the sponsor session.')
  }
  writeStoredSession({ accessToken, refreshToken })
  return { id: data.user.id, email: data.user.email ?? null }
}

export async function getSession() {
  const stored = readStoredSession()
  if (!stored) return null

  const supabase = createUserServerSupabaseClient(stored.accessToken)
  const current = await supabase.auth.getUser(stored.accessToken)
  if (!current.error && current.data.user) {
    return { user: current.data.user }
  }

  const refreshed = await supabase.auth.refreshSession({
    refresh_token: stored.refreshToken,
  })
  const next = refreshed.data.session
  if (refreshed.error || !next?.access_token || !next.refresh_token || !next.user) {
    clearStoredSession()
    return null
  }

  writeStoredSession({
    accessToken: next.access_token,
    refreshToken: next.refresh_token,
  })
  return { user: next.user }
}

export async function getUser() {
  const session = await getSession()
  return session?.user ?? null
}

/** Access token for the cookie session. Call after getUser() so a refresh is already saved. */
export function readSponsorAccessToken(): string | null {
  return readStoredSession()?.accessToken ?? null
}

export async function signOut() {
  const stored = readStoredSession()
  if (stored) {
    try {
      const supabase = createUserServerSupabaseClient(stored.accessToken)
      await supabase.auth.signOut({ scope: 'local' })
    } catch {
      // The cookie clear below is what blocks the dashboard.
    }
  }
  clearStoredSession()
}
