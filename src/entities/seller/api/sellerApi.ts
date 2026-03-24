import { apiClient } from '@/shared/api/client'
import type { Seller } from '../model/types'

export interface CreateSellerPayload {
  name: string
  description?: string | null
  email?: string | null
  phone?: string | null
  website?: string | null
  country?: string | null
  rating?: number
  is_verified?: boolean
}

export interface UpdateSellerPayload {
  name?: string | null
  description?: string | null
  email?: string | null
  phone?: string | null
  website?: string | null
  country?: string | null
  rating?: number | null
  is_verified?: boolean | null
}

export const sellerApi = {
  list: () =>
    apiClient.get<Seller[]>('/admin/sellers/').then((r) => r.data),

  create: (data: CreateSellerPayload) =>
    apiClient.post<Seller>('/admin/sellers/', data).then((r) => r.data),

  update: (id: string, data: UpdateSellerPayload) =>
    apiClient.put<Seller>(`/admin/sellers/${id}`, data).then((r) => r.data),

  getPublic: (id: string) =>
    apiClient.get<Seller>(`/public/sellers/${id}`).then((r) => r.data),
}
