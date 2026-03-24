import { watch } from 'vue'
import { useCursorList } from '@/shared/lib/useCursorList'
import { productApi } from '@/entities/product'

export interface AdminProductFilters {
  search?: string
  isActive?: boolean | null
  inStock?: boolean
  sort?: string
  priceMin?: number | null
  priceMax?: number | null
}

export function useAdminProductList(getFilters?: () => AdminProductFilters) {
  const { items: products, loading, hasMore, loadMore, reset } = useCursorList(
    (cursor) => {
      const f = getFilters?.() ?? {}
      return productApi.adminList(
        cursor, 50,
        f.sort ?? 'default',
        f.search ?? null,
        f.isActive ?? null,
        f.inStock ?? false,
        f.priceMin ?? null,
        f.priceMax ?? null,
      )
    },
  )

  if (getFilters) {
    watch(getFilters, () => { reset(); loadMore() }, { deep: true })
  }

  return { products, loading, hasMore, loadMore, reset }
}
