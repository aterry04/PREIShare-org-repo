import type { FormEvent } from 'react'

const propertyTypes = [
  'multifamily',
  'office',
  'retail',
  'industrial',
  'mixed_use',
  'land',
] as const

const statuses = ['draft', 'published', 'under_offer', 'sold', 'archived'] as const

export type ListingFormValues = {
  title: string
  summary?: string
  property_type: (typeof propertyTypes)[number]
  address_line1: string
  address_line2?: string
  city: string
  region: string
  postal_code: string
  country?: string
  asking_price: string
  status: (typeof statuses)[number]
  closed_at?: string
}

export type ListingFormProps = {
  onSubmit: (values: ListingFormValues) => void | Promise<void>
  submitLabel?: string
  errorMessage?: string | null
  fieldErrors?: Record<string, string[]>
  isSubmitting?: boolean
}

const fieldClass =
  'rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-[var(--sea-ink)] disabled:opacity-60'

export function ListingForm({
  onSubmit,
  submitLabel = 'Save listing',
  errorMessage = null,
  fieldErrors,
  isSubmitting = false,
}: ListingFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const summary = String(data.get('summary') ?? '').trim()
    const addressLine2 = String(data.get('address_line2') ?? '').trim()
    const closedAt = String(data.get('closed_at') ?? '').trim()
    const propertyType = String(data.get('property_type') ?? '')
    const status = String(data.get('status') ?? 'draft')

    void onSubmit({
      title: String(data.get('title') ?? ''),
      summary: summary || undefined,
      property_type: propertyType as ListingFormValues['property_type'],
      address_line1: String(data.get('address_line1') ?? ''),
      address_line2: addressLine2 || undefined,
      city: String(data.get('city') ?? ''),
      region: String(data.get('region') ?? ''),
      postal_code: String(data.get('postal_code') ?? ''),
      country: String(data.get('country') ?? '').trim() || undefined,
      asking_price: String(data.get('asking_price') ?? ''),
      status: status as ListingFormValues['status'],
      closed_at: closedAt || undefined,
    })
  }

  return (
    <form className="flex max-w-xl flex-col gap-4" onSubmit={handleSubmit}>
      {errorMessage ? (
        <p role="alert" className="m-0 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}
      {fieldErrors && Object.keys(fieldErrors).length > 0 ? (
        <ul role="alert" className="m-0 list-disc pl-5 text-sm text-red-700">
          {Object.entries(fieldErrors).map(([field, messages]) => (
            <li key={field}>
              {field}: {messages.join(' ')}
            </li>
          ))}
        </ul>
      ) : null}

      <Field id="listing-title" label="Title" name="title" required disabled={isSubmitting} />
      <label className="flex flex-col gap-1 text-sm text-[var(--sea-ink)]" htmlFor="listing-property-type">
        Property type
        <select
          id="listing-property-type"
          name="property_type"
          required
          disabled={isSubmitting}
          className={fieldClass}
          defaultValue="multifamily"
        >
          {propertyTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <Field
        id="listing-address"
        label="Street address"
        name="address_line1"
        required
        disabled={isSubmitting}
      />
      <Field id="listing-address-2" label="Unit or suite" name="address_line2" disabled={isSubmitting} />
      <Field id="listing-city" label="City" name="city" required disabled={isSubmitting} />
      <Field id="listing-region" label="Region" name="region" required disabled={isSubmitting} />
      <Field
        id="listing-postal-code"
        label="Postal code"
        name="postal_code"
        required
        disabled={isSubmitting}
      />
      <Field
        id="listing-country"
        label="Country"
        name="country"
        defaultValue="US"
        disabled={isSubmitting}
      />
      <Field
        id="listing-price"
        label="Asking price"
        name="asking_price"
        type="number"
        min="0"
        step="0.01"
        required
        disabled={isSubmitting}
      />
      <label className="flex flex-col gap-1 text-sm text-[var(--sea-ink)]" htmlFor="listing-summary">
        Summary
        <textarea
          id="listing-summary"
          name="summary"
          disabled={isSubmitting}
          className={fieldClass}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-[var(--sea-ink)]" htmlFor="listing-status">
        Status
        <select
          id="listing-status"
          name="status"
          required
          disabled={isSubmitting}
          className={fieldClass}
          defaultValue="draft"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>
      <Field
        id="listing-closed-at"
        label="Closed at"
        name="closed_at"
        type="datetime-local"
        disabled={isSubmitting}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-fit rounded-full bg-[var(--lagoon)] px-4 py-2 text-sm font-semibold text-[var(--sea-ink)] disabled:opacity-60"
      >
        {isSubmitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}

function Field({
  id,
  label,
  name,
  type = 'text',
  required = false,
  disabled = false,
  defaultValue,
  min,
  step,
}: {
  id: string
  label: string
  name: string
  type?: string
  required?: boolean
  disabled?: boolean
  defaultValue?: string
  min?: string
  step?: string
}) {
  return (
    <label className="flex flex-col gap-1 text-sm text-[var(--sea-ink)]" htmlFor={id}>
      {label}
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        disabled={disabled}
        defaultValue={defaultValue}
        min={min}
        step={step}
        className={fieldClass}
      />
    </label>
  )
}
