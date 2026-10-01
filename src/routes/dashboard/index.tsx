import { createFileRoute } from '@tanstack/react-router'
import { PortfolioSummary } from '../../components/dashboard/PortfolioSummary'
import { RecentActivity } from '../../components/dashboard/RecentActivity'
import { StatsCard } from '../../components/dashboard/StatsCard'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardHomePage,
})

function DashboardHomePage() {
  return (
    <div className="dashboard-home space-y-6">
      <p className="sample-data-banner m-0 text-sm text-[var(--sea-ink-soft)]" role="note">
        Demo shell — all figures are placeholders
      </p>
      <div className="dashboard-home__stats dash-card-grid">
        <StatsCard label="Total portfolio value" value="$300,000" hint="Sample total" />
        <StatsCard label="Open deals" value="3" hint="Sample count" />
        <StatsCard label="Contributions YTD" value="$24,000" hint="Sample YTD" />
      </div>
      <div className="dashboard-home__panels dash-card-grid dash-card-grid--panels">
        <PortfolioSummary totalLabel="$300,000" />
        <RecentActivity />
      </div>
    </div>
  )
}
