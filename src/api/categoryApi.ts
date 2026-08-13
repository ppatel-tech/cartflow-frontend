import axiosClient from './axiosClient'
import type { ApiResponse, PageResponse } from '../types/api.types'
import type { CategoryResponse } from '../types/product.types'

export const categoryApi = {
  getAll: () =>
    axiosClient.get<ApiResponse<PageResponse<CategoryResponse>>>('/categories', {
      params: { size: 100 },
    }),
}