import axiosClient from './axiosClient'
import type { ApiResponse, PageResponse } from '../types/api.types'
import type { UserResponse, UpdateProfileRequest } from '../types/user.types'

export const userApi = {
  getMe: () =>
    axiosClient.get<ApiResponse<UserResponse>>('/users/me'),

  updateMe: (data: UpdateProfileRequest) =>
    axiosClient.put<ApiResponse<UserResponse>>('/users/me', data),

  deleteMe: () =>
    axiosClient.delete<ApiResponse<void>>('/users/me'),

    getAllForAdmin: (page: number, size: number) =>
    axiosClient.get<ApiResponse<PageResponse<UserResponse>>>('/admin/users', { params: { page, size } }),

  updateStatus: (id: number, status: string) =>
    axiosClient.patch<ApiResponse<UserResponse>>(`/admin/users/${id}/status`, { status }),
  
}