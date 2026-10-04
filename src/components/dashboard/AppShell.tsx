import type { ReactNode } from 'react'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { Sidebar } from './Sidebar'

export type AppShellProps = {
  /** Page content for the main region, usually the route Outlet */
  children: ReactNode
  /** Forwarded to Header as the section label */
  title?: string
  /** Optional sidebar slot. The real Sidebar arrives in a later step. */
  sidebar?: ReactNode
}

/**
 * Shared frame for /dashboard routes: header, reserved sidebar, main slot.
 */
export function AppShell({ children, title, sidebar }: AppShellProps) {
  return (
    <div className="flex min-h-[70vh] flex-col rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-[var(--sea-ink)]">
      <Header title={title} />
      <div className="border-b border-[var(--line)] px-4 py-3 md:hidden">
        <MobileNav />
      </div>

      <div className="flex min-h-0 flex-1">
        {sidebar ?? <Sidebar />}

        <main className="min-w-0 flex-1 p-4 md:p-6" id="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}
