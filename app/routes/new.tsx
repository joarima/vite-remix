import NewPost from '@/components/NewPost'
import { getSupabaseWithSessionHeaders } from '@/lib/auth.supabase.server'
import { useAuth } from '@/lib/auth.supabaseClient'
import { savePost } from '@/lib/posts.server'
import { SEOHandle } from '@nasa-gcn/remix-seo'
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/node'

export const handle: SEOHandle = {
  getSitemapEntries: () => null,
}

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

export const action = async ({ request }: ActionFunctionArgs) => {
  const { supabase, headers, session } = await getSupabaseWithSessionHeaders({
    request,
  })
  const isLoggedIn = !!session
  if (!isLoggedIn) {
    throw redirect('/')
  }

  const formData = await request.formData()
  const contentParam = formData.get('content') as string
  const isOpenParam = formData.get('isOpen')

  if (!contentParam || !isOpenParam) {
    return json(
      { message: 'Invalid request parameter.' },
      { status: 400, headers }
    )
  }

  const postJson = JSON.parse(contentParam)

  const savePostValues = {
    supabase: supabase,
    postJson: postJson,
    isOpen: (isOpenParam as string) === 'true',
  }

  try {
    savePost(savePostValues)
  } catch (error) {
    return json({ message: error }, { status: 500, headers })
  }
  return json({ message: 'Success' }, { status: 200, headers })
}

export default function New() {
  const { isLoggedIn } = useAuth()

  return (
    <main className="container prose py-8">{isLoggedIn && <NewPost />}</main>
  )
}
