import { themeAtom } from '@/lib/theme'
import {
  createPluginFactory,
  findNodePath,
  PlateElement,
  setNodes,
  useEditorReadOnly,
  useEditorRef,
  withRef,
} from '@udecode/plate-common'

import { TextareaAutosize } from '@udecode/plate-caption'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { TLinkCardElement } from './types'

export const ELEMENT_LINK_CARD = 'linkcard'

export const createLinkCardPlugin = createPluginFactory({
  key: ELEMENT_LINK_CARD,
  isElement: true,
})

export const LinkCardElement = withRef<typeof PlateElement>(
  ({ children, ...props }, ref) => {
    const [theme] = useAtom(themeAtom)
    const element = props.element as TLinkCardElement

    const [url, setUrl] = useState<string | undefined>(element.url)
    const [title, setTitle] = useState<string | undefined>(element.title)
    const [description, setDescription] = useState<string | undefined>(
      element.description
    )
    const [image, setImage] = useState<string | undefined>(element.imageUrl)

    const editor = useEditorRef()
    const readOnly = useEditorReadOnly()

    const onChangeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!url) return
      const newValue = e.target.value
      if (!newValue.startsWith('http://') && !newValue.startsWith('https://')) {
        alert('Please enter a valid URL starting with http:// or https://')
        setUrl(undefined)
        return
      }
      setUrl(newValue)
      const path = findNodePath(editor, element)

      if (!path) return

      setNodes<TLinkCardElement>(editor, { url: newValue }, { at: path })
    }
    const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value)
      const newValue = e.target.value

      const path = findNodePath(editor, element)

      if (!path) return

      setNodes<TLinkCardElement>(editor, { title: newValue }, { at: path })
    }
    const onChangeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDescription(e.target.value)
      const newValue = e.target.value

      const path = findNodePath(editor, element)

      if (!path) return

      setNodes<TLinkCardElement>(
        editor,
        { description: newValue },
        { at: path }
      )
    }

    const onChangeImageUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      console.log(newValue)
      setImage(newValue)
      const path = findNodePath(editor, element)

      if (!path) return

      setNodes<TLinkCardElement>(editor, { imageUrl: newValue }, { at: path })
    }

    return (
      <PlateElement asChild ref={ref} {...props}>
        <div contentEditable={false} style={{ userSelect: 'none' }}>
          <div
            className={`p-3 border rounded-lg border-solid border-gray-200 ${theme === 'light' ? 'hover:bg-blue-50' : 'hover:bg-gray-900'}`}
          >
            {!readOnly && (
              <input
                type="text"
                className="w-full "
                defaultValue={url}
                placeholder="Link URL"
                onChange={onChangeUrl}
              />
            )}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start w-full flex-col sm:flex-row "
              onClick={(e) => {
                if (!readOnly) {
                  e.preventDefault()
                }
              }}
            >
              {image ? (
                <img className="flex-1 sm:max-w-[50%] p-2" src={image} />
              ) : (
                <p className="flex-1">no image</p>
              )}
              <div className="flex-1 p-2 w-full">
                {!readOnly ? (
                  <input
                    className={`font-bold min-w-full max-w-full bg-transparent`}
                    defaultValue={title ?? 'no title'}
                    onChange={onChangeTitle}
                    readOnly={readOnly}
                  ></input>
                ) : (
                  <p
                    className={`font-bold min-w-full max-w-full bg-transparent break-all`}
                  >
                    {title ?? 'no title'}
                  </p>
                )}
                <TextareaAutosize
                  className={`mt-4 min-w-full resize-none bg-transparent focus:outline-none border-0`}
                  defaultValue={description}
                  onChange={onChangeDescription}
                  readOnly={readOnly}
                  minRows={10}
                  maxRows={100}
                  cacheMeasurements
                />
              </div>
            </a>
            {!readOnly && (
              <input
                type="text"
                className="w-full "
                defaultValue={image}
                placeholder="Image URL"
                onChange={onChangeImageUrl}
              />
            )}
            <p className="invisible hidden">{children}</p>
          </div>
        </div>
      </PlateElement>
    )
  }
)
