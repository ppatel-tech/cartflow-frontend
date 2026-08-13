import { useEffect, useState } from 'react'
import { orderApi } from '../api/orderApi'
import { OrderCard } from '../components/order/OrderCard'
import type { OrderResponse } from '../types/order.types'

export function OrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    orderApi.getMyOrders(0, 20)
      .then((res) => setOrders(res.data.data.content))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl text-ink mb-6">Orders</h1>

      {isLoading ? (
        <p className="font-mono text-sm text-ink/50">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="font-mono text-sm text-ink/50">No orders yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}