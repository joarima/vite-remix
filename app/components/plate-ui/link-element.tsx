import { cn, withRef } from '@udecode/cn'
import { PlateElement, useElement } from '@udecode/plate-common'
import { useLink, type TLinkElement } from '@udecode/plate-link'

export const LinkElement = withRef<typeof PlateElement>(
  ({ children, className, ...props }, ref) => {
    const element = useElement<TLinkElement>()
    const { props: linkProps } = useLink({ element })

    return (
      <PlateElement
        asChild
        className={cn(
          'font-medium text-primary underline decoration-primary underline-offset-4',
          className
        )}
        ref={ref}
        {...(linkProps as any)}
        {...props}
      >
        <a target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      </PlateElement>
    )
  }
)
