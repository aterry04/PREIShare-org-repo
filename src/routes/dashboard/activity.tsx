import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/activity')({
  component: ActivityPlaceholder,
})

function ActivityPlaceholder() {
  return (
    <section aria-labelledby="activity-heading">
      <h2 id="activity-heading" className="text-xl font-semibold text-[var(--sea-ink)]">
        Activity
      </h2>
      <p className="mt-2 max-w-prose text-[var(--sea-ink-soft)]">
        A fuller activity list will appear here. This placeholder gives the
        Activity link a real page inside the dashboard shell.
      </p>
    </section>
  )
}
