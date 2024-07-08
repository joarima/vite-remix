import type { TElement } from '@udecode/plate-common'

export interface TLinkCardElement extends TElement {
  url: string
  imageUrl: string
  title: string
  description: string
  id?: string
  name?: string
}
