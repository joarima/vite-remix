import { Value } from '@udecode/plate-common'
import { Json } from './supabase'

export type PostFetchResult =
  | {
      id: string
      order: number
      content: Json
      is_open: boolean
      created_at: string
      updated_at: string
    }
  | undefined

export type PostRecord = {
  id: string
  order: number
  content: Value
  isOpen: boolean
  createdAt: string
  updatedAt: string
}

export type PostListData = {
  id: string
  order: number
  index: number
}
