import { createClientOnlyFn } from '@tanstack/react-start'

type BrowserSession = {
  accessToken: string
  refreshToken: string
}

export const signInWithPasswordOnBrowser = createClientOnlyFn(
  async (email: string, password: string) => {
    const { createBrowserSupabaseClient } = await import('../supabase.client')
    const { data, error } = await createBrowserSupabaseClient().auth.signInWithPassword({
      email,
      password,
    })
    if (error || !data.session) {
      return { session: null as BrowserSession | null, message: error?.message ?? null }
    }
    return {
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
      },
      message: null,
    }
  },
)

export const signUpOnBrowser = createClientOnlyFn(async (email: string, password: string) => {
  const { createBrowserSupabaseClient } = await import('../supabase.client')
  const { data, error } = await createBrowserSupabaseClient().auth.signUp({
    email,
    password,
  })
  if (error) {
    return { session: null as BrowserSession | null, message: error.message }
  }
  if (!data.session) {
    return { session: null as BrowserSession | null, message: null }
  }
  return {
    session: {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    },
    message: null,
  }
})

export const signOutOnBrowser = createClientOnlyFn(async () => {
  const { createBrowserSupabaseClient } = await import('../supabase.client')
  await createBrowserSupabaseClient().auth.signOut()
})
