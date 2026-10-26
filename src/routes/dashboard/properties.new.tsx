import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useState, type FormEvent } from 'react'

const propertyTypes = [
  'multifamily',
  'office',
  'retail',
  'industrial',
  'mixed_use',
  'land',
] as const

type CreatePropertyInput = {
  title: string
  address: string
  city: string
  region: string
  postalCode: string
  propertyType: (typeof propertyTypes)[number]
  askingPrice: number
  description?: string
}

export const createProperty = createServerFn({ method: 'POST' })
  .validator((input: unknown): CreatePropertyInput => {
    if (typeof input !== 'object' || input === null) {
      throw new Error('Check the property fields and try again.')
    }
    const data = input as Record<string, unknown>
    if ('owner_id' in data || 'sponsor_id' in data) {
      throw new Error('Owner is set from your session, not the form.')
    }
    const propertyType = data.propertyType
    if (
      typeof data.title !== 'string' ||
      typeof data.address !== 'string' ||
      typeof data.city !== 'string' ||
      typeof data.region !== 'string' ||
      typeof data.postalCode !== 'string' ||
      typeof data.askingPrice !== 'number' ||
      typeof propertyType !== 'string' ||
      !propertyTypes.includes(propertyType as (typeof propertyTypes)[number])
    ) {
      throw new Error('Check the property fields and try again.')
    }
    return {
      title: data.title,
      address: data.address,
      city: data.city,
      region: data.region,
      postalCode: data.postalCode,
      propertyType: propertyType as (typeof propertyTypes)[number],
      askingPrice: data.askingPrice,
      description: typeof data.description === 'string' ? data.description : undefined,
    }
  })
  .handler(async ({ data }) => {
    const { readSponsorAccessToken } = await import('../../lib/auth/session')
    const { createSupabaseServerClient } = await import('../../lib/supabase.server')
    const accessToken = readSponsorAccessToken()
    if (!accessToken) {
      return { ok: false as const, error: 'You must be signed in to add a property.' }
    }

    const supabase = createSupabaseServerClient(accessToken)
    const { data: userData, error: userError } = await supabase.auth.getUser(accessToken)
    if (userError || !userData.user) {
      return { ok: false as const, error: 'You must be signed in to add a property.' }
    }

    const title = data.title.trim()
    const address = data.address.trim()
    const city = data.city.trim()
    const region = data.region.trim()
    const postalCode = data.postalCode.trim()
    if (!title || !address || !city || !region || !postalCode || data.askingPrice < 0) {
      return { ok: false as const, error: 'Check the property fields and try again.' }
    }

    const { data: row, error } = await supabase
      .from('property_listings')
      .insert({
        owner_id: userData.user.id,
        title,
        summary: data.description?.trim() || null,
        property_type: data.propertyType,
        address_line1: address,
        city,
        region,
        postal_code: postalCode,
        asking_price: data.askingPrice,
        country: 'US',
        currency: 'USD',
        status: 'draft',
      })
      .select('id')
      .single()

    if (error || !row) {
      return {
        ok: false as const,
        error: error?.message ?? 'Could not create the property. Try again.',
      }
    }

    return { ok: true as const, id: row.id }
  })

export const Route = createFileRoute('/dashboard/properties/new')({
  component: NewPropertyPage,
})

function NewPropertyPage() {
  const navigate = useNavigate()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [region, setRegion] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [propertyType, setPropertyType] = useState<(typeof propertyTypes)[number]>('multifamily')
  const [askingPrice, setAskingPrice] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const price = Number(askingPrice)
    if (!title.trim() || !address.trim() || !city.trim() || !region.trim() || !postalCode.trim()) {
      setError('Check the property fields and try again.')
      return
    }
    if (!Number.isFinite(price) || price < 0) {
      setError('Enter an asking price of zero or more.')
      return
    }

    setPending(true)
    try {
      const result = await createProperty({
        data: {
          title,
          address,
          city,
          region,
          postalCode,
          propertyType,
          askingPrice: price,
          description,
        },
      })
      if (!result.ok) {
        setError(result.error)
        return
      }
      await router.invalidate()
      await navigate({ to: '/dashboard/properties' })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not create the property. Try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="mx-auto max-w-lg space-y-4" aria-labelledby="new-property-heading">
      <header className="space-y-1">
        <h1 id="new-property-heading" className="text-2xl font-semibold text-[var(--sea-ink)]">
          Add property
        </h1>
        <p className="text-sm text-[var(--sea-ink-soft)]">
          New listings are saved for your sponsor account only. The database sets the owner from your session.
        </p>
      </header>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <label className="flex flex-col gap-1 text-sm text-[var(--sea-ink)]">
          Title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            disabled={pending}
            className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[var(--sea-ink)]">
          Property type
          <select
            value={propertyType}
            onChange={(event) =>
              setPropertyType(event.target.value as (typeof propertyTypes)[number])
            }
            disabled={pending}
            className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2"
          >
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-[var(--sea-ink)]">
          Address
          <input
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            required
            disabled={pending}
            className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[var(--sea-ink)]">
          City
          <input
            value={city}
            onChange={(event) => setCity(event.target.value)}
            required
            disabled={pending}
            className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[var(--sea-ink)]">
          Region
          <input
            value={region}
            onChange={(event) => setRegion(event.target.value)}
            required
            disabled={pending}
            className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[var(--sea-ink)]">
          Postal code
          <input
            value={postalCode}
            onChange={(event) => setPostalCode(event.target.value)}
            required
            disabled={pending}
            className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[var(--sea-ink)]">
          Asking price
          <input
            type="number"
            min={0}
            step="0.01"
            value={askingPrice}
            onChange={(event) => setAskingPrice(event.target.value)}
            required
            disabled={pending}
            className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[var(--sea-ink)]">
          Description
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            disabled={pending}
            className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2"
          />
        </label>
        {error ? (
          <p role="alert" className="m-0 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[var(--lagoon)] px-4 py-2 text-sm font-semibold text-[var(--sea-ink)] disabled:opacity-60"
        >
          {pending ? 'Saving…' : 'Create property'}
        </button>
      </form>
    </section>
  )
}
