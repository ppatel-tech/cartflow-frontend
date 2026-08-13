export interface WishlistItemResponse {
  productId: number
  productName: string
  productImageUrl: string | null
  price: number
  inStock: boolean
}

export interface WishlistResponse {
  id: number
  items: WishlistItemResponse[]
}