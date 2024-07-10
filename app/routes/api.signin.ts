import { getSupabaseWithHeaders } from '@/lib/auth.supabase.server'
import { SEOHandle } from '@nasa-gcn/remix-seo'
import { ActionFunctionArgs, json } from '@remix-run/node'

export const handle: SEOHandle = {
  getSitemapEntries: () => null,
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()

  const email = formData.get('email')
  const password = formData.get('password')
  const { supabase, headers } = getSupabaseWithHeaders({ request })

  const { error } = await supabase.auth.signInWithPassword({
    email: email as string,
    password: password as string,
  })

  if (error) {
    return json({ message: error }, { status: 500, headers })
  }
  return json({ message: 'Success' }, { status: 200, headers })
}
