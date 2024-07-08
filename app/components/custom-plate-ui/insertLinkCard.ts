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

type OgpInfo = {
  image?: string
  site_name?: string
  title?: string
  type?: string
  url?: string
  description?: string
}

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

  const insertNode = (
    url: string,
    title?: string,
    description?: string,
    imageUrl?: string
  ) => {
    insertNodes<TLinkCardElement>(
      editor,
      {
        children: [{ text: '' }],
        type: ELEMENT_LINK_CARD,
        url: url,
        imageUrl: imageUrl,
        title: title,
        description: description,
      },
      insertNodesOptions
    )
  }

  const getOgpInfo = async (url: string) => {
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`
    const response = await fetch(proxyUrl)
    const html = await response.text()
    const domParser = new DOMParser()
    const dom = domParser.parseFromString(html, 'text/html')
    const ogp = Object.fromEntries(
      [...dom.head.children]
        .filter(
          (element) =>
            element.tagName === 'META' &&
            element.getAttribute('property')?.startsWith('og:')
        )
        .map((element) => {
          return [
            element.getAttribute('property')?.replace('og:', ''),
            element.getAttribute('content'),
          ]
        })
    ) as OgpInfo

    insertNode(url, ogp.title, ogp.description, ogp.image)
  }

  const input = window.prompt('page url')
  if (!input) return
  getOgpInfo(input)
}
