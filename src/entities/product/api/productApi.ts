import { apiClient } from '@/shared/api/client'
import type { ProductDetail, PaginatedAdminProducts, AdminProduct } from '../model/types'

export interface AuditLogEntry {
  id: string
  product_id: string
  action: string
  actor_id: string | null
  actor_email: string | null
  diff: Record<string, { before: string | null; after: string | null }>
  created_at: string
}

function adaptPublicItem(raw: any) {
  return {
    id: raw.id,
    name: raw.name,
    thumbnail_url: raw.thumbnail_url ?? null,
    price: raw.price ?? { amount: '0', currency: 'USD' },
    stock: raw.stock ?? 0,
    nearest_delivery_date: raw.nearest_delivery_date ?? null,
    avg_rating: raw.avg_rating ?? null,
    review_count: raw.review_count ?? 0,
  }
}

export const productApi = {
  // Public
  getPublicList: (cursor?: string | null, limit = 20, inStock = false, sort = 'default') =>
    apiClient
      .get('/public/products/', {
        params: {
          limit,
          ...(cursor ? { cursor } : {}),
          ...(inStock ? { in_stock: true } : {}),
          ...(sort !== 'default' ? { sort } : {}),
        },
      })
      .then((r) => ({
        items: (r.data.items ?? []).map(adaptPublicItem),
        next_cursor: r.data.next_cursor ?? null,
      })),

  getPublicById: (id: string): Promise<ProductDetail> =>
    apiClient.get(`/public/products/${id}`).then((r) => r.data),

  // Admin
  adminList: (
    cursor?: string | null,
    limit = 50,
    sort = 'default',
    search?: string | null,
    isActive?: boolean | null,
    inStock = false,
    priceMin?: number | null,
    priceMax?: number | null,
  ): Promise<PaginatedAdminProducts> =>
    apiClient
      .get('/admin/products/', {
        params: {
          limit,
          sort,
          ...(cursor ? { cursor } : {}),
          ...(search ? { search } : {}),
          ...(isActive !== undefined && isActive !== null ? { is_active: isActive } : {}),
          ...(inStock ? { in_stock: true } : {}),
          ...(priceMin != null ? { price_min: priceMin } : {}),
          ...(priceMax != null ? { price_max: priceMax } : {}),
        },
      })
      .then((r) => r.data),

  adminCount: (): Promise<{ count: number }> =>
    apiClient.get('/admin/products/count').then((r) => r.data),

  adminGet: (id: string): Promise<AdminProduct> =>
    apiClient.get(`/admin/products/${id}`).then((r) => r.data),

  adminCreate: (data: object): Promise<AdminProduct> =>
    apiClient.post('/admin/products/', data).then((r) => r.data),

  adminUpdate: (id: string, data: object): Promise<AdminProduct> =>
    apiClient.put(`/admin/products/${id}`, data).then((r) => r.data),

  adminDelete: (id: string): Promise<void> =>
    apiClient.delete(`/admin/products/${id}`).then(() => undefined),

  adminGetAuditLog: (id: string, limit = 50): Promise<{ entries: AuditLogEntry[] }> =>
    apiClient.get(`/admin/products/${id}/audit-log`, { params: { limit } }).then((r) => r.data),

  adminUploadImage: (id: string, file: File): Promise<{ image_url: string; thumbnail_url: string }> => {
    const form = new FormData()
    form.append('file', file)
    return apiClient
      .post(`/admin/products/${id}/image`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data)
  },
}
