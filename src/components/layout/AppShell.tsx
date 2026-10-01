import { useState, type ReactNode } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

type AppShellProps = {
  children: ReactNode
}

/**
 * Shared investor chrome: sidebar, header, and main content region.
 * Child routes render inside `children` (wired from the dashboard layout route).
 * The header title comes from navConfig for the current path.
 * Below 768px the sidebar stays collapsed until the header Menu button opens it.
 */
export function AppShell({ children }: AppShellProps) {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div
      className={`app-shell dash-shell page-wrap my-6 rounded-2xl border border-[var(--line)] bg-[var(--surface)]${navOpen ? ' nav-open' : ''}`}
    >
      <Sidebar id="dashboard-sidebar" onNavigate={() => setNavOpen(false)} />
      <div className="app-shell-main-column dash-main">
        <Header navOpen={navOpen} onToggleNav={() => setNavOpen((open) => !open)}>
          <span>Member</span>
        </Header>
        <main className="app-shell-content dash-content" id="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}
