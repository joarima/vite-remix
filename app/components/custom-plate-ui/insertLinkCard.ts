import {
  getPluginType,
  insertNodes,
  InsertNodesOptions,
  isSelectionAtBlockStart,
  PlateEditor,
  someNode,
  TElement,
  Value,
} from '@udecode/plate-common'
import { ELEMENT_LINK_CARD } from './LinkCard'
import { TLinkCardElement } from './types'

export const insertLinkCard = <V extends Value>(
  editor: PlateEditor<V>,
  insertNodesOptions: InsertNodesOptions<Value> = {}
) => {
  const matchCodeElements = (node: TElement) =>
    node.type === getPluginType(editor, ELEMENT_LINK_CARD)

  if (
    someNode(editor, {
      match: matchCodeElements,
    })
  ) {
    return
  }
  if (!isSelectionAtBlockStart(editor)) {
    editor.insertBreak()
  }

  insertNodes<TLinkCardElement>(
    editor,
    {
      children: [{ text: '' }],
      type: ELEMENT_LINK_CARD,
      url: '',
      imageUrl: '',
      title: '',
      description: '',
    },
    insertNodesOptions
  )
}
