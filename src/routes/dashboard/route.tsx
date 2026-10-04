import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <header className="border-b border-[var(--line)] px-4 py-3">
        <p className="text-sm font-medium tracking-wide text-[var(--sea-ink-soft)]">
          PREIshare
        </p>
        <h1 className="text-lg font-semibold text-[var(--sea-ink)]">
          Investor Dashboard
        </h1>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  )
}
