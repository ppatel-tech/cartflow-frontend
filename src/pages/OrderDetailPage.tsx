import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { orderApi } from '../api/orderApi'
import { useToast } from '../context/ToastContext'
import { Button } from '../components/ui/Button'
import type { OrderResponse } from '../types/order.types'
import { BackButton } from '../components/ui/BackButton'

export function OrderDetailPage() {
  const { id } = useParams()
  const { showToast } = useToast()

  const [order, setOrder] = useState<OrderResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  function loadOrder() {
    if (!id) return
    setIsLoading(true)
    orderApi.getById(Number(id))
      .then((res) => setOrder(res.data.data))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    loadOrder()
  }, [id])

  async function handleCancel() {
    if (!id) return
    setIsCancelling(true)
    try {
      await orderApi.cancel(Number(id))
      loadOrder()
      showToast('Order cancelled')
    } catch {
      showToast('Could not cancel order', 'error')
    } finally {
      setIsCancelling(false)
    }
  }

  async function handleDownloadInvoice() {
    if (!id) return
    setIsDownloading(true)
    try {
      const res = await orderApi.downloadInvoice(Number(id))
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.download = `invoice-${order?.orderNumber}.pdf`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch {
      showToast('Could not download invoice', 'error')
    } finally {
      setIsDownloading(false)
    }
  }

  if (isLoading) return <p className="p-8 font-mono text-sm text-ink/50">Loading...</p>
  if (!order) return <p className="p-8 font-mono text-sm text-ink/50">Order not found.</p>

  const canCancel = order.orderStatus === 'CREATED' || order.orderStatus === 'CONFIRMED'

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
        <BackButton label="Back to orders" />
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="font-mono text-xs text-ink/50 mb-1">{order.orderNumber}</p>
          <h1 className="font-display text-2xl text-ink">Order details</h1>
        </div>
        <span className="font-mono text-xs uppercase tracking-wider text-forest border border-forest px-2 py-1 rounded-[3px]">
          {order.orderStatus.replace(/_/g, ' ')}
        </span>
      </div>

      <section className="mb-6">
        <h2 className="font-mono text-xs uppercase tracking-wider text-ink/50 mb-3">Items</h2>
        <div className="flex flex-col divide-y divide-hairline border-t border-b border-hairline">
          {order.items.map((item) => (
            <div key={item.productId} className="flex justify-between py-3">
              <div>
                <p className="font-body text-sm text-ink">{item.productName}</p>
                <p className="font-mono text-xs text-ink/50">Qty: {item.quantity}</p>
              </div>
              <p className="font-mono text-sm text-ink">₹{item.subtotal.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="font-mono text-xs uppercase tracking-wider text-ink/50 mb-3">
          Shipping address
        </h2>
        <p className="font-body text-sm text-ink/80">
          {order.shippingFullName}<br />
          {order.shippingStreet}, {order.shippingCity}, {order.shippingState} {order.shippingPostalCode}<br />
          {order.shippingCountry} · {order.shippingPhone}
        </p>
      </section>

      <section className="border-t border-hairline pt-4 mb-8">
        <div className="flex justify-between font-mono text-sm text-ink/70 mb-1">
          <span>Subtotal</span><span>₹{order.subtotal.toFixed(2)}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between font-mono text-sm text-forest mb-1">
            <span>Discount</span><span>−₹{order.discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-mono text-sm text-ink/70 mb-1">
          <span>Tax</span><span>₹{order.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-mono text-sm text-ink/70 mb-1">
          <span>Shipping</span><span>₹{order.shippingCharge.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-display text-xl text-ink mt-3 pt-3 border-t border-hairline">
          <span>Total</span><span>₹{order.finalAmount.toFixed(2)}</span>
        </div>
      </section>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={handleDownloadInvoice} disabled={isDownloading}>
          {isDownloading ? 'Downloading...' : 'Download invoice'}
        </Button>
        {canCancel && (
          <Button variant="secondary" onClick={handleCancel} disabled={isCancelling}
            className="!border-brick !text-brick hover:!bg-brick/5">
            {isCancelling ? 'Cancelling...' : 'Cancel order'}
          </Button>
        )}
      </div>
    </div>
  )
}