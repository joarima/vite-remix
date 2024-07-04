import { Button } from '@/components/ui/button'
import { useNavigate, useRevalidator } from '@remix-run/react'
import { useToast } from '../ui/use-toast'

export default function SignOut() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const revalidator = useRevalidator()
  const onClick = () => {
    fetch('/api/signout', {
      method: 'POST',
    }).then((res: Response) => {
      if (res.status === 200) {
        revalidator.revalidate()
        toast({
          title: 'sign out.',
        })
        navigate('/')
      } else {
        toast({
          title: 'some error occurred.',
          description: `${res.body}`,
        })
      }
    })
  }
  return (
    <Button className="font-thin" variant="outline" onClick={onClick}>
      Logout
    </Button>
  )
}
