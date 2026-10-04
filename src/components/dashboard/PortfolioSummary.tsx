export type PortfolioHolding = {
  id: string
  name: string
  /** Display string already formatted for UI, for example "42%" or "$120,000" */
  allocationLabel: string
}

export type PortfolioSummaryProps = {
  /** Section heading. Architecture name: headline. */
  headline?: string
  holdings?: PortfolioHolding[]
  /** Optional total line for the snapshot */
  totalLabel?: string
  /** Shown when holdings is an empty list */
  emptyMessage?: string
}

/** MOCK PLACEHOLDER — replace with real portfolio data in a later sprint */
export const MOCK_PORTFOLIO_HOLDINGS: PortfolioHolding[] = [
  { id: 'h1', name: 'Riverfront Multifamily (sample)', allocationLabel: '42%' },
  { id: 'h2', name: 'Cedar Retail Plaza (sample)', allocationLabel: '33%' },
  { id: 'h3', name: 'Harbor Industrial (sample)', allocationLabel: '25%' },
]

export function PortfolioSummary({
  headline = 'Portfolio summary',
  holdings = MOCK_PORTFOLIO_HOLDINGS,
  totalLabel,
  emptyMessage = 'No holdings to show yet.',
}: PortfolioSummaryProps) {
  return (
    <section
      className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-4"
      aria-label={headline}
    >
      <h2 className="m-0 text-lg font-semibold text-[var(--sea-ink)]">{headline}</h2>
      {totalLabel ? (
        <p className="m-0 mt-1 text-sm text-[var(--sea-ink-soft)]">Total: {totalLabel}</p>
      ) : null}
      {holdings.length === 0 ? (
        <p className="m-0 mt-4 text-sm text-[var(--sea-ink-soft)]">{emptyMessage}</p>
      ) : (
        <ul className="m-0 mt-4 list-none divide-y divide-[var(--line)] p-0">
          {holdings.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 py-2 text-sm"
            >
              <span className="font-medium text-[var(--sea-ink)]">{item.name}</span>
              <span className="text-[var(--sea-ink-soft)]">{item.allocationLabel}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
