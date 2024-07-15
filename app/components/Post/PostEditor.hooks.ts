import { isAfter } from '@/lib/date'
import {
  deleteDraft,
  deletePostDraft,
  getDraft,
  getPostDraft,
} from '@/lib/editor'
import { PostRecord } from '@/types/Editor'
import { CheckedState } from '@radix-ui/react-checkbox'
import { useNavigate, useRevalidator } from '@remix-run/react'
import { Value } from '@udecode/plate-common'
import { useEffect, useMemo, useState } from 'react'
import { useToast } from '../ui/use-toast'

export function usePostEditor(
  isLoggedIn: boolean,
  record?: PostRecord,
  isNewPost?: boolean
) {
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
      if (isLoggedIn && record?.id) {
        const draftJson = getPostDraft(record?.id)
        if (draftJson) {
          const isAfterUpdated = isAfter(draftJson.updatedAt, record.updatedAt)
          if (isAfterUpdated) {
            setInitialValue(draftJson.content as Value)
            return
          }
        }
      }
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

  const revalidator = useRevalidator()

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
      formData.append('id', record?.id)
      fetch('/api/update-post', {
        method: 'POST',
        body: formData,
      }).then((res: Response) => {
        if (res.status === 200) {
          deletePostDraft(record.id)
          revalidator.revalidate()
          toast({
            title: 'post updated.',
          })
        } else {
          toast({
            title: 'some error occurred.',
            description: `${res.body}`,
          })
        }
      })
    } else {
      fetch('/new', {
        method: 'POST',
        body: formData,
      }).then((res: Response) => {
        if (res.status === 200) {
          revalidator.revalidate()
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
    setIsPosting(false)
  }

  const deletePost = () => {
    if (record?.id) {
      if (window.confirm('Delete?')) {
        const formData = new FormData()
        formData.append('id', record?.id)
        fetch('/api/delete-post', {
          method: 'DELETE',
          body: formData,
        }).then((res: Response) => {
          if (res.status === 200) {
            revalidator.revalidate()
            toast({
              title: 'post successfully deleted.',
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
    } else {
      toast({
        title: 'post not found.',
      })
    }
  }

  return {
    initialValue,
    setEditorState,
    open,
    toggleOpen,
    isPosting,
    onSave,
    isHydrated,
    deletePost,
  }
}
