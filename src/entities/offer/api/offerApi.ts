import { apiClient } from '@/shared/api/client'
import type { AdminOffer, CreateOfferPayload, UpdateOfferPayload } from '../model/types'

export const offerApi = {
  getByProduct: (productId: string): Promise<AdminOffer[]> =>
    apiClient.get(`/admin/products/${productId}/offers`).then((r) => r.data),

  create: (productId: string, data: CreateOfferPayload): Promise<AdminOffer> =>
    apiClient.post(`/admin/products/${productId}/offers`, data).then((r) => r.data),

  update: (offerId: string, data: UpdateOfferPayload): Promise<AdminOffer> =>
    apiClient.put(`/admin/offers/${offerId}`, data).then((r) => r.data),

  remove: (offerId: string): Promise<void> =>
    apiClient.delete(`/admin/offers/${offerId}`).then(() => undefined),
}
