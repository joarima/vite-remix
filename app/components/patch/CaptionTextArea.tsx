import React from 'react'

import type { TextareaAutosizeProps } from 'react-textarea-autosize'

import {
  findNodePath,
  PlateEditor,
  useEditorRef,
  useElement,
  Value,
} from '@udecode/plate-common'
import {
  getNodeString,
  setNodes,
  type TElement,
} from '@udecode/plate-common/server'

import type { TCaptionElement } from '@udecode/plate-caption'

import { TextareaAutosize } from '@udecode/plate-caption'

const onChange = (
  e: React.ChangeEvent<HTMLTextAreaElement>,
  element: TCaptionElement,
  editor: PlateEditor<Value>
) => {
  const newValue = e.target.value

  const path = findNodePath(editor, element)

  if (!path) return

  setNodes<TCaptionElement>(
    editor,
    { caption: [{ text: newValue }] },
    { at: path }
  )
}

// https://github.dev/udecode/plate/blob/d8a3e8882a18fb7a7e7970cf23288cd352e29766/packages/caption/src/components/CaptionTextarea.tsx#L152-L153
// 元の CaptionTextArea は日本語入力がうまくできなかったので ↑ の内容の中で最低限のものだけ抜き出した
type Props = { placeholder: string; readOnly: boolean }

export const CaptionTextareaSimple = ({ placeholder, readOnly }: Props) => {
  const element = useElement<TCaptionElement>()
  const editor = useEditorRef()
  const {
    caption: nodeCaption = [{ children: [{ text: '' }] }] as [TElement],
  } = element

  const captionValue: TextareaAutosizeProps['value'] = getNodeString(
    nodeCaption[0]
  )

  return (
    <TextareaAutosize
      className="mt-2 w-full resize-none border-none bg-inherit p-0 font-[inherit] text-inherit focus:outline-none focus:[&::placeholder]:opacity-0 text-center print:placeholder:text-transparent"
      defaultValue={captionValue}
      onChange={(e) => {
        onChange(e, element, editor)
      }}
      placeholder={placeholder}
      readOnly={readOnly}
    />
  )
}
