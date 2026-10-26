import { Outlet, createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { AppShell } from '../components/dashboard/AppShell'
import { createBrowserSupabaseClient } from '../lib/supabase.client'

const loadSponsor = createServerFn({ method: 'GET' }).handler(async () => {
  const { readSponsorAccessToken } = await import('../lib/auth/session')
  const { createSupabaseServerClient } = await import('../lib/supabase.server')
  const accessToken = readSponsorAccessToken()
  if (!accessToken) return null

  const supabase = createSupabaseServerClient(accessToken)
  const { data, error } = await supabase.auth.getUser(accessToken)
  if (error || !data.user) return null
  return { id: data.user.id, email: data.user.email ?? null }
})

const endSponsorSession = createServerFn({ method: 'POST' }).handler(async () => {
  const { signOut } = await import('../lib/auth/session')
  await signOut()
})

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const sponsor = await loadSponsor()
    if (!sponsor) {
      throw redirect({ to: '/login' })
    }
    return { sponsor }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  const navigate = useNavigate()
  const { sponsor } = Route.useRouteContext()

  async function handleSignOut() {
    await endSponsorSession()
    try {
      await createBrowserSupabaseClient().auth.signOut()
    } catch {
      // The cleared server session is what blocks /dashboard.
    }
    await navigate({ to: '/login' })
  }

  return (
    <AppShell
      title="Overview"
      actions={
        <div className="flex items-center gap-3">
          <p className="m-0 text-sm text-[var(--sea-ink-soft)]">{sponsor.email}</p>
          <button
            type="button"
            onClick={() => {
              void handleSignOut()
            }}
            className="rounded-full border border-[var(--line)] px-3 py-1 text-sm font-semibold text-[var(--sea-ink)]"
          >
            Sign out
          </button>
        </div>
      }
    >
      <Outlet />
    </AppShell>
  )
}
