<script setup lang="ts">
import type { ProductDetail } from '@/entities/product'
import type { PublicOffer } from '@/entities/offer'

defineProps<{
  product: ProductDetail
  selectedOffer?: PublicOffer | null
}>()

function stars(rating: number | null): string {
  if (!rating) return ''
  const full = Math.round(rating)
  return '★'.repeat(full) + '☆'.repeat(5 - full)
}
</script>

<template>
  <div class="product-details-col">
    <!-- Gallery -->
    <div class="product-details__gallery">
      <img v-if="product.image_url" :src="product.image_url" :alt="product.name" class="product-details__image" />
      <div v-else class="product-details__no-image">Нет фото</div>
    </div>

    <!-- Info card -->
    <div class="product-details__info">
      <!-- Name -->
      <h1 class="product-details__title">{{ product.name }}</h1>

      <!-- Rating -->
      <div v-if="product.avg_rating" class="product-details__rating">
        <span class="product-details__stars">{{ stars(product.avg_rating) }}</span>
        <span class="product-details__rating-val">{{ product.avg_rating.toFixed(1) }}</span>
        <span class="product-details__review-count">({{ product.review_count }} отзывов)</span>
      </div>
      <div class="pd-sku-row">
        <span v-if="product.sku" class="pd-sku">Арт. {{ product.sku }}</span>
        <span v-if="product.category_name" class="pd-category">
          <span class="pd-category__dot" />{{ product.category_name }}
        </span>
      </div>

      <div class="pd-divider" />

      <!-- Description -->
      <p v-if="product.description" class="pd-description">{{ product.description }}</p>

      <!-- Characteristics -->
      <dl v-if="product.attributes.length" class="pd-attrs">
        <div v-for="attr in product.attributes" :key="attr.key" class="pd-attrs__row">
          <dt>{{ attr.key }}</dt><dd>{{ attr.value }}</dd>
        </div>
      </dl>

      <!-- Button at bottom -->
      <div class="pd-attrs-btn">
        <span class="pd-attrs-btn__icon">!</span>
        <span class="pd-attrs-btn__label">Характеристики и описание</span>
      </div>
    </div>
  </div>
</template>
