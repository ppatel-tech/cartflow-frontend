import axiosClient from './axiosClient'
import type { ApiResponse, PageResponse } from '../types/api.types'
import type { ReviewResponse, ReviewRequest } from '../types/review.types'

export const reviewApi = {
  getByProduct: (productId: number, page: number, size: number) =>
    axiosClient.get<ApiResponse<PageResponse<ReviewResponse>>>(
      `/products/${productId}/reviews`, { params: { page, size, sort: 'createdAt,desc' } }
    ),

  add: (productId: number, data: ReviewRequest) =>
    axiosClient.post<ApiResponse<ReviewResponse>>(`/products/${productId}/reviews`, data),

  update: (productId: number, reviewId: number, data: ReviewRequest) =>
    axiosClient.put<ApiResponse<ReviewResponse>>(`/products/${productId}/reviews/${reviewId}`, data),

  remove: (productId: number, reviewId: number) =>
    axiosClient.delete<ApiResponse<void>>(`/products/${productId}/reviews/${reviewId}`),
}