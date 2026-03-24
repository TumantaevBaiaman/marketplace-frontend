<script setup lang="ts">
import { computed, ref } from 'vue'
import { OfferRow } from '@/entities/offer'
import type { PublicOffer } from '@/entities/offer'

const props = defineProps<{ offers: PublicOffer[] }>()
const emit = defineEmits<{ select: [offer: PublicOffer] }>()

const sortField = ref<'price' | 'delivery_date'>('price')
const sortOrder = ref<'asc' | 'desc'>('asc')
const selectedId = ref<string | null>(null)

const sorted = computed(() =>
  [...props.offers].sort((a, b) => {
    let av: number, bv: number
    if (sortField.value === 'price') {
      av = Number(a.price.amount); bv = Number(b.price.amount)
    } else {
      av = new Date(a.delivery_date).getTime(); bv = new Date(b.delivery_date).getTime()
    }
    return sortOrder.value === 'asc' ? av - bv : bv - av
  })
)

function toggleSort(field: 'price' | 'delivery_date') {
  if (sortField.value === field) sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  else { sortField.value = field; sortOrder.value = 'asc' }
}

function sortIcon(field: 'price' | 'delivery_date') {
  if (sortField.value !== field) return '↕'
  return sortOrder.value === 'asc' ? '↑' : '↓'
}

function handleSelect(offer: PublicOffer) {
  selectedId.value = offer.id
  emit('select', offer)
}
</script>

<template>
  <section class="offer-list">
    <h2 class="offer-list__title">Предложения продавцов</h2>
    <p v-if="sorted.length === 0" class="offer-list__empty">Предложений пока нет</p>
    <template v-else>
      <div class="sort-bar">
        <span class="sort-bar__label">Сортировка:</span>
        <button class="sort-bar__btn" :class="{ 'sort-bar__btn--active': sortField === 'price' }" @click="toggleSort('price')">
          Цена {{ sortIcon('price') }}
        </button>
        <button class="sort-bar__btn" :class="{ 'sort-bar__btn--active': sortField === 'delivery_date' }" @click="toggleSort('delivery_date')">
          Доставка {{ sortIcon('delivery_date') }}
        </button>
      </div>
      <div class="offer-list__cards">
        <OfferRow
          v-for="(offer, i) in sorted"
          :key="offer.id"
          :offer="offer"
          :selected="selectedId === offer.id"
          :best="i === 0"
          @select="handleSelect"
        />
      </div>
    </template>
  </section>
</template>
