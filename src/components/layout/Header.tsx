import type { ReactNode } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { getPageTitle } from './navConfig'

type HeaderProps = {
  title?: string
  children?: ReactNode
}

/** Top bar: page title from the shared nav config, plus an optional member slot. */
export function Header({ title, children }: HeaderProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const pageTitle = title ?? getPageTitle(pathname)

  return (
    <header className="dashboard-header flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-4 sm:px-6">
      <h1 className="header-title m-0 text-xl font-semibold tracking-tight text-[var(--sea-ink)]">
        {pageTitle}
      </h1>
      <div className="header-actions text-sm text-[var(--sea-ink-soft)]">{children}</div>
    </header>
  )
}
