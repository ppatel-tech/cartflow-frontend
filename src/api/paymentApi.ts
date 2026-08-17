import axiosClient from './axiosClient'
import type { ApiResponse } from '../types/api.types'
import type { PaymentResponse, PaymentMethod } from '../types/payment.types'

export const paymentApi = {
  initiate: (orderId: number, paymentMethod: PaymentMethod) =>
    axiosClient.post<ApiResponse<PaymentResponse>>('/payments/initiate', { orderId, paymentMethod }),

  verify: (transactionReference: string, success: boolean) =>
    axiosClient.post<ApiResponse<PaymentResponse>>('/payments/verify', { transactionReference, success }),
}