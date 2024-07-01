import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getSupabaseWithHeaders } from '@/lib/auth.supabase.server'
// import { supabaseServerClient } from '@/lib/supabase.server'
import { ActionFunctionArgs, json } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { useState } from 'react'

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()

  const email = formData.get('email')
  const password = formData.get('password')
  const { supabase, headers } = getSupabaseWithHeaders({ request })

  const { error, data } = await supabase.auth.signInWithPassword({
    email: email as string,
    password: password as string,
  })

  if (error) {
    throw new Error(error.message)
  }
  return json({ success: true, data: data }, { headers })
}

export default function SignInDialog() {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  const fetcher = useFetcher<typeof action>({ key: 'signin' })

  const onSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    await fetcher.submit(e.currentTarget, {
      method: 'POST',
      preventScrollReset: false,
    })
    setDialogOpen(false)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="font-thin"
          variant="outline"
          onClick={() => {
            setDialogOpen(true)
          }}
        >
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <fetcher.Form method="post" action="/signin">
          <DialogHeader>
            <DialogTitle className="font-thin">Sign In</DialogTitle>
            <DialogDescription className="font-thin">
              Sign in to edit.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right font-thin">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right font-thin">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                name="password"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="font-thin"
              type="submit"
              onClick={(event) => {
                event.preventDefault()
                onSubmit(event)
              }}
            >
              Sign In
            </Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  )
}
