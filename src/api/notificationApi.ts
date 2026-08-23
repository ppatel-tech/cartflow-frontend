import axiosClient from './axiosClient'
import type { ApiResponse, PageResponse } from '../types/api.types'
import type { NotificationResponse } from '../types/notification.types'

export const notificationApi = {
  getAll: (page: number, size: number) =>
    axiosClient.get<ApiResponse<PageResponse<NotificationResponse>>>(
      '/notifications', { params: { page, size, sort: 'createdAt,desc' } }
    ),

  markAsRead: (id: number) =>
    axiosClient.patch<ApiResponse<NotificationResponse>>(`/notifications/${id}/read`, {}),
}