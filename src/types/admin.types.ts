export interface DashboardSummaryResponse {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  lowStockProducts: number
}

export interface RevenueReportResponse {
  totalRevenue: number
  totalTaxCollected: number
  totalDiscountsGiven: number
  totalSuccessfulPayments: number
}

export interface ProductReportResponse {
  productId: number
  productName: string
  unitsSold: number
  revenueGenerated: number
}

export interface CustomerReportResponse {
  customerId: number
  customerName: string
  totalOrders: number
  totalSpent: number
}

export interface SalesSummaryResponse {
  totalOrders: number
  deliveredOrders: number
  cancelledOrders: number
  totalRevenue: number
  averageOrderValue: number
}