import axiosClient from './axiosClient'
import type { ApiResponse } from '../types/api.types'
import type {
  DashboardSummaryResponse, RevenueReportResponse,
  ProductReportResponse, CustomerReportResponse, SalesSummaryResponse,
} from '../types/admin.types'

export const adminApi = {
  getDashboard: () =>
    axiosClient.get<ApiResponse<DashboardSummaryResponse>>('/admin/dashboard'),

  getRevenueReport: () =>
    axiosClient.get<ApiResponse<RevenueReportResponse>>('/reports/revenue'),

  getProductReport: () =>
    axiosClient.get<ApiResponse<ProductReportResponse[]>>('/reports/products'),

  getCustomerReport: () =>
    axiosClient.get<ApiResponse<CustomerReportResponse[]>>('/reports/customers'),

  getSalesSummary: () =>
    axiosClient.get<ApiResponse<SalesSummaryResponse>>('/reports/sales-summary'),
}

