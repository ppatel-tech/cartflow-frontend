import axiosClient from './axiosClient'
import type { ApiResponse } from '../types/api.types'

export interface CouponDiscountResponse {
  code: string
  cartTotal: number
  discountAmount: number
  finalAmount: number
}

export const couponApi = {
  validate: (code: string) =>
    axiosClient.post<ApiResponse<CouponDiscountResponse>>(`/coupons/validate?code=${code}`),
}