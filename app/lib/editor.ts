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
