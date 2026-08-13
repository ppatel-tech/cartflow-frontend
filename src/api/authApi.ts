import axiosClient from './axiosClient'
import type { ApiResponse } from '../types/api.types'
import type { LoginRequest, LoginResponse, RegisterRequest, User } from '../types/auth.types'

export const authApi = {
  login: (data: LoginRequest) =>
    axiosClient.post<ApiResponse<LoginResponse>>('/auth/login', data),

  register: (data: RegisterRequest) =>
    axiosClient.post<ApiResponse<User>>('/auth/register', data),

  logout: (refreshToken: string) =>
    axiosClient.post<ApiResponse<void>>('/auth/logout', { refreshToken }),
}