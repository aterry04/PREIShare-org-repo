import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

export type PropertyListItem = {
  id: string
  title: string
  city: string | null
  status: string | null
  created_at: string
}

/**
 * Server-only load path. RLS on property_listings restricts rows to the
 * signed-in sponsor. This page does not filter the list in React.
 */
const loadSponsorProperties = createServerFn({ method: 'GET' }).handler(
  async (): Promise<{ properties: PropertyListItem[]; error: string | null }> => {
    const { readSponsorAccessToken } = await import('../../lib/auth/session')
    const { createSupabaseServerClient } = await import('../../lib/supabase.server')
    const accessToken = readSponsorAccessToken()
    if (!accessToken) {
      throw redirect({ to: '/login' })
    }

    const supabase = createSupabaseServerClient(accessToken)
    const { data: userData, error: userError } = await supabase.auth.getUser(accessToken)
    if (userError || !userData.user) {
      throw redirect({ to: '/login' })
    }

    const { data, error } = await supabase
      .from('property_listings')
      .select('id, title, city, status, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      return { properties: [], error: 'Could not load properties. Try again.' }
    }

    return { properties: data ?? [], error: null }
  },
)

export const Route = createFileRoute('/dashboard/properties')({
  loader: () => loadSponsorProperties(),
  component: PropertiesPage,
})

function PropertiesPage() {
  const { properties, error } = Route.useLoaderData()

  return (
    <section className="space-y-4" aria-labelledby="properties-heading">
      <header className="space-y-1">
        <h1 id="properties-heading" className="text-2xl font-semibold text-[var(--sea-ink)]">
          Your properties
        </h1>
        <p className="text-sm text-[var(--sea-ink-soft)]">
          Listings you are allowed to manage. Visibility is enforced by the database, not only by this page.
        </p>
      </header>

      {error ? (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      {!error && properties.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[var(--line)] px-4 py-8 text-center text-[var(--sea-ink-soft)]">
          <p className="font-medium text-[var(--sea-ink)]">No properties yet</p>
          <p className="mt-1 text-sm">
            When you add a listing, it will show up here for your sponsor account only.
          </p>
        </div>
      ) : null}

      {properties.length > 0 ? (
        <ul className="divide-y divide-[var(--line)] rounded-lg border border-[var(--line)]">
          {properties.map((property) => (
            <li
              key={property.id}
              className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-[var(--sea-ink)]">{property.title}</p>
                <p className="text-sm text-[var(--sea-ink-soft)]">{property.city ?? 'Location TBD'}</p>
              </div>
              <span className="text-xs uppercase tracking-wide text-[var(--sea-ink-soft)]">
                {property.status ?? 'unknown'}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
