import axiosClient from './axiosClient'
import type { ApiResponse } from '../types/api.types'
import type { AddressResponse, AddressRequest } from '../types/address.types'

export const addressApi = {
  getAll: () =>
    axiosClient.get<ApiResponse<AddressResponse[]>>('/users/addresses'),

  create: (data: AddressRequest) =>
    axiosClient.post<ApiResponse<AddressResponse>>('/users/addresses', data),

  update: (id: number, data: AddressRequest) =>
    axiosClient.put<ApiResponse<AddressResponse>>(`/users/addresses/${id}`, data),

  remove: (id: number) =>
    axiosClient.delete<ApiResponse<void>>(`/users/addresses/${id}`),

  setDefault: (id: number) =>
    axiosClient.patch<ApiResponse<AddressResponse>>(`/users/addresses/${id}/default`, {}),
}