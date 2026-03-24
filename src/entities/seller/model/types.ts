export interface Seller {
  id: string
  name: string
  description: string | null
  email: string | null
  phone: string | null
  website: string | null
  country: string | null
  rating: number
  review_count: number
  is_verified: boolean
}
