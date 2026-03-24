import { watch } from 'vue'
import { useCursorList } from '@/shared/lib/useCursorList'
import { productApi } from '@/entities/product'

export function useProductList(
  getFilter?: () => 'all' | 'instock',
  getSort?: () => string,
) {
  const { items: products, loading, hasMore, loadMore, reset } = useCursorList(
    (cursor) => {
      const inStock = getFilter?.() === 'instock'
      const sort = getSort?.() ?? 'default'
      return productApi.getPublicList(cursor, 20, inStock, sort)
    },
  )

  if (getFilter || getSort) {
    watch(
      [getFilter ?? (() => 'all'), getSort ?? (() => 'default')],
      () => { reset(); loadMore() },
    )
  }

  return { products, loading, hasMore, loadMore, reset }
}
