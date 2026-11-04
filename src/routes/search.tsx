import { createFileRoute } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'

export const Route = createFileRoute('/search')({
  component: PropertySearchPage,
})

type SearchResult = {
  id: string
  title: string
  description: string
  similarity: number
}

function PropertySearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'done'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) {
      setResults([])
      setStatus('done')
      setErrorMessage('Type a description of the property you want.')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/properties/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed }),
      })
      const data = (await response.json()) as {
        error?: string
        results?: SearchResult[]
      }
      if (!response.ok) {
        throw new Error(data.error || 'Search failed')
      }
      setResults(Array.isArray(data.results) ? data.results : [])
      setStatus('done')
    } catch (error) {
      setResults([])
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Search failed')
    }
  }

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell mx-auto max-w-2xl rounded-2xl p-6 sm:p-8">
        <h1 className="mb-2 text-2xl font-semibold text-[var(--sea-ink)]">
          PREIshare property search
        </h1>
        <p className="mb-6 text-sm text-[var(--sea-ink-soft)]">
          Describe the kind of investment property you want. Results match meaning, not only
          the exact words you type.
        </p>

        <form className="flex flex-col gap-3" onSubmit={onSubmit}>
          <label className="flex flex-col gap-1 text-sm text-[var(--sea-ink)]" htmlFor="q">
            Search
            <input
              id="q"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="quiet cabin near water with good rental upside"
              className="rounded-xl border border-[var(--line)] bg-transparent px-3 py-2 text-base"
            />
          </label>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-fit rounded-full bg-[var(--sea-ink)] px-4 py-2 text-sm font-semibold text-[var(--foam,#fff)] disabled:opacity-60"
          >
            {status === 'loading' ? 'Searching…' : 'Search'}
          </button>
        </form>

        {errorMessage ? (
          <p className="mt-4 text-sm text-[var(--sea-ink)]" role="alert">
            {errorMessage}
          </p>
        ) : null}

        {status === 'done' && results.length === 0 && !errorMessage ? (
          <p className="mt-4 text-sm text-[var(--sea-ink-soft)]">
            No matching properties yet. Try different words from the sample listings.
          </p>
        ) : null}

        <ul className="mt-6 flex list-none flex-col gap-4 p-0">
          {results.map((result) => (
            <li key={result.id} className="border-t border-[var(--line)] pt-4">
              <strong className="text-[var(--sea-ink)]">{result.title}</strong>
              <p className="my-1 text-sm text-[var(--sea-ink-soft)]">
                {result.description.slice(0, 160)}
                {result.description.length > 160 ? '…' : ''}
              </p>
              <p className="m-0 text-sm text-[var(--sea-ink)]">
                Similarity:{' '}
                {typeof result.similarity === 'number' ? result.similarity.toFixed(3) : '—'}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
