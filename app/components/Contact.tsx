import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

export function Contact() {
  return (
    <section>
      <h1 className="scroll-m-20 text-4xl  tracking-tight lg:text-5xl font-thin">
        Contact
      </h1>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl tracking-tight mt-6">
        somewhere
      </h2>
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link">@joarima.bsky.social</Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-auto max-w-xs">
          <div className="flex justify-between space-x-4">
            <Avatar>
              <AvatarImage src="ghostsandvodka2.jpg" />
              <AvatarFallback>VC</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">
                <a
                  href="https://bsky.app/profile/joarima.bsky.social"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @joarima.bsky.social
                </a>
              </h4>
              <p className="text-sm break-all">there are not many to say.</p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link">@joarima</Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-auto max-w-xs">
          <div className="flex justify-between space-x-4">
            <Avatar>
              <AvatarImage src="ghostsandvodka2.jpg" />
              <AvatarFallback>VC</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">
                <a
                  href="https://github.com/joarima/vite-react"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @joarima/vite-react
                </a>
              </h4>
              <p className="text-sm break-all">github repo.</p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </section>
  )
}
