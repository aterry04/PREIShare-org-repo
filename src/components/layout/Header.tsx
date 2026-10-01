import type { ReactNode } from 'react'

type HeaderProps = {
  title?: string
  children?: ReactNode
}

/** Top bar: page title plus an optional member or actions slot. */
export function Header({ title = 'Investor Dashboard', children }: HeaderProps) {
  return (
    <header className="dashboard-header flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-4 sm:px-6">
      <h1 className="header-title m-0 text-xl font-semibold tracking-tight text-[var(--sea-ink)]">
        {title}
      </h1>
      <div className="header-actions text-sm text-[var(--sea-ink-soft)]">{children}</div>
    </header>
  )
}
