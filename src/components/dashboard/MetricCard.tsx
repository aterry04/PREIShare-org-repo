import type { ReactNode } from 'react'

export type MetricCardProps = {
  /** Short label shown above the value, for example "Total portfolio value" */
  label: string
  /** Main figure investors should see first */
  value: string
  /** Optional secondary line, for example "Sample total" */
  hint?: string
  /** Optional icon or badge slot */
  icon?: ReactNode
}

/**
 * One reusable metric tile. The parent passes label, value, and hint.
 * This component does not fetch a balance and does not draw a chart.
 */
export function MetricCard({ label, value, hint, icon }: MetricCardProps) {
  return (
    <article
      className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-4"
      aria-label={label}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="m-0 text-sm font-medium text-[var(--sea-ink-soft)]">{label}</p>
        {icon ? <span aria-hidden="true">{icon}</span> : null}
      </div>
      <p className="m-0 mt-2 text-2xl font-semibold tracking-tight text-[var(--sea-ink)]">
        {value}
      </p>
      {hint ? (
        <p className="m-0 mt-1 text-sm text-[var(--sea-ink-soft)]">{hint}</p>
      ) : null}
    </article>
  )
}
