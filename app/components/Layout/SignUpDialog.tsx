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

export function SignUpDialog() {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [supabaseClient] = useAtom(supabaseAtom)
  const onSubmit = async () => {
    // sign up request
    try {
      if (email === '' || password === '') return

      if (!supabaseClient) return
      const { error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
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
          onClick={() => {
            setDialogOpen(true)
          }}
        >
          Sign Up
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign Up</DialogTitle>
          <DialogDescription>Sign up.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
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
            <Label htmlFor="password" className="text-right">
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
            type="submit"
            onClick={() => {
              onSubmit()
            }}
          >
            Sign Up
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
