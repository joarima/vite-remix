import { PostEditor } from '@/components/Post/PostEdtor'
import { PlateController } from '@udecode/plate-common'

function NewPost() {
  return (
    <div className="flex-1">
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <PlateController>
          <PostEditor isNewPost />
        </PlateController>
      </section>
    </div>
  )
}

export default NewPost
