import { getSupabaseWithSessionHeaders } from '@/lib/auth.supabase.server'
import { ActionFunctionArgs, json, redirect } from '@remix-run/node'

export async function action({ request }: ActionFunctionArgs) {
  const { supabase, headers, session } = await getSupabaseWithSessionHeaders({
    request,
  })

  const isLoggedIn = !!session
  if (!isLoggedIn) {
    throw redirect('/')
  }
  try {
    await supabase.auth.signOut()
  } catch (error) {
    return json({ message: error }, { status: 500, headers })
  }
  return json({ message: 'Success' }, { status: 200, headers })
}
