import type { ReactNode } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

type AppShellProps = {
  title?: string
  children: ReactNode
}

/**
 * Shared investor chrome: sidebar, header, and main content region.
 * Child routes render inside `children` (wired from the dashboard layout route).
 */
export function AppShell({ title = 'Investor Dashboard', children }: AppShellProps) {
  return (
    <div className="app-shell page-wrap my-6 flex min-h-[70vh] flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] md:flex-row">
      <Sidebar />
      <div className="app-shell-main-column flex min-w-0 flex-1 flex-col">
        <Header title={title}>
          <span>Member</span>
        </Header>
        <main className="app-shell-content px-4 py-6 sm:px-6" id="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}
