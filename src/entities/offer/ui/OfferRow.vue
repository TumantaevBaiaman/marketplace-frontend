<script setup lang="ts">
import type { PublicOffer } from '../model/types'
import { formatPrice, formatDeliveryDate } from '@/shared/lib/formatters'

defineProps<{ offer: PublicOffer; selected?: boolean; best?: boolean }>()
defineEmits<{ select: [offer: PublicOffer] }>()
</script>

<template>
  <div
    class="offer-row"
    :class="{ 'offer-row--selected': selected }"
    @click="$emit('select', offer)"
  >
    <div class="offer-row__top">
      <div style="display:flex;align-items:center;gap:6px">
        <span class="offer-row__seller-name">{{ offer.seller.name }}</span>
        <span v-if="best" class="offer-row__best">Лучшее</span>
      </div>
      <span class="offer-row__price">{{ formatPrice(offer.price.amount, offer.price.currency) }}</span>
    </div>
    <div class="offer-row__bottom">
      <span class="offer-row__rating">
        <span :class="Number(offer.seller.rating) >= 4 ? 'offer-row__rating--green' : 'offer-row__rating--yellow'">★</span>
        Рейтинг {{ Number(offer.seller.rating).toFixed(1) }}
      </span>
      <span class="offer-row__delivery">{{ formatDeliveryDate(offer.delivery_date) }}</span>
    </div>
  </div>
</template>
