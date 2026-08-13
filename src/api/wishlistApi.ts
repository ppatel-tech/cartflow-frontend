import axiosClient from './axiosClient'
import type { ApiResponse } from '../types/api.types'
import type { WishlistResponse } from '../types/wishlist.types'

export const wishlistApi = {
  getWishlist: () =>
    axiosClient.get<ApiResponse<WishlistResponse>>('/wishlist'),

  addItem: (productId: number) =>
    axiosClient.post<ApiResponse<WishlistResponse>>('/wishlist/items', { productId }),

  removeItem: (productId: number) =>
    axiosClient.delete<ApiResponse<WishlistResponse>>(`/wishlist/items/${productId}`),
}