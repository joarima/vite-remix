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

export const userAtom = atom<User | null>(null)
export const sessionAtom = atom<Session | null>(null)
export const supabaseAtom = atom<TypedSupabaseClient | null>(null)

export function useSupabase() {
  // Singleton
  const [supabase] = useState(() =>
    createBrowserClient<Database>(
      import.meta.env.VITE_SUPABASE_URL!,
      import.meta.env.VITE_SUPABASE_API_KEY!
    )
  )

  const [, setSupabaseClient] = useAtom(supabaseAtom)

  setSupabaseClient(supabase)

  const revalidator = useRevalidator()

  const [serverAccessToken, setServerAccessToken] = useState<
    string | undefined
  >(undefined)

  supabase.auth.getSession().then(({ data }) => {
    setServerAccessToken(data.session?.access_token)
  })

  // const serverAccessToken = data.session?.access_token

  const [, setUser] = useAtom(userAtom)
  const [, setSession] = useAtom(sessionAtom)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event happened: ', event, session)

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
