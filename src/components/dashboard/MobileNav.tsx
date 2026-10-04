import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  dashboardNavItems,
  isDashboardNavActive,
  type DashboardNavItem,
} from './navItems'

const linkClass =
  'block min-h-11 rounded-lg px-3 py-2 text-sm font-semibold no-underline'
const inactiveClass = `${linkClass} text-[var(--sea-ink-soft)] hover:bg-[var(--chip-bg)] hover:text-[var(--sea-ink)]`
const activeClass = `${linkClass} bg-[var(--lagoon)]/20 text-[var(--sea-ink)]`

export type MobileNavProps = {
  items?: DashboardNavItem[]
}

export function MobileNav({ items = dashboardNavItems }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        className="min-h-11 rounded-lg border border-[var(--line)] bg-[var(--chip-bg)] px-3 text-sm font-semibold text-[var(--sea-ink)]"
        aria-expanded={open}
        aria-controls="mobile-dashboard-menu"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? 'Close menu' : 'Open menu'}
      </button>
      {open ? (
        <nav
          id="mobile-dashboard-menu"
          aria-label="Dashboard"
          className="absolute left-0 right-0 top-full z-20 mt-2 rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] p-3 shadow-lg"
        >
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {items.map((item) => {
              const isActive = isDashboardNavActive(pathname, item.to)
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    activeOptions={{ exact: item.to === '/dashboard' }}
                    className={isActive ? activeClass : inactiveClass}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      ) : null}
    </div>
  )
}
