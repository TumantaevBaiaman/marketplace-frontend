import { ref, watch } from 'vue'

export function useCursorList<T>(
  fetchFn: (cursor: string | null) => Promise<{ items: T[]; next_cursor: string | null }>,
  watchDeps?: () => unknown,
) {
  const items = ref<T[]>([])
  const cursor = ref<string | null>(null)
  const loading = ref(false)
  const hasMore = ref(true)

  function reset() {
    items.value = []
    cursor.value = null
    hasMore.value = true
  }

  async function loadMore() {
    if (loading.value || !hasMore.value) return
    loading.value = true
    try {
      const data = await fetchFn(cursor.value)
      items.value.push(...(data.items as any[]))
      cursor.value = data.next_cursor
      hasMore.value = !!data.next_cursor
    } finally {
      loading.value = false
    }
  }

  if (watchDeps) {
    watch(watchDeps, () => { reset(); loadMore() }, { deep: true })
  }

  return { items, loading, hasMore, loadMore, reset }
}
