import { Outlet, createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { AppShell } from '../../components/dashboard/AppShell'
import { createBrowserSupabaseClient } from '../../lib/supabase/client'

const loadSponsor = createServerFn({ method: 'GET' }).handler(async () => {
  const { getUser } = await import('../../lib/auth/session')
  const user = await getUser()
  if (!user) return null
  return { id: user.id, email: user.email ?? null }
})

const endSponsorSession = createServerFn({ method: 'POST' }).handler(async () => {
  const { signOut } = await import('../../lib/auth/session')
  await signOut()
})

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const user = await loadSponsor()
    if (!user) {
      throw redirect({ to: '/auth/login' })
    }
    return { sponsor: user }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  const navigate = useNavigate()

  async function handleSignOut() {
    await endSponsorSession()
    try {
      await createBrowserSupabaseClient().auth.signOut()
    } catch {
      // The server cookie clear is what blocks /dashboard.
    }
    await navigate({ to: '/auth/login' })
  }

  return (
    <AppShell
      title="Overview"
      actions={
        <button
          type="button"
          onClick={() => {
            void handleSignOut()
          }}
          className="rounded-full border border-[var(--line)] px-3 py-1 text-sm font-semibold text-[var(--sea-ink)]"
        >
          Sign out
        </button>
      }
    >
      <Outlet />
    </AppShell>
  )
}
