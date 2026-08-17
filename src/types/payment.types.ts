export type PaymentMethod = 'MOCK' | 'CARD' | 'UPI' | 'NET_BANKING' | 'WALLET'
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED'

export interface PaymentResponse {
  id: number
  orderId: number
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  transactionReference: string
  paidAmount: number | null
  paidAt: string | null
}