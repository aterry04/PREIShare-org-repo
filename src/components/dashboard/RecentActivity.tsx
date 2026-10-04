export type ActivityItem = {
  id: string
  /** Already-formatted time label for display, for example "Mar 18 · 2:04 PM" */
  whenLabel: string
  description: string
  category?: string
}

export type RecentActivityProps = {
  title?: string
  items?: ActivityItem[]
  /** Shown when items is an empty list */
  emptyMessage?: string
}

/** MOCK PLACEHOLDER — replace with a real activity feed later */
export const MOCK_RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: 'a1',
    whenLabel: 'Mar 18, 2026 · 2:04 PM',
    description: 'Distribution posted for Riverfront Multifamily (sample)',
    category: 'Distribution',
  },
  {
    id: 'a2',
    whenLabel: 'Mar 17, 2026 · 11:20 AM',
    description: 'Quarterly report available for Cedar Retail Plaza (sample)',
    category: 'Document',
  },
  {
    id: 'a3',
    whenLabel: 'Mar 15, 2026 · 9:00 AM',
    description: 'Capital call reminder — Harbor Industrial (sample)',
    category: 'Notice',
  },
]

export function RecentActivity({
  title = 'Recent activity',
  items = MOCK_RECENT_ACTIVITY,
  emptyMessage = 'No recent activity',
}: RecentActivityProps) {
  return (
    <section
      className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-4"
      aria-label={title}
    >
      <h2 className="m-0 text-lg font-semibold text-[var(--sea-ink)]">{title}</h2>
      {items.length === 0 ? (
        <p className="m-0 mt-4 text-sm text-[var(--sea-ink-soft)]">{emptyMessage}</p>
      ) : (
        <ul className="m-0 mt-4 list-none space-y-3 p-0">
          {items.map((item) => (
            <li key={item.id} className="border-l-2 border-[var(--line)] pl-3">
              <p className="m-0 text-xs text-[var(--sea-ink-soft)]">{item.whenLabel}</p>
              <p className="m-0 text-sm font-medium text-[var(--sea-ink)]">{item.description}</p>
              {item.category ? (
                <p className="m-0 text-xs text-[var(--sea-ink-soft)]">{item.category}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
