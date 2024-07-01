import { Button } from '@/components/ui/button'
import { getSupabaseWithHeaders } from '@/lib/auth.supabase.server'
import { ActionFunctionArgs } from '@remix-run/node'
import { redirect, useFetcher } from '@remix-run/react'

export async function action({ request }: ActionFunctionArgs) {
  const { supabase, headers } = getSupabaseWithHeaders({ request })
  await supabase.auth.signOut()
  return redirect('/', { headers })
}

export default function SignOut() {
  const fetcher = useFetcher<typeof action>({ key: 'signin' })
  return (
    <Button
      className="font-thin"
      variant="outline"
      onClick={() => {
        fetcher.submit('', {
          method: 'POST',
          action: '/signout',
          preventScrollReset: false,
        })
      }}
    >
      Logout
    </Button>
  )
}
