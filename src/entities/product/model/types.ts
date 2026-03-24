export interface ProductListItem {
  id: string
  name: string
  thumbnail_url: string | null
  price: { amount: string; currency: string }
  stock: number
  nearest_delivery_date: string | null
  avg_rating: number | null
  review_count: number
}

export interface ProductAttribute {
  key: string
  value: string
}

export interface AdminProduct {
  id: string
  name: string
  description: string | null
  sku: string | null
  category_id: string | null
  price: { amount: string; currency: string }
  stock: number
  is_active: boolean
  image_url: string | null
  thumbnail_url: string | null
  attributes: ProductAttribute[]
}

export interface ProductDetail {
  id: string
  name: string
  description: string | null
  image_url: string | null
  attributes: ProductAttribute[]
  avg_rating: number | null
  review_count: number
  sku: string | null
  min_price: { amount: string; currency: string } | null
  category_name: string | null
  offers: Array<{
    id: string
    seller: { id: string; name: string; rating: number }
    price: { amount: string; currency: string }
    delivery_date: string
  }>
}

export interface PaginatedAdminProducts {
  items: AdminProduct[]
  next_cursor: string | null
}

// legacy compat for public product list
export type { ProductListItem as PublicProductListItem }
