export type ListingCardProps = {
  listing: {
    id: string
    title: string
    city: string
    region: string
    status: string
    asking_price: number
  }
}

export function ListingCard({ listing }: ListingCardProps) {
  const price = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(listing.asking_price)

  return (
    <article
      aria-label={listing.title}
      className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-4"
    >
      <h2 className="m-0 text-lg font-semibold text-[var(--sea-ink)]">{listing.title}</h2>
      <p className="m-0 mt-1 text-sm text-[var(--sea-ink-soft)]">
        {listing.city}, {listing.region}
      </p>
      <p className="m-0 mt-2 text-sm text-[var(--sea-ink)]">Status: {listing.status}</p>
      <p className="m-0 text-sm text-[var(--sea-ink)]">{price}</p>
    </article>
  )
}
