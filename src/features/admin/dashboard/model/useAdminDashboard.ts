import { ref, onMounted } from 'vue'
import { productApi } from '@/entities/product'
import { sellerApi } from '@/entities/seller'
import type { AdminProduct } from '@/entities/product'

export function useAdminDashboard() {
  const stats = ref({ products: 0, sellers: 0 })
  const recentProducts = ref<AdminProduct[]>([])
  const loading = ref(true)

  onMounted(async () => {
    try {
      const [countData, recentData, sellersData] = await Promise.all([
        productApi.adminCount(),
        productApi.adminList(null, 5, 'newest'),
        sellerApi.list(),
      ])
      stats.value.products = countData.count
      stats.value.sellers = sellersData.length
      recentProducts.value = recentData.items
    } finally {
      loading.value = false
    }
  })

  return { stats, recentProducts, loading }
}
