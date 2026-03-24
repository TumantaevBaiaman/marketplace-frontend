import { ref, computed, type Ref } from 'vue'
import type { Offer, OfferSortField, SortOrder } from '@/entities/offer'

export function useOfferSort(offers: Ref<Offer[]>) {
  const sortField = ref<OfferSortField>('price')
  const sortOrder = ref<SortOrder>('asc')

  const sortedOffers = computed(() =>
    [...offers.value].sort((a, b) => {
      const av = a[sortField.value] ?? 0
      const bv = b[sortField.value] ?? 0
      const cmp = av < bv ? -1 : av > bv ? 1 : 0
      return sortOrder.value === 'asc' ? cmp : -cmp
    }),
  )

  function setSort(field: OfferSortField) {
    if (sortField.value === field) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortField.value = field
      sortOrder.value = 'asc'
    }
  }

  return { sortField, sortOrder, sortedOffers, setSort }
}
