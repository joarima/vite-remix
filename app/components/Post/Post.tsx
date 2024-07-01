import { PostEditor } from '@/components/Post/PostEdtor'

import { searchAtom } from '@/atoms/SearchAtom'
import { PostListData, PostRecord } from '@/types/Editor'
import { PlateController } from '@udecode/plate-common'
import { useAtomValue } from 'jotai'
import { Pagination } from './Pagination'

type PostProps = {
  postId: string
  record: PostRecord
  posts: PostListData[]
}

export function Post({ postId, record, posts }: PostProps) {
  const searchWord = useAtomValue(searchAtom)

  return (
    <div className="flex-1">
      <section className="w-full grid items-center gap-1 pb-8 pt-6 md:py-10">
        {searchWord && (
          <p className="w-1/3 mx-auto text-center text-2xl">
            &quot;{searchWord}&quot;
          </p>
        )}
        <PlateController>
          <PostEditor record={record} />
        </PlateController>
      </section>
      {record && (
        <Pagination currentId={postId} posts={posts} record={record} />
      )}
    </div>
  )
}
