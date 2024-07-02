import NewPost from '@/components/NewPost'
import { getSupabaseWithSessionHeaders } from '@/lib/auth.supabase.server'
import { useAuth } from '@/lib/auth.supabaseClient'
import { LoaderFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/react'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await getSupabaseWithSessionHeaders({
    request,
  })

  const isLoggedIn = !!session

  if (!isLoggedIn) {
    throw redirect('/')
  }

  return null
}

export default function New() {
  const { isLoggedIn } = useAuth()
  return (
    <main className="container prose py-8">{isLoggedIn && <NewPost />}</main>
  )
}
