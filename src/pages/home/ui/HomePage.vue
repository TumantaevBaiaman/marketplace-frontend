<script setup lang="ts">
import { ref } from 'vue'
import { SlidersHorizontal, ArrowUpDown, PackageCheck } from 'lucide-vue-next'
import { ProductList } from '@/widgets/product-list'

const activeFilter = ref<'all' | 'instock'>('all')
const activeSort = ref('default')

const sortOptions = [
  { value: 'default', label: 'По умолчанию' },
  { value: 'price-asc', label: 'Сначала дешевле' },
  { value: 'price-desc', label: 'Сначала дороже' },
  { value: 'rating', label: 'По рейтингу' },
]
</script>

<template>
  <main>
    <div class="catalog-toolbar">
      <div class="catalog-toolbar__left">
        <SlidersHorizontal :size="16" class="toolbar-icon" />
        <span class="catalog-toolbar__title">Каталог товаров</span>
        <div class="toolbar-filters">
          <button
            :class="['filter-chip', { active: activeFilter === 'all' }]"
            @click="activeFilter = 'all'"
          >Все товары</button>
          <button
            :class="['filter-chip', { active: activeFilter === 'instock' }]"
            @click="activeFilter = 'instock'"
          >
            <PackageCheck :size="13" />
            В наличии
          </button>
        </div>
      </div>

      <div class="catalog-toolbar__right">
        <ArrowUpDown :size="14" class="toolbar-icon" />
        <div class="sort-tabs">
          <button
            v-for="opt in sortOptions"
            :key="opt.value"
            :class="['sort-tab', { active: activeSort === opt.value }]"
            @click="activeSort = opt.value"
          >{{ opt.label }}</button>
        </div>
      </div>
    </div>

    <ProductList :filter="activeFilter" :sort="activeSort" />
  </main>
</template>
