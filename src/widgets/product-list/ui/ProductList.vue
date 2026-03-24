<script setup lang="ts">
import { useProductList } from '@/features/products/product-listing'
import { useInfiniteScroll } from '@/shared/lib/useInfiniteScroll'
import { ProductCard } from '@/entities/product'
import { AppLoader, AppEmpty } from '@/shared/ui'

const props = withDefaults(defineProps<{
  filter?: 'all' | 'instock'
  sort?: string
}>(), {
  filter: 'all',
  sort: 'default',
})

const { products, loading, hasMore, loadMore } = useProductList(
  () => props.filter,
  () => props.sort,
)

const { sentinel } = useInfiniteScroll(loadMore)
</script>

<template>
  <section>
    <AppEmpty v-if="!loading && products.length === 0" message="Товары не найдены" />
    <div class="catalog-grid">
      <ProductCard v-for="p in products" :key="p.id" :product="p" />
    </div>
    <div ref="sentinel" class="product-list__sentinel" />
    <AppLoader v-if="loading" />
    <p v-if="!hasMore && products.length > 0" class="product-list__end">
      Все товары загружены
    </p>
  </section>
</template>
