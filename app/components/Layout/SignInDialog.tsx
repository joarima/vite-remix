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
import { useState } from 'react'

import { supabaseAtom } from '@/lib/auth.supabaseClient'
import { useAtom } from 'jotai'

export function SignInDialog() {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [supabaseClient] = useAtom(supabaseAtom)
  const onSubmit = async () => {
    // sign in request
    try {
      if (email === '' || password === '') return

      if (!supabaseClient) return
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new Error(error.message)
      }
    } catch (err) {
      console.log(err)
    } finally {
      setDialogOpen(false)
    }
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
              className="col-span-3"
              onChange={(e) => {
                setEmail(e.target.value)
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right font-thin">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              className="col-span-3"
              onChange={(e) => {
                setPassword(e.target.value)
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            className="font-thin"
            type="submit"
            onClick={() => {
              onSubmit()
            }}
          >
            Sign In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
