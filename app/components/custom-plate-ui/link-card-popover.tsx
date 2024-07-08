import React, { useEffect } from 'react'

import {
  isSelectionExpanded,
  useEditorSelector,
  useElement,
  useRemoveNodeButton,
} from '@udecode/plate-common'

import {
  FloatingMedia as FloatingMediaPrimitive,
  floatingMediaActions,
  useFloatingMediaSelectors,
} from '@udecode/plate-media'
import { useReadOnly, useSelected } from 'slate-react'

import { Icons } from '@/components/plate-ui/icons'

import { Button, buttonVariants } from '@/components/plate-ui/button'
import { CaptionButton } from '@/components/plate-ui/caption'
import { inputVariants } from '@/components/plate-ui/input'
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/plate-ui/popover'
import { Separator } from '@/components/plate-ui/separator'

export interface MediaPopoverProps {
  children: React.ReactNode
  pluginKey?: string
  url?: string
  onCaptionButtonClick?: () => void
}

export function LinkCardPopover({
  children,
  pluginKey,
  url,
  onCaptionButtonClick,
}: MediaPopoverProps) {
  const readOnly = useReadOnly()
  const selected = useSelected()

  const selectionCollapsed = useEditorSelector(
    (editor) => !isSelectionExpanded(editor),
    []
  )
  // const isOpen = !readOnly && selected && selectionCollapsed
  const isOpen = true
  const isEditing = useFloatingMediaSelectors().isEditing()

  useEffect(() => {
    if (!isOpen && isEditing) {
      floatingMediaActions.isEditing(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const element = useElement()
  const { props: buttonProps } = useRemoveNodeButton({ element })

  if (readOnly) return <>{children}</>

  return (
    <Popover modal={false} open={isOpen}>
      <PopoverAnchor>{children}</PopoverAnchor>

      <PopoverContent
        className="w-auto p-1"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {isEditing ? (
          <div className="flex w-[330px] flex-col">
            <div className="flex items-center">
              <div className="flex items-center pl-3 text-muted-foreground">
                <Icons.link className="size-4" />
              </div>

              <FloatingMediaPrimitive.UrlInput
                className={inputVariants({ h: 'sm', variant: 'ghost' })}
                options={{
                  pluginKey,
                }}
                placeholder="Paste the embed link..."
              />
            </div>
          </div>
        ) : (
          <div className="box-content flex h-9 items-center gap-1">
            <FloatingMediaPrimitive.EditButton
              className={buttonVariants({ size: 'sm', variant: 'ghost' })}
            >
              Edit link
            </FloatingMediaPrimitive.EditButton>

            <CaptionButton variant="ghost" onClick={onCaptionButtonClick}>
              Caption
            </CaptionButton>

            <Separator className="my-1" orientation="vertical" />

            <Button size="sms" variant="ghost" {...buttonProps}>
              <Icons.delete className="size-4" />
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
