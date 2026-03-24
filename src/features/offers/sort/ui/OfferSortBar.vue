<script setup lang="ts">
import type { OfferSortField, SortOrder } from '@/entities/offer'

defineProps<{ sortField: OfferSortField; sortOrder: SortOrder }>()
const emit = defineEmits<{ sort: [field: OfferSortField] }>()

const fields: { key: OfferSortField; label: string }[] = [
  { key: 'price', label: 'Цена' },
  { key: 'rating', label: 'Рейтинг' },
]
</script>

<template>
  <div class="sort-bar">
    <span class="sort-bar__label">Сортировать:</span>
    <button
      v-for="f in fields"
      :key="f.key"
      class="sort-bar__btn"
      :class="{ 'sort-bar__btn--active': sortField === f.key }"
      type="button"
      @click="emit('sort', f.key)"
    >
      {{ f.label }}
      <span v-if="sortField === f.key" class="sort-bar__arrow">
        {{ sortOrder === 'asc' ? '↑' : '↓' }}
      </span>
    </button>
  </div>
</template>
