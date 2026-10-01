export type PortfolioHolding = {
  id: string
  propertyName: string
  assetType: string
  investedAmount: number
  currentValue: number
  status: 'Performing' | 'Under review' | 'Exited'
}

const mockHoldings: PortfolioHolding[] = [
  {
    id: 'h1',
    propertyName: 'Riverfront Lofts',
    assetType: 'Multifamily',
    investedAmount: 50000,
    currentValue: 56200,
    status: 'Performing',
  },
  {
    id: 'h2',
    propertyName: 'Cedar Business Park',
    assetType: 'Industrial',
    investedAmount: 75000,
    currentValue: 74100,
    status: 'Under review',
  },
]

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

type PortfolioTableProps = {
  holdings?: PortfolioHolding[]
  emptyMessage?: string
}

export function PortfolioTable({
  holdings = mockHoldings,
  emptyMessage = 'No holdings to show yet. New investments will appear here.',
}: PortfolioTableProps) {
  return (
    <section
      className="dashboard-panel rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-4 sm:p-5"
      aria-label="Portfolio holdings"
    >
      <h2 className="m-0 text-lg font-semibold text-[var(--sea-ink)]">Your holdings</h2>
      <p className="sample-data-banner m-0 mt-2 text-sm text-[var(--sea-ink-soft)]" role="note">
        Sample holdings — not live balances
      </p>
      {holdings.length === 0 ? (
        <p className="empty-state m-0 mt-4 text-sm text-[var(--sea-ink)]">{emptyMessage}</p>
      ) : (
        <div className="table-wrap dash-table-wrap mt-4">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--line)] text-[var(--sea-ink-soft)]">
                <th scope="col" className="py-2 pr-3 font-semibold">
                  Property
                </th>
                <th scope="col" className="py-2 pr-3 font-semibold">
                  Type
                </th>
                <th scope="col" className="py-2 pr-3 font-semibold">
                  Invested
                </th>
                <th scope="col" className="py-2 pr-3 font-semibold">
                  Current value
                </th>
                <th scope="col" className="py-2 font-semibold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((row) => (
                <tr key={row.id} className="border-b border-[var(--line)] text-[var(--sea-ink)]">
                  <td className="py-3 pr-3 font-medium">{row.propertyName}</td>
                  <td className="py-3 pr-3">{row.assetType}</td>
                  <td className="py-3 pr-3">{formatCurrency(row.investedAmount)}</td>
                  <td className="py-3 pr-3">{formatCurrency(row.currentValue)}</td>
                  <td className="py-3">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
