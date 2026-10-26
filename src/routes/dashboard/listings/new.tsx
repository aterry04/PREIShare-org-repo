import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ListingForm,
  type ListingFormValues,
} from '../../../components/listings/ListingForm'
import { createListing } from '../../../server/listings'

export const Route = createFileRoute('/dashboard/listings/new')({
  component: NewListingPage,
})

function NewListingPage() {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(values: ListingFormValues) {
    setErrorMessage(null)
    setFieldErrors({})
    setIsSubmitting(true)
    try {
      const result = await createListing({ data: values })
      if (!result.ok) {
        setErrorMessage(result.error)
        setFieldErrors(result.fieldErrors ?? {})
        return
      }
      await navigate({ to: '/dashboard/listings' })
    } catch (caught) {
      setErrorMessage(caught instanceof Error ? caught.message : 'Could not create the listing.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section aria-labelledby="new-listing-heading" className="flex flex-col gap-4">
      <h1 id="new-listing-heading" className="m-0 text-2xl font-semibold text-[var(--sea-ink)]">
        Add a property listing
      </h1>
      <ListingForm
        onSubmit={handleSubmit}
        submitLabel="Create listing"
        errorMessage={errorMessage}
        fieldErrors={fieldErrors}
        isSubmitting={isSubmitting}
      />
    </section>
  )
}
