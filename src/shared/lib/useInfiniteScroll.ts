import { ref, onMounted, onUnmounted } from 'vue'

export function useInfiniteScroll(loadMore: () => Promise<void>) {
  const sentinel = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    observer = new IntersectionObserver(
      async ([entry]) => { if (entry.isIntersecting) await loadMore() },
      { rootMargin: '300px' },
    )
    if (sentinel.value) observer.observe(sentinel.value)
  })

  onUnmounted(() => observer?.disconnect())

  return { sentinel }
}
