import { Database } from '@/types/supabase'
import { useRevalidator } from '@remix-run/react'
import { createBrowserClient } from '@supabase/ssr'
import type { Session, SupabaseClient, User } from '@supabase/supabase-js'
import { atom, useAtom } from 'jotai'
import { useEffect, useMemo, useState } from 'react'

export type TypedSupabaseClient = SupabaseClient<Database>

export type SupabaseOutletContext = {
  supabase: TypedSupabaseClient
  domainUrl: string
}

type SupabaseEnv = {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
}

type UseSupabase = {
  env: SupabaseEnv
  session: Session | null
}

export const userAtom = atom<User | null>(null)
export const sessionAtom = atom<Session | null>(null)
export const supabaseAtom = atom<TypedSupabaseClient | null>(null)

export function useSupabase({ env, session }: UseSupabase) {
  // Singleton
  const [supabase] = useState(() =>
    createBrowserClient<Database>(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY!)
  )

  const [, setSupabaseClient] = useAtom(supabaseAtom)

  setSupabaseClient(supabase)

  const revalidator = useRevalidator()

  const serverAccessToken = session?.access_token

  const [, setUser] = useAtom(userAtom)
  const [, setSession] = useAtom(sessionAtom)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // console.log('Auth event happened: ', event, session)

      if (event === 'SIGNED_OUT') {
        setSession(null)
        setUser(null)
      } else {
        setSession(session)
        setUser(session?.user || null)
      }

      if (session?.access_token !== serverAccessToken) {
        // call loaders
        revalidator.revalidate()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, serverAccessToken, revalidator])

  return { supabase }
}

export function useAuth() {
  const [user] = useAtom(userAtom)
  const [session] = useAtom(sessionAtom)

  const isLoggedIn = useMemo(() => {
    return !!user
  }, [user])

  return {
    user,
    session,
    isLoggedIn,
  }
}

export function getRealTimeSubscription(
  supabase: TypedSupabaseClient,
  callback: () => void
) {
  return supabase
    .channel('realtime posts and likes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'posts',
      },
      () => {
        callback()
      }
    )
    .subscribe()
}
