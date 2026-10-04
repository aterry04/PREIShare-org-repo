export type DashboardNavItem = {
  label: string
  to: '/dashboard' | '/dashboard/portfolio' | '/dashboard/activity'
}

/** Same labels and paths for Sidebar and MobileNav. From the routing plan. */
export const dashboardNavItems: DashboardNavItem[] = [
  { label: 'Overview', to: '/dashboard' },
  { label: 'Portfolio', to: '/dashboard/portfolio' },
  { label: 'Activity', to: '/dashboard/activity' },
]

export function isDashboardNavActive(pathname: string, to: DashboardNavItem['to']): boolean {
  if (to === '/dashboard') {
    return pathname === '/dashboard' || pathname === '/dashboard/'
  }
  return pathname === to || pathname.startsWith(`${to}/`)
}
