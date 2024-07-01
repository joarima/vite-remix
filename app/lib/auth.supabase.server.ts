import { Database } from '@/types/supabase'
import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from '@supabase/ssr'

export const getSupabaseEnv = () => ({
  SUPABASE_URL: process.env.VITE_SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_API_KEY!,
})

export function getSupabaseWithHeaders({ request }: { request: Request }) {
  const headers = new Headers()

  const supabase = createServerClient<Database>(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_API_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get('Cookie') ?? '')
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            headers.append(
              'Set-Cookie',
              serializeCookieHeader(name, value, options)
            )
          )
        },
      },
      auth: {
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    }
  )

  return { supabase, headers }
}

export async function getSupabaseWithSessionHeaders({
  request,
}: {
  request: Request
}) {
  const { supabase, headers } = getSupabaseWithHeaders({
    request,
  })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return { session, headers, supabase }
}
