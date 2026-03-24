<script setup lang="ts">
import { useProductPage } from '@/features/products/product-page'
import { ProductDetails } from '@/widgets/product-details'
import { OfferList } from '@/widgets/offer-list'
import { AppLoader, AppModal } from '@/shared/ui'
import type { PublicOffer } from '@/entities/offer'
import { formatPrice } from '@/shared/lib/formatters'

const {
  product,
  loading,
  error,
  selectedOffer,
  selectedSeller,
  loadingSeller,
  showSellerModal,
  selectOffer,
} = useProductPage()
</script>

<template>
  <main class="page-product">
    <div class="container">
      <AppLoader v-if="loading" />
      <p v-else-if="error" class="page-product__error">{{ error }}</p>
      <div v-else-if="product" class="page-product__grid">
        <ProductDetails :product="product" :selected-offer="selectedOffer" />
        <OfferList
          :offers="(product.offers as PublicOffer[])"
          @select="selectOffer"
        />
      </div>
    </div>

    <AppModal
      v-if="showSellerModal"
      title="Предложение продавца"
      size="md"
      @close="showSellerModal = false"
    >
      <AppLoader v-if="loadingSeller" />
      <template v-else-if="selectedSeller && selectedOffer">
        <div class="seller-modal">
          <div class="seller-modal__header">
            <div class="seller-modal__name">
              {{ selectedSeller.name }}
              <span v-if="selectedSeller.is_verified" class="badge badge--success" style="font-size:12px">✓ Верифицирован</span>
            </div>
            <div class="seller-modal__rating">★ {{ Number(selectedSeller.rating).toFixed(1) }} ({{ selectedSeller.review_count }} отзывов)</div>
          </div>
          <div class="seller-modal__price">
            {{ formatPrice(selectedOffer.price.amount, selectedOffer.price.currency) }}
          </div>
          <p v-if="selectedSeller.description" class="seller-modal__desc">{{ selectedSeller.description }}</p>
          <div class="seller-modal__contacts">
            <div v-if="selectedSeller.email" class="seller-modal__contact">
              <span class="seller-modal__contact-label">Email:</span>
              <a :href="`mailto:${selectedSeller.email}`">{{ selectedSeller.email }}</a>
            </div>
            <div v-if="selectedSeller.phone" class="seller-modal__contact">
              <span class="seller-modal__contact-label">Телефон:</span>
              <a :href="`tel:${selectedSeller.phone}`">{{ selectedSeller.phone }}</a>
            </div>
            <div v-if="selectedSeller.website" class="seller-modal__contact">
              <span class="seller-modal__contact-label">Сайт:</span>
              <a :href="selectedSeller.website" target="_blank">{{ selectedSeller.website }}</a>
            </div>
            <div v-if="selectedSeller.country" class="seller-modal__contact">
              <span class="seller-modal__contact-label">Страна:</span>
              <span>{{ selectedSeller.country }}</span>
            </div>
          </div>
        </div>
      </template>
    </AppModal>
  </main>
</template>

<style scoped>
.page-product__grid {
  display: grid;
  grid-template-columns: 1fr 0.8fr 0.8fr;
  gap: 16px;
  align-items: stretch;
  height: 70vh;
}
@media (max-width: 860px) {
  .page-product__grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 540px) {
  .page-product__grid { grid-template-columns: 1fr; }
}
.seller-modal { display: flex; flex-direction: column; gap: 12px; }
.seller-modal__header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
.seller-modal__name { font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
.seller-modal__rating { color: #f59e0b; font-weight: 500; }
.seller-modal__price { font-size: 28px; font-weight: 700; color: var(--color-primary, #6366f1); }
.seller-modal__desc { color: #6b7280; font-size: 14px; }
.seller-modal__contacts { display: flex; flex-direction: column; gap: 8px; border-top: 1px solid #e5e7eb; padding-top: 12px; }
.seller-modal__contact { display: flex; gap: 8px; font-size: 14px; }
.seller-modal__contact-label { color: #6b7280; min-width: 70px; }
.seller-modal__contact a { color: var(--color-primary, #6366f1); text-decoration: none; }
.seller-modal__contact a:hover { text-decoration: underline; }
</style>
