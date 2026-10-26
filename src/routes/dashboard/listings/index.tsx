import { Link, createFileRoute } from '@tanstack/react-router'
import { ListingCard } from '../../../components/listings/ListingCard'
import { listMyListings } from '../../../server/listings'

export const Route = createFileRoute('/dashboard/listings/')({
  loader: () => listMyListings(),
  pendingComponent: ListingsLoading,
  errorComponent: ListingsCrashed,
  component: ListingsIndexPage,
})

function ListingsLoading() {
  return (
    <section aria-labelledby="listings-heading">
      <h1 id="listings-heading" className="text-2xl font-semibold text-[var(--sea-ink)]">
        Your property listings
      </h1>
      <p className="mt-2 text-sm text-[var(--sea-ink-soft)]">Loading listings…</p>
    </section>
  )
}

function ListingsCrashed({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : 'Could not load listings.'
  return (
    <section aria-labelledby="listings-heading">
      <h1 id="listings-heading" className="text-2xl font-semibold text-[var(--sea-ink)]">
        Your property listings
      </h1>
      <p role="alert" className="mt-2 text-sm text-red-700">
        {message}
      </p>
    </section>
  )
}

function ListingsIndexPage() {
  const result = Route.useLoaderData()

  return (
    <section aria-labelledby="listings-heading" className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 id="listings-heading" className="m-0 text-2xl font-semibold text-[var(--sea-ink)]">
          Your property listings
        </h1>
        <Link
          to="/dashboard/listings/new"
          className="rounded-full bg-[var(--lagoon)] px-4 py-2 text-sm font-semibold text-[var(--sea-ink)] no-underline"
        >
          Add listing
        </Link>
      </header>

      {!result.ok ? (
        <p role="alert" className="m-0 text-sm text-red-700">
          {result.error}
        </p>
      ) : result.listings.length === 0 ? (
        <p className="m-0 max-w-prose text-sm text-[var(--sea-ink-soft)]">
          No properties yet. Add your first listing to get started.
        </p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {result.listings.map((listing) => (
            <li key={listing.id}>
              <ListingCard listing={listing} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
