import axiosClient from './axiosClient'
import type { ApiResponse, PageResponse } from '../types/api.types'
import type { OrderResponse, CheckoutRequest, OrderConfigResponse } from '../types/order.types'

export const orderApi = {
  checkout: (data: CheckoutRequest) =>
    axiosClient.post<ApiResponse<OrderResponse>>('/orders/checkout', data),

  getMyOrders: (page: number, size: number) =>
    axiosClient.get<ApiResponse<PageResponse<OrderResponse>>>('/orders', { params: { page, size } }),

  getById: (id: number) =>
    axiosClient.get<ApiResponse<OrderResponse>>(`/orders/${id}`),

  cancel: (id: number) =>
    axiosClient.patch<ApiResponse<OrderResponse>>(`/orders/${id}/cancel`, {}),

  getConfig: () =>
    axiosClient.get<ApiResponse<OrderConfigResponse>>('/orders/config'),

  downloadInvoice: (id: number) =>
    axiosClient.get(`/orders/${id}/invoice`, { responseType: 'blob' }),
}