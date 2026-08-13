export interface CartItemResponse {
  id: number
  productId: number
  productName: string
  productImageUrl: string | null
  unitPrice: number
  quantity: number
  subtotal: number
}

export interface CartResponse {
  id: number
  items: CartItemResponse[]
  totalItems: number
  totalPrice: number
}