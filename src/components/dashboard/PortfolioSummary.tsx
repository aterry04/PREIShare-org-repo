export type HoldingSnapshot = {
  id: string
  name: string
  allocationLabel: string
  valueLabel: string
}

export type PortfolioSummaryProps = {
  title?: string
  totalLabel: string
  holdings?: HoldingSnapshot[]
  isSampleData?: boolean
}

export const DEFAULT_MOCK_HOLDINGS: HoldingSnapshot[] = [
  {
    id: 'h1',
    name: 'Sample Multifamily Fund A',
    allocationLabel: '40%',
    valueLabel: '$120,000',
  },
  {
    id: 'h2',
    name: 'Sample Industrial Note B',
    allocationLabel: '35%',
    valueLabel: '$105,000',
  },
  {
    id: 'h3',
    name: 'Sample Cash Reserve',
    allocationLabel: '25%',
    valueLabel: '$75,000',
  },
]

export function PortfolioSummary({
  title = 'Portfolio summary',
  totalLabel,
  holdings = DEFAULT_MOCK_HOLDINGS,
  isSampleData = true,
}: PortfolioSummaryProps) {
  return (
    <section
      className="portfolio-summary rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-4 sm:p-5"
      aria-labelledby="portfolio-summary-heading"
    >
      <div className="portfolio-summary__header mb-4">
        <h2
          id="portfolio-summary-heading"
          className="m-0 text-lg font-semibold text-[var(--sea-ink)]"
        >
          {title}
        </h2>
        {isSampleData ? (
          <p className="sample-data-banner m-0 mt-2 text-sm text-[var(--sea-ink-soft)]" role="note">
            Sample data — placeholders only, not live balances
          </p>
        ) : null}
      </div>
      <p className="portfolio-summary__total m-0 mb-4 flex items-baseline justify-between gap-3">
        <span className="portfolio-summary__total-label text-sm text-[var(--sea-ink-soft)]">
          Total (sample)
        </span>
        <span className="portfolio-summary__total-value text-xl font-semibold text-[var(--sea-ink)]">
          {totalLabel}
        </span>
      </p>
      <ul className="portfolio-summary__list m-0 list-none space-y-3 p-0">
        {holdings.map((item) => (
          <li
            key={item.id}
            className="portfolio-summary__row flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-t border-[var(--line)] pt-3"
          >
            <span className="portfolio-summary__name font-medium text-[var(--sea-ink)]">
              {item.name}
            </span>
            <span className="portfolio-summary__allocation text-sm text-[var(--sea-ink-soft)]">
              {item.allocationLabel}
            </span>
            <span className="portfolio-summary__value text-sm font-semibold text-[var(--sea-ink)]">
              {item.valueLabel}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
