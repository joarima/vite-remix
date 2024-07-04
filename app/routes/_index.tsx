import { Post } from '@/components/Post'
import { getSupabaseWithSessionHeaders } from '@/lib/auth.supabase.server'
import {
  getLatestPost,
  getPostById,
  getPostList,
  search,
} from '@/lib/posts.server'
import { PostListData, PostRecord } from '@/types/Editor'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

export const loader = async ({ request }: LoaderFunctionArgs) => {
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

    if (list.length === 0) {
      throw json('Not Found', { status: 404 })
    }

    const latestPostId = list[0].id

    const { data } = await getPostById({
      supabase: supabase,
      postId: latestPostId,
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
    const { data } = await getLatestPost({
      supabase: supabase,
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
        status: 200,
        postId: data.id as string,
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
