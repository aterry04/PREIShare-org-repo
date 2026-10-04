import { createFileRoute } from '@tanstack/react-router'
import { MetricCard } from '../../components/dashboard/MetricCard'
import { PortfolioSummary } from '../../components/dashboard/PortfolioSummary'
import { RecentActivity } from '../../components/dashboard/RecentActivity'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardHomePage,
})

const demoMetrics = [
  {
    label: 'Portfolio value',
    value: '—',
    hint: 'Connect data to see live totals',
  },
  {
    label: 'Active investments',
    value: '—',
    hint: 'No investments loaded yet',
  },
  {
    label: 'Distributions (YTD)',
    value: '—',
    hint: 'Figures appear after sync',
  },
]

function DashboardHomePage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="space-y-1">
        <h2
          id="dashboard-home-heading"
          className="text-2xl font-semibold tracking-tight text-[var(--sea-ink)]"
        >
          Investor dashboard
        </h2>
        <p className="m-0 max-w-prose text-sm text-[var(--sea-ink-soft)]">
          Your PREIshare home base for portfolio metrics and recent activity.
          Figures below are placeholders until an account is linked.
        </p>
      </header>

      <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {demoMetrics.map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            hint={metric.hint}
          />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <PortfolioSummary
          headline="Portfolio summary"
          holdings={[]}
          emptyMessage="No portfolio holdings to show yet. When your account is linked, summaries will appear here."
        />
        <RecentActivity
          items={[]}
          emptyMessage="No recent activity yet. Distributions, documents, and updates will list here."
        />
      </section>
    </div>
  )
}
