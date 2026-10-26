import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useState, type FormEvent } from 'react'
import { createBrowserSupabaseClient } from '../lib/supabase.client'

const storeSponsorSession = createServerFn({ method: 'POST' })
  .validator((input: unknown) => {
    if (
      typeof input !== 'object' ||
      input === null ||
      !('accessToken' in input) ||
      !('refreshToken' in input) ||
      typeof input.accessToken !== 'string' ||
      typeof input.refreshToken !== 'string'
    ) {
      throw new Error('Missing session tokens.')
    }
    return {
      accessToken: input.accessToken,
      refreshToken: input.refreshToken,
    }
  })
  .handler(async ({ data }) => {
    const { saveSponsorSession } = await import('../lib/auth/session')
    await saveSponsorSession(data.accessToken, data.refreshToken)
  })

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)
    setIsSubmitting(true)
    try {
      const supabase = createBrowserSupabaseClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (error || !data.session) {
        setErrorMessage(error?.message || 'Sign-in failed. Check your email and password.')
        return
      }
      await storeSponsorSession({
        data: {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
        },
      })
      await navigate({ to: '/dashboard' })
    } catch (caught) {
      setErrorMessage(caught instanceof Error ? caught.message : 'Could not sign in.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell mx-auto max-w-md rounded-2xl p-6 sm:p-8">
        <h1 className="mb-2 text-2xl font-semibold text-[var(--sea-ink)]">Sponsor sign in</h1>
        <p className="mb-6 text-sm text-[var(--sea-ink-soft)]">
          Sign in to manage PREIshare properties you are allowed to see.
        </p>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1 text-sm text-[var(--sea-ink)]">
            Email
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-[var(--sea-ink)]">
            Password
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2"
            />
          </label>
          {errorMessage ? (
            <p role="alert" className="m-0 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-[var(--lagoon)] px-4 py-2 text-sm font-semibold text-[var(--sea-ink)] disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-4 text-sm text-[var(--sea-ink-soft)]">
          New sponsor?{' '}
          <Link to="/auth/signup" className="font-semibold text-[var(--lagoon-deep)]">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  )
}
