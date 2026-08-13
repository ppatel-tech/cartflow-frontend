import axiosClient from './axiosClient'
import type { ApiResponse } from '../types/api.types'
import type { CartResponse } from '../types/cart.types'

export const cartApi = {
  getCart: () =>
    axiosClient.get<ApiResponse<CartResponse>>('/cart'),

  addItem: (productId: number, quantity: number) =>
    axiosClient.post<ApiResponse<CartResponse>>('/cart/items', { productId, quantity }),

  updateQuantity: (itemId: number, quantity: number) =>
    axiosClient.put<ApiResponse<CartResponse>>(`/cart/items/${itemId}`, { quantity }),

  removeItem: (itemId: number) =>
    axiosClient.delete<ApiResponse<CartResponse>>(`/cart/items/${itemId}`),

  clearCart: () =>
    axiosClient.delete<ApiResponse<void>>('/cart'),
}