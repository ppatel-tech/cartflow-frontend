import { Link } from 'react-router-dom'
import type { OrderResponse } from '../../types/order.types'

const statusColors: Record<string, string> = {
  CREATED: 'text-ink/60',
  CONFIRMED: 'text-forest',
  PACKING: 'text-forest',
  SHIPPED: 'text-forest',
  OUT_FOR_DELIVERY: 'text-forest',
  DELIVERED: 'text-forest',
  CANCELLED: 'text-brick',
}

export function OrderCard({ order }: { order: OrderResponse }) {
  return (
    <Link
      to={`/orders/${order.id}`}
      className="block border border-hairline p-4 rounded-[4px] hover:border-ink transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-mono text-xs text-ink/50">{order.orderNumber}</p>
          <p className="font-mono text-xs text-ink/40 mt-0.5">
            {new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </p>
        </div>
        <span className={`font-mono text-xs uppercase tracking-wider ${statusColors[order.orderStatus]}`}>
          {order.orderStatus.replace(/_/g, ' ')}
        </span>
      </div>

      <p className="font-body text-sm text-ink/70 mb-2">
        {order.items.length} item(s)
      </p>

      <p className="font-display text-lg text-ink">₹{order.finalAmount.toFixed(2)}</p>
    </Link>
  )
}