import type { ReactNode } from 'react'
import { Header } from './Header'

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

      <div className="flex min-h-0 flex-1">
        <aside
          className="hidden w-60 shrink-0 border-r border-[var(--line)] md:block"
          aria-label="Dashboard sidebar"
        >
          {sidebar ?? (
            <div className="p-4 text-sm text-[var(--sea-ink-soft)]">
              Navigation coming soon
            </div>
          )}
        </aside>

        <main className="min-w-0 flex-1 p-4 md:p-6" id="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}
