import { useEffect, useState } from 'react'
import { adminApi } from '../../api/adminApi'
import { StatCard } from '../../components/admin/StatCard'
import type {
  RevenueReportResponse, ProductReportResponse,
  CustomerReportResponse, SalesSummaryResponse,
} from '../../types/admin.types'

export function AdminReportsPage() {
  const [revenue, setRevenue] = useState<RevenueReportResponse | null>(null)
  const [products, setProducts] = useState<ProductReportResponse[]>([])
  const [customers, setCustomers] = useState<CustomerReportResponse[]>([])
  const [summary, setSummary] = useState<SalesSummaryResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      adminApi.getRevenueReport(),
      adminApi.getProductReport(),
      adminApi.getCustomerReport(),
      adminApi.getSalesSummary(),
    ]).then(([r, p, c, s]) => {
      setRevenue(r.data.data)
      setProducts(p.data.data)
      setCustomers(c.data.data)
      setSummary(s.data.data)
    }).finally(() => setIsLoading(false))
  }, [])

  if (isLoading) return <p className="p-8 font-mono text-sm text-ink/50">Loading...</p>

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-display text-2xl text-ink mb-8">Reports</h1>

      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total orders" value={summary.totalOrders} />
          <StatCard label="Delivered" value={summary.deliveredOrders} />
          <StatCard label="Cancelled" value={summary.cancelledOrders} />
          <StatCard label="Avg order value" value={`₹${summary.averageOrderValue.toFixed(2)}`} />
        </div>
      )}

      {revenue && (
        <section className="mb-10">
          <h2 className="font-mono text-xs uppercase tracking-wider text-ink/50 mb-3">Revenue</h2>
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Total revenue" value={`₹${revenue.totalRevenue.toFixed(2)}`} accent />
            <StatCard label="Tax collected" value={`₹${revenue.totalTaxCollected.toFixed(2)}`} />
            <StatCard label="Discounts given" value={`₹${revenue.totalDiscountsGiven.toFixed(2)}`} />
          </div>
        </section>
      )}

      <section className="mb-10">
        <h2 className="font-mono text-xs uppercase tracking-wider text-ink/50 mb-3">
          Top products
        </h2>
        <div className="flex flex-col divide-y divide-hairline border-t border-b border-hairline">
          {products.slice(0, 10).map((p) => (
            <div key={p.productId} className="flex justify-between py-2.5">
              <span className="font-body text-sm text-ink">{p.productName}</span>
              <span className="font-mono text-xs text-ink/60">
                {p.unitsSold} sold · ₹{p.revenueGenerated.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-mono text-xs uppercase tracking-wider text-ink/50 mb-3">
          Top customers
        </h2>
        <div className="flex flex-col divide-y divide-hairline border-t border-b border-hairline">
          {customers.slice(0, 10).map((c) => (
            <div key={c.customerId} className="flex justify-between py-2.5">
              <span className="font-body text-sm text-ink">{c.customerName}</span>
              <span className="font-mono text-xs text-ink/60">
                {c.totalOrders} orders · ₹{c.totalSpent.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}