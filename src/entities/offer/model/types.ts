export interface AdminOffer {
  id: string
  product_id: string
  seller_id: string
  seller_name: string | null
  price: { amount: string; currency: string }
  delivery_date: string
  condition: 'new' | 'used' | 'refurbished'
  quantity: number
  is_available: boolean
  delivery_days_min: number | null
  delivery_days_max: number | null
}

export interface CreateOfferPayload {
  seller_id: string
  price: { amount: number; currency: string }
  delivery_date: string
  condition?: string
  quantity?: number
  is_available?: boolean
  delivery_days_min?: number | null
  delivery_days_max?: number | null
}

export interface UpdateOfferPayload {
  seller_id?: string
  price?: { amount: number; currency: string }
  delivery_date?: string
  condition?: string
  quantity?: number
  is_available?: boolean
  delivery_days_min?: number | null
  delivery_days_max?: number | null
}

// Public offer (comes from /public/products/{id})
export interface PublicOffer {
  id: string
  seller: { id: string; name: string; rating: number }
  price: { amount: string; currency: string }
  delivery_date: string
}

export type OfferSortField = 'price' | 'delivery_date'
export type SortOrder = 'asc' | 'desc'
