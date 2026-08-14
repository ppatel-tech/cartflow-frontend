import axiosClient from './axiosClient'
import type { ApiResponse } from '../types/api.types'
import type { UserResponse, UpdateProfileRequest } from '../types/user.types'

export const userApi = {
  getMe: () =>
    axiosClient.get<ApiResponse<UserResponse>>('/users/me'),

  updateMe: (data: UpdateProfileRequest) =>
    axiosClient.put<ApiResponse<UserResponse>>('/users/me', data),

  deleteMe: () =>
    axiosClient.delete<ApiResponse<void>>('/users/me'),
}