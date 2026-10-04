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

export type SidebarProps = {
  items?: DashboardNavItem[]
}

export function Sidebar({ items = dashboardNavItems }: SidebarProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <aside className="hidden w-60 shrink-0 border-r border-[var(--line)] md:block">
      <nav className="p-4" aria-label="Dashboard">
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
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
