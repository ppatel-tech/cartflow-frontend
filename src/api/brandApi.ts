import axiosClient from './axiosClient'
import type { ApiResponse, PageResponse } from '../types/api.types'
import type { BrandResponse } from '../types/product.types'

export const brandApi = {
  getAll: () =>
    axiosClient.get<ApiResponse<PageResponse<BrandResponse>>>('/brands', {
      params: { size: 100 },
    }),
}