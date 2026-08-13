import axiosClient from './axiosClient'
import type { ApiResponse, PageResponse } from '../types/api.types'
import type { ProductResponse } from '../types/product.types'

export const productApi = {
  getAll: (page: number, size: number, sort?: string) =>
    axiosClient.get<ApiResponse<PageResponse<ProductResponse>>>('/products', {
      params: { page, size, sort },
    }),

  getById: (id: number) =>
    axiosClient.get<ApiResponse<ProductResponse>>(`/products/${id}`),

  search: (keyword: string, page: number, size: number) =>
    axiosClient.get<ApiResponse<PageResponse<ProductResponse>>>('/products/search', {
      params: { keyword, page, size },
    }),

  filter: (params: {
    categoryId?: number
    brandId?: number
    minPrice?: number
    maxPrice?: number
    minRating?: number
    page: number
    size: number
  }) =>
    axiosClient.get<ApiResponse<PageResponse<ProductResponse>>>('/products/filter', { params }),
}