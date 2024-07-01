import { format as tempoFormat } from '@formkit/tempo'

export const format = (dateString: string) => {
  return tempoFormat(dateString, 'medium', 'ja')
}
