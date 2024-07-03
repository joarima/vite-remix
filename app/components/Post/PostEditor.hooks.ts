import { supabaseAtom } from '@/lib/auth.supabaseClient'
import { deleteDraft, getDraft } from '@/lib/editor'
import { PostRecord } from '@/types/Editor'
import { CheckedState } from '@radix-ui/react-checkbox'
import { useNavigate } from '@remix-run/react'
import { Value } from '@udecode/plate-common'
import { useAtom } from 'jotai'
import { useEffect, useMemo, useState } from 'react'
import { useToast } from '../ui/use-toast'

export function usePostEditor(record?: PostRecord, isNewPost?: boolean) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [initialValue, setInitialValue] = useState<Value | undefined>(
    isNewPost ? undefined : record?.content
  )

  // editor state(content) to save
  const [editorState, setEditorState] = useState<Value | undefined>(
    initialValue
  )

  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    if (isNewPost) {
      if (typeof localStorage !== 'undefined') {
        const draft = getDraft()
        setInitialValue(draft)
        setIsHydrated(true)
      }
    } else {
      setInitialValue(record?.content)
    }
    if (record && initialValue) {
      setIsHydrated(true)
    }
  }, [record])

  // post public open state
  const [open, setOpen] = useState<boolean>(record?.isOpen ?? false)
  const toggleOpen = (checkState: CheckedState) => {
    const checked = checkState !== false && checkState != 'indeterminate'
    setOpen(checked)
  }

  const [isPosting, setIsPosting] = useState<boolean>(false)

  useMemo(() => {
    setEditorState(record?.content)
    setOpen(record?.isOpen ?? false)
  }, [record?.content, record?.isOpen])

  const [supabaseClient] = useAtom(supabaseAtom)

  const onSave = () => {
    setIsPosting(true)
    const content = editorState as object
    if (content === undefined) {
      alert('no content')
      setIsPosting(false)
      return
    }

    const formData = new FormData()
    formData.append('content', JSON.stringify(content))
    formData.append('isOpen', open ? 'true' : 'false')

    if (record?.id) {
      if (supabaseClient) {
        formData.append('id', record?.id)
        fetch('/api/update-post', {
          method: 'POST',
          body: formData,
        }).then(() => {
          toast({
            title: 'post updated.',
          })
        })
      }
    } else {
      if (supabaseClient) {
        fetch('/new', {
          method: 'POST',
          body: formData,
        }).then((res: Response) => {
          if (res.status === 200) {
            toast({
              title: 'new post created.',
            })
            if (isNewPost) {
              deleteDraft()
              navigate('/')
            }
          } else {
            toast({
              title: 'some error occurred.',
              description: `${res.body}`,
            })
          }
        })
      }
    }
    setIsPosting(false)
  }

  return {
    initialValue,
    setEditorState,
    open,
    toggleOpen,
    isPosting,
    onSave,
    isHydrated,
  }
}
