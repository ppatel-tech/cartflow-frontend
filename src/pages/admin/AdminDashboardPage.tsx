import { useEffect, useState } from 'react'
import { adminApi } from '../../api/adminApi'
import { StatCard } from '../../components/admin/StatCard'
import type { DashboardSummaryResponse } from '../../types/admin.types'

export function AdminDashboardPage() {
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    adminApi.getDashboard()
      .then((res) => setSummary(res.data.data))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) return <p className="p-8 font-mono text-sm text-ink/50">Loading...</p>
  if (!summary) return <p className="p-8 font-mono text-sm text-ink/50">Could not load dashboard.</p>

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-display text-2xl text-ink mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Total revenue" value={`₹${summary.totalRevenue.toFixed(2)}`} accent />
        <StatCard label="Total orders" value={summary.totalOrders} />
        <StatCard label="Pending orders" value={summary.pendingOrders} />
        <StatCard label="Total users" value={summary.totalUsers} />
        <StatCard label="Total products" value={summary.totalProducts} />
        <StatCard label="Low stock items" value={summary.lowStockProducts} />
      </div>
    </div>
  )
}