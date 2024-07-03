import { getSupabaseWithSessionHeaders } from '@/lib/auth.supabase.server'
import { updatePost } from '@/lib/posts.server'
import { ActionFunctionArgs, json, redirect } from '@remix-run/node'

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
  const contentParam = formData.get('content') as string
  const isOpenParam = formData.get('isOpen')

  if (!idParam || !contentParam || !isOpenParam) {
    return json(
      { message: 'Invalid request parameter.' },
      { status: 400, headers }
    )
  }

  const postJson = JSON.parse(contentParam)

  const updatePostValues = {
    supabase: supabase,
    id: idParam,
    postJson: postJson,
    isOpen: (isOpenParam as string) === 'true',
  }

  try {
    updatePost(updatePostValues)
  } catch (error) {
    return json({ message: error }, { status: 500, headers })
  }
  return json({ message: 'Success' }, { status: 200, headers })
}
