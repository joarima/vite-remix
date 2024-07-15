import { format as tempoFormat, isAfter as tempoIsAfter } from '@formkit/tempo'

export const format = (dateString: string) => {
  return tempoFormat(dateString, 'medium', 'ja')
}

export function isAfter(draftDateTime: string, postDateTime: string): boolean {
  return tempoIsAfter(draftDateTime, postDateTime)
}
