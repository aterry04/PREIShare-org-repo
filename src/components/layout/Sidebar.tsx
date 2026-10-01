import type { ReactNode } from 'react'
import { NavItems } from './NavItems'

type SidebarProps = {
  id?: string
  brandLabel?: string
  children?: ReactNode
  onNavigate?: () => void
}

/** Left navigation chrome for the investor dashboard shell. */
export function Sidebar({
  id = 'dashboard-sidebar',
  brandLabel = 'PREIshare',
  children,
  onNavigate,
}: SidebarProps) {
  return (
    <aside
      id={id}
      className="dashboard-sidebar dash-sidebar border-b border-[var(--line)] bg-[var(--surface-strong)] md:border-r md:border-b-0"
      aria-label="Investor navigation"
    >
      <div className="sidebar-brand mb-4 text-base font-semibold tracking-tight text-[var(--sea-ink)]">
        {brandLabel}
      </div>
      <NavItems onNavigate={onNavigate} />
      {children}
    </aside>
  )
}
