import { createFileRoute } from '@tanstack/react-router'

type SearchBody = {
  query?: unknown
}

export const Route = createFileRoute('/api/properties/search')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json().catch(() => ({}))) as SearchBody
          const query = typeof body.query === 'string' ? body.query.trim() : ''

          if (!query) {
            return Response.json(
              { error: 'Query is required', results: [] },
              { status: 400 },
            )
          }

          const { searchPropertiesByText } = await import('../../../lib/property-search')
          const results = await searchPropertiesByText(query)
          return Response.json({ query, results })
        } catch (error) {
          console.error('property search failed')
          if (error instanceof Error) console.error(error.message)
          return Response.json({ error: 'Search failed', results: [] }, { status: 500 })
        }
      },
    },
  },
})
