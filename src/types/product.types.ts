export interface ProductResponse {
  id: number
  name: string
  sku: string
  description: string
  price: number
  discountPrice: number | null
  averageRating: number
  totalReviews: number
  isActive: boolean
  categoryId: number
  categoryName: string
  brandId: number
  brandName: string
  imageUrls: string[]
  inStock: boolean
  createdAt: string
}

export interface CategoryResponse {
  id: number
  name: string
  description: string
  isActive: boolean
}

export interface BrandResponse {
  id: number
  name: string
  description: string
  isActive: boolean
}