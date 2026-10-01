import type { ReactNode } from 'react'
import { NavItems } from './NavItems'

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
      <NavItems />
      {children}
    </aside>
  )
}
