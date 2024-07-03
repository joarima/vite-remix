import { cn } from '@udecode/cn'
import { Plate } from '@udecode/plate-common'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { Editor } from '@/components/plate-ui/editor'
import { FixedToolbar } from '@/components/plate-ui/fixed-toolbar'
import { FixedToolbarButtons } from '@/components/plate-ui/fixed-toolbar-buttons'
import { FloatingToolbar } from '@/components/plate-ui/floating-toolbar'
import { FloatingToolbarButtons } from '@/components/plate-ui/floating-toolbar-buttons'
import { TooltipProvider } from '@/components/plate-ui/tooltip'
import { Button } from '@/components/ui/button'
import { format } from '@/lib/date'
import { PostRecord } from '@/types/Editor'
import { LoaderCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Checkbox } from '../ui/checkbox'
import { Skeleton } from '../ui/skeleton'

import { useAuth } from '@/lib/auth.supabaseClient'
import { saveDraft } from '@/lib/editor'
import { plugins } from '@/lib/plate/plugins'
import { usePostEditor } from './PostEditor.hooks'

type EditorProps = {
  record?: PostRecord
  isNewPost?: boolean
}

export function PostEditor({ record, isNewPost = false }: EditorProps) {
  const {
    initialValue,
    setEditorState,
    open,
    toggleOpen,
    isPosting,
    onSave,
    isHydrated,
    deletePost,
  } = usePostEditor(record, isNewPost)

  const containerRef = useRef(null)
  const id = 'pEditor'
  const { isLoggedIn } = useAuth()

  const postId = record?.id

  const [editorKey, setEditorKey] = useState<string | undefined>(postId)

  useEffect(() => {
    if (postId) {
      setEditorKey(crypto.randomUUID())
    }
  }, [postId])

  return (
    <div>
      <div className="flex items-center">
        {record && (
          <p className="py-[5px] font-thin text-left flex-grow">
            {format(record!.createdAt)}
          </p>
        )}
        {isLoggedIn && (
          <div className="items-top flex space-x-2 items-center">
            <Checkbox
              id="terms1"
              key={postId ?? 'new'}
              defaultChecked={open}
              onCheckedChange={toggleOpen}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms1"
                className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                open
              </label>
            </div>
            {!isNewPost && (
              <Button
                onClick={() => {
                  deletePost()
                }}
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
      {(isHydrated && isNewPost) || initialValue ? (
        <div className="max-w-[1336px] rounded-lg border bg-background shadow">
          <TooltipProvider>
            <DndProvider backend={HTML5Backend}>
              <Plate
                id={id}
                key={editorKey}
                readOnly={!isLoggedIn}
                plugins={plugins}
                initialValue={initialValue}
                onChange={(state) => {
                  if (state !== undefined) {
                    setEditorState(state)
                  }
                  if (isNewPost) {
                    saveDraft(state)
                  }
                }}
              >
                <div
                  ref={containerRef}
                  className={cn(
                    'relative',
                    // Block selection
                    '[&_.slate-start-area-left]:!w-[64px] [&_.slate-start-area-right]:!w-[64px] [&_.slate-start-area-top]:!h-4'
                  )}
                >
                  {isLoggedIn && (
                    <FixedToolbar>
                      <FixedToolbarButtons />
                    </FixedToolbar>
                  )}

                  <Editor
                    className="px-[25px] sm:px-[30px] md:px[50px] py-5 text-left"
                    autoFocus
                    focusRing={false}
                    variant="ghost"
                    size="md"
                  />
                  {isLoggedIn && (
                    <FloatingToolbar>
                      <FloatingToolbarButtons />
                    </FloatingToolbar>
                  )}
                </div>
              </Plate>
            </DndProvider>
          </TooltipProvider>
        </div>
      ) : (
        <Skeleton className="h-[125px] w-full py-5 rounded-xl" />
      )}

      {isLoggedIn && isPosting && (
        <Button className="w-full mt-2.5" disabled>
          <LoaderCircle className="animate-spin" />
        </Button>
      )}
      {isLoggedIn && !isPosting && (
        <Button
          className="w-full mt-2.5"
          onClick={() => {
            onSave()
          }}
        >
          Save
        </Button>
      )}
    </div>
  )
}
