import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { productApi } from '@/entities/product'
import { sellerApi } from '@/entities/seller'
import type { ProductDetail } from '@/entities/product'
import type { PublicOffer } from '@/entities/offer'
import type { Seller } from '@/entities/seller'

export function useProductPage() {
  const route = useRoute()
  const productId = route.params.id as string

  const product = ref<ProductDetail | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  const selectedOffer = ref<PublicOffer | null>(null)
  const selectedSeller = ref<Seller | null>(null)
  const loadingSeller = ref(false)
  const showSellerModal = ref(false)

  onMounted(async () => {
    try {
      product.value = await productApi.getPublicById(productId)
      if (product.value.offers.length > 0) {
        await selectOffer(product.value.offers[0] as PublicOffer, false)
      }
    } catch {
      error.value = 'Товар не найден'
    } finally {
      loading.value = false
    }
  })

  async function selectOffer(offer: PublicOffer, openModal = true) {
    selectedOffer.value = offer
    if (openModal) showSellerModal.value = true
    loadingSeller.value = true
    try {
      selectedSeller.value = await sellerApi.getPublic(offer.seller.id)
    } finally {
      loadingSeller.value = false
    }
  }

  return {
    product,
    loading,
    error,
    selectedOffer,
    selectedSeller,
    loadingSeller,
    showSellerModal,
    selectOffer,
  }
}
