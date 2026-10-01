import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

type SidebarProps = {
  brandLabel?: string
  children?: ReactNode
}

/** Left navigation chrome for the investor dashboard shell. */
export function Sidebar({ brandLabel = 'PREIshare', children }: SidebarProps) {
  return (
    <aside
      className="dashboard-sidebar w-full shrink-0 border-b border-[var(--line)] bg-[var(--surface-strong)] px-4 py-5 md:w-56 md:border-r md:border-b-0"
      aria-label="Investor navigation"
    >
      <div className="sidebar-brand mb-4 text-base font-semibold tracking-tight text-[var(--sea-ink)]">
        {brandLabel}
      </div>
      <nav className="sidebar-nav" aria-label="Dashboard areas">
        {/* Placeholder links — full nav config and active states come in the next step */}
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0 md:flex-col md:gap-1">
          <li>
            <Link
              to="/dashboard"
              className="block rounded-lg px-3 py-2 text-sm font-semibold text-[var(--sea-ink)] no-underline hover:bg-[var(--chip-bg)]"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/portfolio"
              className="block rounded-lg px-3 py-2 text-sm font-semibold text-[var(--sea-ink)] no-underline hover:bg-[var(--chip-bg)]"
            >
              Portfolio
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/deals"
              className="block rounded-lg px-3 py-2 text-sm font-semibold text-[var(--sea-ink)] no-underline hover:bg-[var(--chip-bg)]"
            >
              Deals
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/profile"
              className="block rounded-lg px-3 py-2 text-sm font-semibold text-[var(--sea-ink)] no-underline hover:bg-[var(--chip-bg)]"
            >
              Profile
            </Link>
          </li>
        </ul>
        {children}
      </nav>
    </aside>
  )
}
