import { Database } from '@/types/supabase'
import { createBrowserClient } from '@supabase/ssr'

export async function getPostListClient() {
  const supabase = createBrowserClient<Database>(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_API_KEY!
  )
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
