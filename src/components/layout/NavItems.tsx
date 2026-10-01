import { Link, useRouterState } from '@tanstack/react-router'
import { dashboardNavItems } from './navConfig'

const linkClass =
  'block rounded-lg px-3 py-2 text-sm font-semibold no-underline'
const inactiveClass = `${linkClass} text-[var(--sea-ink-soft)] hover:bg-[var(--chip-bg)] hover:text-[var(--sea-ink)]`
const activeClass = `${linkClass} nav-link-active bg-[var(--lagoon)]/20 text-[var(--sea-ink)]`

export function NavItems() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <nav aria-label="Dashboard">
      <ul className="nav-list m-0 flex list-none flex-wrap gap-2 p-0 md:flex-col md:gap-1">
        {dashboardNavItems.map((item) => {
          const isActive =
            item.path === '/dashboard'
              ? pathname === '/dashboard' || pathname === '/dashboard/'
              : pathname === item.path || pathname.startsWith(`${item.path}/`)

          return (
            <li key={item.path}>
              <Link
                to={item.path}
                activeOptions={{ exact: item.path === '/dashboard' }}
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
  )
}
