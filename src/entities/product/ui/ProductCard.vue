<script setup lang="ts">
import type { ProductListItem } from '../model/types'
import { formatPrice, formatDeliveryDate } from '@/shared/lib/formatters'

defineProps<{ product: ProductListItem }>()

function onImgError(e: Event) {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
  const placeholder = img.nextElementSibling as HTMLElement | null
  if (placeholder) placeholder.style.display = 'flex'
}
</script>

<template>
  <RouterLink :to="`/products/${product.id}`" class="product-card">
    <div class="product-card__image">
      <img
        v-if="product.thumbnail_url"
        :src="product.thumbnail_url"
        :alt="product.name"
        loading="lazy"
        class="product-card__img"
        @error="onImgError"
      />
      <div
        :style="product.thumbnail_url ? 'display:none' : ''"
        class="product-card__no-image"
      >📦</div>
    </div>
    <div class="product-card__body">
      <h3 class="product-card__title">{{ product.name }}</h3>

      <p class="product-card__price">
        {{ formatPrice(product.price.amount, product.price.currency) }}
      </p>

      <div v-if="product.avg_rating !== null" class="product-card__rating">
        <span class="product-card__stars">★ {{ product.avg_rating }}</span>
        <span class="product-card__review-count">({{ product.review_count }})</span>
      </div>

      <div class="product-card__meta">
        <div class="product-card__meta-row">
          <span class="product-card__meta-label">Остаток:</span>
          <span class="product-card__meta-value">{{ product.stock }}</span>
        </div>
        <div v-if="product.nearest_delivery_date" class="product-card__meta-row">
          <span class="product-card__meta-label">Доставка:</span>
          <span class="product-card__meta-value product-card__delivery">
            {{ formatDeliveryDate(product.nearest_delivery_date) }}
          </span>
        </div>
      </div>
    </div>
  </RouterLink>
</template>
