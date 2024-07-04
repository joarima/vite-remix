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
import { useToast } from '@/components/ui/use-toast'
// import { supabaseServerClient } from '@/lib/supabase.server'
import { useNavigate, useRevalidator } from '@remix-run/react'
import { useState } from 'react'

export default function SignInDialog() {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const navigate = useNavigate()
  const { toast } = useToast()
  const revalidator = useRevalidator()

  const onSubmit = async () => {
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)
    fetch('/api/signin', {
      method: 'POST',
      body: formData,
    }).then((res: Response) => {
      if (res.status === 200) {
        revalidator.revalidate()
        toast({
          title: 'sign in.',
        })
        setDialogOpen(false)
        navigate('/')
      } else {
        toast({
          title: 'some error occurred.',
          description: `${res.body}`,
        })
        setDialogOpen(false)
      }
    })
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
        <form>
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
                name="password"
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
              onClick={(event) => {
                event.preventDefault()
                onSubmit()
              }}
            >
              Sign In
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
