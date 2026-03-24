import { apiClient } from '@/shared/api/client'

export interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null
}

export const categoryApi = {
  adminList: (): Promise<Category[]> =>
    apiClient.get('/admin/categories/').then((r) => r.data),
}
