export type OrderStatus = 'CREATED' | 'CONFIRMED' | 'PACKING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED'
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED'

export interface OrderItemResponse {
  productId: number
  productName: string
  quantity: number
  sellingPrice: number
  subtotal: number
}

export interface OrderResponse {
  id: number
  orderNumber: string
  items: OrderItemResponse[]
  shippingFullName: string
  shippingPhone: string
  shippingStreet: string
  shippingCity: string
  shippingState: string
  shippingCountry: string
  shippingPostalCode: string
  subtotal: number
  discount: number
  tax: number
  shippingCharge: number
  finalAmount: number
  couponCode: string | null
  orderStatus: OrderStatus
  paymentStatus: PaymentStatus
  createdAt: string
}

export interface CheckoutRequest {
  addressId: number
  couponCode?: string
}

export interface OrderConfigResponse {
  taxRate: number
  shippingCharge: number
}