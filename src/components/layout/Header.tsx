import type { ReactNode } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { getPageTitle } from './navConfig'

type HeaderProps = {
  title?: string
  children?: ReactNode
  navOpen?: boolean
  onToggleNav?: () => void
}

/** Top bar: page title from the shared nav config, plus an optional member slot. */
export function Header({ title, children, navOpen = false, onToggleNav }: HeaderProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const pageTitle = title ?? getPageTitle(pathname)

  return (
    <header className="dashboard-header dash-header border-b border-[var(--line)] text-[var(--sea-ink)]">
      <button
        type="button"
        className="dash-menu-toggle rounded-lg border border-[var(--line)] bg-[var(--chip-bg)] text-sm font-semibold"
        aria-expanded={navOpen}
        aria-controls="dashboard-sidebar"
        aria-label={navOpen ? 'Close navigation' : 'Open navigation'}
        onClick={onToggleNav}
      >
        {navOpen ? 'Close' : 'Menu'}
      </button>
      <h1 className="header-title m-0 flex-1 text-xl font-semibold tracking-tight">
        {pageTitle}
      </h1>
      <div className="header-actions text-sm text-[var(--sea-ink-soft)]">{children}</div>
    </header>
  )
}
