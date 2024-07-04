import { Post } from '@/components/Post'
import { getSupabaseWithSessionHeaders } from '@/lib/auth.supabase.server'
import { getPostById, getPostList, search } from '@/lib/posts.server'
import { isUuid } from '@/lib/utils'
import { PostListData, PostRecord } from '@/types/Editor'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { postId } = params

  if (!postId) {
    throw json('Not Found', { status: 404 })
  }

  if (!isUuid(postId)) {
    throw json('Not Found', { status: 404 })
  }

  const { supabase, headers, session } = await getSupabaseWithSessionHeaders({
    request,
  })

  const url = new URL(request.url)
  const q = url.searchParams.get('q')

  if (q) {
    const { list } = await search({
      searchWord: q,
      supabase: supabase,
      isLoggedIn: !!session,
    })

    const { data } = await getPostById({
      supabase: supabase,
      postId: postId,
    })

    if (!data) {
      throw json('Not Found', { status: 404 })
    }

    return json(
      {
        status: 200,
        postId: data.id as string,
        post: data as PostRecord,
        list: list as PostListData[],
      },
      { headers }
    )
  } else {
    const { data } = await getPostById({
      supabase: supabase,
      postId,
      isLoggedIn: !!session,
    })

    const { list } = await getPostList({
      supabase: supabase,
      isLoggedIn: !!session,
    })

    if (!data) {
      throw json('Not Found', { status: 404 })
    }

    if (list.length === 0) {
      throw json('Not Found', { status: 404 })
    }

    return json(
      {
        postId: postId,
        post: data as PostRecord,
        list: list as PostListData[],
      },
      { headers }
    )
  }
}
export default function Index() {
  const { postId, post, list } = useLoaderData<typeof loader>()

  return (
    <main className="container prose">
      <Post
        postId={postId}
        record={post as PostRecord}
        posts={list as PostListData[]}
      />
    </main>
  )
}
