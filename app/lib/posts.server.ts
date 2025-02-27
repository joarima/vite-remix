import { Database, Json } from '@/types/supabase'
import { SupabaseClient } from '@supabase/supabase-js'
import { Value } from '@udecode/plate-common'
export async function getPostList({
  supabase,
  isLoggedIn = false,
}: {
  supabase: SupabaseClient<Database>
  isLoggedIn?: boolean
}) {
  if (isLoggedIn) {
    const { data, error } = await supabase
      .from('post')
      .select('id, order')
      .order(' order ', { ascending: false })

    if (error) {
      console.error('Error occurred during getPostList(Login): ', error)
    }

    return {
      list:
        data?.map((it, index) => {
          return {
            id: it.id,
            order: it.order,
            index: index + 1,
          }
        }) ?? [],
      error,
    }
  } else {
    const { data, error } = await supabase
      .from('post')
      .select('id, order')
      .eq('is_open', true)
      .order(' order ', { ascending: false })

    if (error) {
      console.error('Error occurred during getPostList(No Login): ', error)
    }

    return {
      list:
        data?.map((it, index) => {
          return {
            id: it.id,
            order: it.order,
            index: index + 1,
          }
        }) ?? [],
      error,
    }
  }
}
export async function getPostById({
  supabase,
  postId,
  isLoggedIn = false,
}: {
  supabase: SupabaseClient<Database>
  postId: string
  isLoggedIn?: boolean
}) {
  if (isLoggedIn) {
    const { data, error } = await supabase
      .from('post')
      .select('id, order, content, is_open, created_at, updated_at')
      .eq('id', postId)
      .maybeSingle()

    if (error) {
      console.error('Error occurred during getPostById: ', error)
    }

    if (!data) return { data: undefined, error }

    const postData = {
      id: data.id,
      order: data.order,
      content: data.content as Value,
      isOpen: data.is_open,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }

    return {
      data: postData,
      error,
    }
  } else {
    const { data, error } = await supabase
      .from('post')
      .select('id, order, content, is_open, created_at, updated_at')
      .eq('id', postId)
      .eq('is_open', true)
      .maybeSingle()

    if (error) {
      console.error('Error occurred during getPostById: ', error)
    }

    if (!data) return { data: undefined, error }

    const postData = {
      id: data.id,
      order: data.order,
      content: data.content as Value,
      isOpen: data.is_open,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }

    return {
      data: postData,
      error,
    }
  }
}

export async function getLatestPost({
  supabase,
  isLoggedIn = false,
}: {
  supabase: SupabaseClient<Database>
  isLoggedIn?: boolean
}) {
  if (isLoggedIn) {
    const { data, error } = await supabase
      .from('post')
      .select('id, order, content, is_open, created_at, updated_at')
      .order(' order ', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('Error occurred during getLatestPost(Login): ', error)
    }

    if (!data) return { data: undefined, error }

    const postData = {
      id: data.id,
      order: data.order,
      content: data.content as Value,
      isOpen: data.is_open,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }

    return {
      data: postData,
      error,
    }
  } else {
    const { data, error } = await supabase
      .from('post')
      .select('id, order, content, is_open, created_at, updated_at')
      .eq('is_open', true)
      .order(' order ', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('Error occurred during getLatestPost(No Login): ', error)
    }

    if (!data) return { data: undefined, error }

    const postData = {
      id: data.id,
      order: data.order,
      content: data.content as Value,
      isOpen: data.is_open,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }

    return {
      data: postData,
      error,
    }
  }
}

export const search = async ({
  searchWord,
  supabase,
  isLoggedIn = false,
}: {
  searchWord: string
  supabase: SupabaseClient<Database>
  isLoggedIn?: boolean
}) => {
  if (isLoggedIn) {
    const { data, error } = await supabase.rpc('find_content_admin', {
      keywords: searchWord,
    })

    if (error) {
      console.error('Error occurred during getPostList(No Login): ', error)
    }

    return {
      list:
        data?.map((it, index) => {
          return {
            id: it.id,
            order: it.order,
            index: index + 1,
          }
        }) ?? [],
      error,
    }
  } else {
    const { data, error } = await supabase.rpc('find_content', {
      keywords: searchWord,
    })

    if (error) {
      console.error('Error occurred during getPostList(No Login): ', error)
    }

    return {
      list:
        data?.map((it, index) => {
          return {
            id: it.id,
            order: it.order,
            index: index + 1,
          }
        }) ?? [],
      error,
    }
  }
}

export const savePost = async ({
  supabase,
  postJson,
  isOpen,
}: {
  supabase: SupabaseClient<Database>
  postJson: object
  isOpen: boolean
}) => {
  console.log('postJson', postJson)
  const { error } = await supabase.from('post').insert({
    content: postJson as Json,
    is_open: isOpen,
  })
  if (error) {
    console.error('Error occurred during savePost: ', error)
    throw error
  }
}

export const updatePost = async ({
  supabase,
  id,
  postJson,
  isOpen,
}: {
  supabase: SupabaseClient<Database>
  id: string
  postJson: object
  isOpen: boolean
}) => {
  const { error } = await supabase
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

export const deletePost = async ({
  supabase,
  id,
}: {
  supabase: SupabaseClient<Database>
  id: string
}) => {
  console.log(id)
  const { data, error } = await supabase.from('post').delete().eq('id', id)

  console.log(data)

  if (error) {
    throw error
  }
}
