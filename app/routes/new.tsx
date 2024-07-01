import NewPost from '@/components/NewPost'
import { useAuth } from '@/lib/auth.supabaseClient'
import { LoaderFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/react'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookie = request.headers.get('cookie' as string)
  if (!cookie) {
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
