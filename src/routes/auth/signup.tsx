import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useState, type FormEvent } from 'react'
import { createBrowserSupabaseClient } from '../../lib/supabase/client'

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
    const { saveSponsorSession } = await import('../../lib/auth/session')
    await saveSponsorSession(data.accessToken, data.refreshToken)
  })

export const Route = createFileRoute('/auth/signup')({
  component: SignupPage,
})

function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setNotice('')
    setPending(true)
    try {
      const supabase = createBrowserSupabaseClient()
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      })
      if (signUpError) {
        setError(signUpError.message)
        return
      }
      if (!data.session) {
        setNotice('Check your email to confirm the account, then log in.')
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
      setError(caught instanceof Error ? caught.message : 'Could not create the account.')
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell mx-auto max-w-md rounded-2xl p-6 sm:p-8">
        <h1 className="mb-2 text-2xl font-semibold text-[var(--sea-ink)]">Create a sponsor account</h1>
        <p className="mb-6 text-sm text-[var(--sea-ink-soft)]">
          Use your email and a password to sign up for PREIshare.
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
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2"
            />
          </label>
          {error ? (
            <p role="alert" className="m-0 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          {notice ? (
            <p role="status" className="m-0 text-sm text-[var(--sea-ink)]">
              {notice}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-[var(--lagoon)] px-4 py-2 text-sm font-semibold text-[var(--sea-ink)] disabled:opacity-60"
          >
            {pending ? 'Creating account…' : 'Sign up'}
          </button>
        </form>
        <p className="mt-4 text-sm text-[var(--sea-ink-soft)]">
          Already have an account?{' '}
          <Link to="/auth/login" className="font-semibold text-[var(--lagoon-deep)]">
            Log in
          </Link>
        </p>
      </section>
    </main>
  )
}
