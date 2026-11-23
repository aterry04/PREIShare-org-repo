import assert from 'node:assert/strict'
import { test } from 'node:test'
import { isDashboardNavActive } from '../src/components/dashboard/navItems.ts'
import { createListingSchema } from '../src/lib/listings/schema.ts'

const draft = {
  title: 'Harbor Court',
  property_type: 'multifamily',
  address_line1: '1 Harbor Court',
  city: 'Seattle',
  region: 'WA',
  postal_code: '98101',
  asking_price: 100,
}

test('a draft listing does not require a summary', () => {
  const parsed = createListingSchema.safeParse(draft)
  assert.equal(parsed.success, true)
})

test('a published listing requires a summary', () => {
  const parsed = createListingSchema.safeParse({
    ...draft,
    status: 'published',
    summary: '   ',
  })
  assert.equal(parsed.success, false)
  if (!parsed.success) {
    assert.equal(parsed.error.issues.some((issue) => issue.path[0] === 'summary'), true)
  }
})

test('dashboard overview is active only on the overview path', () => {
  assert.equal(isDashboardNavActive('/dashboard', '/dashboard'), true)
  assert.equal(isDashboardNavActive('/dashboard/portfolio', '/dashboard'), false)
  assert.equal(isDashboardNavActive('/dashboard/portfolio', '/dashboard/portfolio'), true)
})
