import { getSupabaseWithSessionHeaders } from '@/lib/auth.supabase.server'
import { deletePost } from '@/lib/posts.server'
import { SEOHandle } from '@nasa-gcn/remix-seo'
import { ActionFunctionArgs, json, redirect } from '@remix-run/node'

export const handle: SEOHandle = {
  getSitemapEntries: () => null,
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
  const idParam = formData.get('id') as string

  if (!idParam) {
    return json(
      { message: 'Invalid request parameter.' },
      { status: 400, headers }
    )
  }

  const deletePostValues = {
    supabase: supabase,
    id: idParam,
  }

  try {
    deletePost(deletePostValues)
  } catch (error) {
    return json({ message: error }, { status: 500, headers })
  }
  return json({ message: 'Success' }, { status: 200, headers })
}
