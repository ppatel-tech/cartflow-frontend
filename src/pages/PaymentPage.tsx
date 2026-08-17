import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { paymentApi } from '../api/paymentApi'
import { useToast } from '../context/ToastContext'
import { Button } from '../components/ui/Button'
import { BackButton } from '../components/ui/BackButton'
import type { PaymentMethod } from '../types/payment.types'
import type { AxiosError } from 'axios'
import type { ApiResponse } from '../types/api.types'

const methods: { value: PaymentMethod; label: string }[] = [
  { value: 'UPI', label: 'UPI' },
  { value: 'CARD', label: 'Card' },
  { value: 'NET_BANKING', label: 'Net banking' },
  { value: 'WALLET', label: 'Wallet' },
]

export function PaymentPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('UPI')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  async function handlePay(simulateSuccess: boolean) {
    if (!orderId) return
    setIsProcessing(true)
    setError('')

    try {
      const initiateRes = await paymentApi.initiate(Number(orderId), selectedMethod)
      const { transactionReference } = initiateRes.data.data

      await paymentApi.verify(transactionReference, simulateSuccess)

      if (simulateSuccess) {
        showToast('Payment successful')
      } else {
        showToast('Payment failed', 'error')
      }

      navigate(`/orders/${orderId}`)
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse<null>>
      setError(axiosError.response?.data?.message || 'Something went wrong')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-10">
      <BackButton label="Back to order" />
      <h1 className="font-display text-2xl text-ink mb-1">Payment</h1>
      <p className="font-mono text-xs text-ink/40 mb-8">Order #{orderId}</p>

      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-wider text-ink/50 mb-3">
          Choose method
        </p>
        <div className="grid grid-cols-2 gap-2">
          {methods.map((m) => (
            <button
              key={m.value}
              onClick={() => setSelectedMethod(m.value)}
              className={`px-4 py-3 border rounded-[4px] font-body text-sm text-left transition-colors ${
                selectedMethod === m.value
                  ? 'border-forest bg-forest/5 text-ink'
                  : 'border-hairline text-ink/70 hover:border-ink'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="font-mono text-xs text-brick border border-brick/30 bg-brick/5 px-3 py-2 rounded-[4px] mb-4">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3">
        <Button onClick={() => handlePay(true)} disabled={isProcessing} className="w-full">
          {isProcessing ? 'Processing...' : 'Pay now'}
        </Button>
        <button
          onClick={() => handlePay(false)}
          disabled={isProcessing}
          className="font-mono text-xs text-ink/40 hover:text-brick text-center disabled:opacity-50"
        >
          Simulate payment failure
        </button>
      </div>

      <p className="font-mono text-[10px] text-ink/30 mt-8 text-center">
        This is a mock payment gateway. No real payment is processed.
      </p>
    </div>
  )
}