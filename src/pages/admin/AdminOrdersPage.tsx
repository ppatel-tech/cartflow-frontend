import { useEffect, useState } from 'react'
import { orderApi } from '../../api/orderApi'
import { useToast } from '../../context/ToastContext'
import { StatusBadge } from '../../components/admin/StatusBadge'
import { getNextStatuses } from '../../utils/orderStatus'
import type { OrderResponse, OrderStatus } from '../../types/order.types'

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const { showToast } = useToast()

  function loadOrders() {
    setIsLoading(true)
    orderApi.getAllForAdmin(0, 50)
      .then((res) => setOrders(res.data.data.content))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    loadOrders()
  }, [])

  async function handleStatusChange(orderId: number, newStatus: OrderStatus) {
    setUpdatingId(orderId)
    try {
      await orderApi.updateStatus(orderId, newStatus)
      showToast(`Order moved to ${newStatus.replace(/_/g, ' ')}`)
      loadOrders()
    } catch {
      showToast('Could not update order status', 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  if (isLoading) return <p className="p-8 font-mono text-sm text-ink/50">Loading...</p>

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl text-ink mb-6">Orders</h1>

      <div className="flex flex-col divide-y divide-hairline border-t border-b border-hairline">
        {orders.map((order) => {
          const nextStatuses = getNextStatuses(order.orderStatus)
          return (
            <div key={order.id} className="py-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-ink/50">{order.orderNumber}</p>
                <p className="font-body text-sm text-ink mt-0.5">
                  {order.shippingFullName} · ₹{order.finalAmount.toFixed(2)}
                </p>
                <p className="font-mono text-[10px] text-ink/30 mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <StatusBadge status={order.orderStatus} />
                {nextStatuses.length > 0 && (
                  <select
                    value=""
                    disabled={updatingId === order.id}
                    onChange={(e) => e.target.value && handleStatusChange(order.id, e.target.value as OrderStatus)}
                    className="font-mono text-xs border border-hairline rounded-[4px] px-2 py-1.5 bg-paper"
                  >
                    <option value="" disabled>Move to...</option>
                    {nextStatuses.map((s) => (
                      <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}