export type InvestorProfile = {
  displayName: string
  email: string
  membershipTier: string
  preferredContact: string
  notes: string
}

const mockProfile: InvestorProfile = {
  displayName: 'Sample Investor',
  email: 'sample.investor@example.com',
  membershipTier: 'Preferred investor',
  preferredContact: 'Email',
  notes: 'Interested in multifamily and industrial deals in the Southeast.',
}

type ProfileCardProps = {
  profile?: InvestorProfile
}

export function ProfileCard({ profile = mockProfile }: ProfileCardProps) {
  return (
    <section
      className="dashboard-panel profile-card rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-4 sm:p-5"
      aria-label="Investor profile"
    >
      <h2 className="m-0 text-lg font-semibold text-[var(--sea-ink)]">Your profile</h2>
      <p className="sample-data-banner m-0 mt-2 text-sm text-[var(--sea-ink-soft)]" role="note">
        Sample profile — not a live account
      </p>
      <dl className="m-0 mt-4 space-y-3">
        <div>
          <dt className="text-sm font-semibold text-[var(--sea-ink-soft)]">Name</dt>
          <dd className="m-0 text-[var(--sea-ink)]">{profile.displayName}</dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-[var(--sea-ink-soft)]">Email</dt>
          <dd className="m-0 text-[var(--sea-ink)]">{profile.email}</dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-[var(--sea-ink-soft)]">Membership</dt>
          <dd className="m-0 text-[var(--sea-ink)]">{profile.membershipTier}</dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-[var(--sea-ink-soft)]">Preferred contact</dt>
          <dd className="m-0 text-[var(--sea-ink)]">{profile.preferredContact}</dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-[var(--sea-ink-soft)]">Notes</dt>
          <dd className="m-0 text-[var(--sea-ink)]">{profile.notes}</dd>
        </div>
      </dl>
    </section>
  )
}
