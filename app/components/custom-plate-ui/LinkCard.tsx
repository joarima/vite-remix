import { themeAtom } from '@/lib/theme'
import { createPluginFactory, useEditorRef } from '@udecode/plate-common'

import { useAtom } from 'jotai'
import { useState } from 'react'
import { TLinkCardElement } from './types'

export const ELEMENT_LINK_CARD = 'linkcard'

export const createLinkCardPlugin = createPluginFactory({
  key: ELEMENT_LINK_CARD,
  isElement: true,
})

type OgpInfo = {
  image?: string
  site_name?: string
  title?: string
  type?: string
  url?: string
  description?: string
}

export function LinkCardElement({
  children,
  attributes,
  node,
  url,
  title,
  description,
  imageUrl,
}: TLinkCardElement) {
  const [theme] = useAtom(themeAtom)
  const [titlee, setTitle] = useState<string | undefined>(title)
  const [descriptionn, setDescription] = useState<string | undefined>(
    description
  )
  const [image, setImage] = useState<string | undefined>(imageUrl)

  const getOgpInfo = async (url?: string) => {
    if (!url) {
      setTitle(undefined)
      setDescription(undefined)
      setImage(undefined)
      return
    }
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

    setTitle(ogp?.title ?? undefined)
    setDescription(ogp?.description ?? undefined)
    setImage(ogp?.image ?? undefined)
  }

  const editor = useEditorRef()
  return (
    <div>
      <div
        className={`p-3 border rounded-lg border-solid border-gray-200 ${theme === 'light' ? 'hover:bg-blue-50' : 'hover:bg-gray-900'}`}
      >
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full divide-x-2 > *"
        >
          <div className="flex-1 p-2">
            <p className="font-bold">{titlee ?? 'no title'}</p>
            <textarea
              className="mt-4"
              onChange={(e) => {
                setDescription(e.target.value)
              }}
            >
              {descriptionn}
            </textarea>
          </div>
          {image ? (
            <img className="flex-1 max-w-[50%] p-2" src={image} />
          ) : (
            <p className="flex-1">no image</p>
          )}
        </a>
        <p className="invisible">{children}</p>
      </div>
    </div>
  )
}
