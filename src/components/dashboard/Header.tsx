import type { ReactNode } from 'react'

export type HeaderProps = {
  /** Page or section label shown under the brand */
  title?: string
  /** Right-side actions. Unused until a later step passes them. */
  actions?: ReactNode
  /** Demo account chip. Not a signed-in user from a server. */
  accountLabel?: string
}

/**
 * Top bar for the PREIshare investor dashboard.
 * Branding plus a presentational account placeholder only.
 */
export function Header({
  title = 'Dashboard',
  actions,
  accountLabel = 'Investor',
}: HeaderProps) {
  return (
    <header
      className="flex items-center justify-between gap-4 border-b border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-[var(--sea-ink)]"
      role="banner"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--lagoon)] text-sm font-semibold text-[var(--sea-ink)]">
          P
        </div>
        <div className="min-w-0">
          <p className="m-0 truncate text-sm font-semibold">PREIshare</p>
          <p className="m-0 truncate text-xs text-[var(--sea-ink-soft)]">{title}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {actions}
        <div
          className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--chip-bg)] px-2 py-1"
          aria-label="Account placeholder"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface)] text-xs font-medium">
            IN
          </span>
          <span className="hidden text-sm sm:inline">{accountLabel}</span>
        </div>
      </div>
    </header>
  )
}
