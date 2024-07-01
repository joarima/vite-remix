import { Json } from '@/types/supabase'
import { TypedSupabaseClient } from './auth.supabaseClient'

export const savePost = async (
  supabaseClient: TypedSupabaseClient,
  postJson: object,
  isOpen: boolean = false
) => {
  const { error } = await supabaseClient
    .from('post')
    .insert({ content: postJson as Json, is_open: isOpen })

  if (error) {
    throw error
  }
}

export const updatePost = async (
  supabaseClient: TypedSupabaseClient,
  id: string,
  postJson: object,
  isOpen: boolean = false
) => {
  const { error } = await supabaseClient
    .from('post')
    .update({
      content: postJson as Json,
      is_open: isOpen,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    throw error
  }
}
