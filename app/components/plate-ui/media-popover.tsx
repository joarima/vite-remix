import React, { useEffect, useState } from 'react'

import {
  isSelectionExpanded,
  setNodes,
  useEditorRef,
  useEditorSelector,
  useElement,
  useRemoveNodeButton,
} from '@udecode/plate-common'

import {
  ELEMENT_IMAGE,
  FloatingMedia as FloatingMediaPrimitive,
  TMediaElement,
  floatingMediaActions,
  useFloatingMediaSelectors,
} from '@udecode/plate-media'
import { useReadOnly, useSelected } from 'slate-react'

import { Icons } from '@/components/plate-ui/icons'

import { dataURLtoFile } from '@/lib/image'
import { LoaderCircle } from 'lucide-react'
import { useToast } from '../ui/use-toast'
import { Button, buttonVariants } from './button'
import { CaptionButton } from './caption'
import { inputVariants } from './input'
import { Popover, PopoverAnchor, PopoverContent } from './popover'
import { Separator } from './separator'

export interface MediaPopoverProps {
  children: React.ReactNode
  pluginKey?: string
  url?: string
}

export function MediaPopover({ children, pluginKey, url }: MediaPopoverProps) {
  const { toast } = useToast()
  const readOnly = useReadOnly()
  const selected = useSelected()
  const isImage = pluginKey === ELEMENT_IMAGE

  const selectionCollapsed = useEditorSelector(
    (editor) => !isSelectionExpanded(editor),
    []
  )
  const isOpen = !readOnly && selected && selectionCollapsed
  const isEditing = useFloatingMediaSelectors().isEditing()

  const [isUploading, setIsUploading] = useState<boolean>(false)

  useEffect(() => {
    if (!isOpen && isEditing) {
      floatingMediaActions.isEditing(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const element = useElement()
  const { props: buttonProps } = useRemoveNodeButton({ element })

  const editor = useEditorRef()

  const upload = async () => {
    setIsUploading(true)
    if (!url) {
      toast({
        title: 'no file url.',
      })
      return
    }
    // data url => File
    const file = dataURLtoFile(url)
    if (!file) {
      toast({
        title: 'invalid file.',
      })
      setIsUploading(false)
      return
    }
    // get signed url
    const response = await fetch(
      import.meta.env.VITE_AWS_API_URL + '/api/s3-upload',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      }
    )
    if (!response.ok) {
      toast({
        title: 'signed url fetch error.',
        description: String(response),
      })
      setIsUploading(false)
      return
    }

    // s3 upload
    const { url: s3Url, fields } = await response.json()
    const formData = new FormData()
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value as string)
    })
    formData.append('file', file)

    const uploadResponse = await fetch(s3Url, {
      method: 'POST',
      body: formData,
    })

    if (!uploadResponse.ok) {
      toast({
        title: 's3 upload error.',
        description: String(uploadResponse),
      })
      setIsUploading(false)
      return
    }

    // https://github.dev/udecode/plate/blob/main/packages/media/src/media/FloatingMedia/FloatingMediaUrlInput.tsx
    // FloatingMediaPrimitive.UrlInput で Enter を押した時の処理と同様
    // set
    setNodes<TMediaElement>(editor, {
      url: import.meta.env.VITE_AWS_S3_OBJ_URL_BASE + file.name,
    })
    // reset
    floatingMediaActions.reset()
    setIsUploading(false)
  }

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

            <CaptionButton variant="ghost">Caption</CaptionButton>

            <Separator className="my-1" orientation="vertical" />

            <Button size="sms" variant="ghost" {...buttonProps}>
              <Icons.delete className="size-4" />
            </Button>
            {isImage && isUploading && (
              <Button variant="ghost" className="" disabled>
                <LoaderCircle className="animate-spin" />
              </Button>
            )}
            {isImage && !isUploading && (
              <Button
                variant="ghost"
                className=""
                onClick={() => {
                  upload()
                }}
              >
                upload
              </Button>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
