import { Value } from '@udecode/plate-common'

export function saveDraft(draft: Value) {
  localStorage.setItem('post-draft', JSON.stringify(draft))
}

export function getDraft() {
  if (typeof localStorage === 'undefined') return undefined
  const jsonStr = localStorage.getItem('post-draft')
  if (!jsonStr) return undefined
  return JSON.parse(jsonStr) as Value
}

export function deleteDraft() {
  localStorage.removeItem('post-draft')
}

export function savePostDraft(postId: string, draft: Value) {
  const updatedAt = new Date().toISOString()
  localStorage.setItem(
    `post-draft-${postId}`,
    `{"updatedAt":"${updatedAt}","content":${JSON.stringify(draft)}}`
  )
}

export function getPostDraft(postId: string) {
  if (typeof localStorage === 'undefined') return undefined
  const jsonStr = localStorage.getItem(`post-draft-${postId}`)
  if (!jsonStr) return undefined
  return JSON.parse(jsonStr)
}

export function deletePostDraft(postId: string) {
  localStorage.removeItem(`post-draft-${postId}`)
}
