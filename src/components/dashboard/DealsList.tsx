export type Deal = {
  id: string
  name: string
  location: string
  minimumInvestment: number
  status: 'Open' | 'Closing soon' | 'Waitlist'
}

const mockDeals: Deal[] = [
  {
    id: 'd1',
    name: 'Harbor View Residences',
    location: 'Tampa, FL',
    minimumInvestment: 25000,
    status: 'Open',
  },
  {
    id: 'd2',
    name: 'Summit Logistics Hub',
    location: 'Columbus, OH',
    minimumInvestment: 50000,
    status: 'Closing soon',
  },
]

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

type DealsListProps = {
  deals?: Deal[]
  emptyMessage?: string
}

export function DealsList({
  deals = mockDeals,
  emptyMessage = 'No open deals right now. Check back soon for new opportunities.',
}: DealsListProps) {
  return (
    <section
      className="dashboard-panel rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-4 sm:p-5"
      aria-label="Open deals"
    >
      <h2 className="m-0 text-lg font-semibold text-[var(--sea-ink)]">Open deals</h2>
      <p className="sample-data-banner m-0 mt-2 text-sm text-[var(--sea-ink-soft)]" role="note">
        Sample deals — not a live listing feed
      </p>
      {deals.length === 0 ? (
        <p className="empty-state m-0 mt-4 text-sm text-[var(--sea-ink)]">{emptyMessage}</p>
      ) : (
        <ul className="deals-list m-0 mt-4 list-none space-y-3 p-0">
          {deals.map((deal) => (
            <li
              key={deal.id}
              className="deal-card flex flex-wrap items-start justify-between gap-3 rounded-lg border border-[var(--line)] px-3 py-3"
            >
              <div>
                <h3 className="m-0 text-base font-semibold text-[var(--sea-ink)]">{deal.name}</h3>
                <p className="m-0 mt-1 text-sm text-[var(--sea-ink-soft)]">{deal.location}</p>
              </div>
              <p className="m-0 text-sm font-semibold text-[var(--sea-ink)]">
                Min. {formatCurrency(deal.minimumInvestment)}
              </p>
              <p className="m-0 rounded-full bg-[var(--chip-bg)] px-3 py-1 text-sm font-semibold text-[var(--sea-ink)]">
                {deal.status}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
