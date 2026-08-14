import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { Button } from '../components/ui/Button'

export function CartPage() {
  const { cart, updateQuantity, removeItem } = useCart()
  const { showToast } = useToast()

  // Quantity update handler
  async function handleUpdateQuantity(itemId: number, newQuantity: number) {
    try {
      await updateQuantity(itemId, newQuantity)
    } catch {
      showToast('Failed to update quantity')
    }
  }

  // Item remove handler with toast notification
  async function handleRemove(itemId: number) {
    try {
      await removeItem(itemId)
      showToast('Item removed from cart')
    } catch {
      showToast('Failed to remove item')
    }
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="font-mono text-xs uppercase tracking-wider text-ink/50 mb-3">Cart</p>
        <h1 className="font-display text-2xl text-ink mb-6">Your cart is empty</h1>
        <Link to="/products">
          <Button>Browse products</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl text-ink mb-8">Cart</h1>

      <div className="flex flex-col divide-y divide-hairline border-t border-b border-hairline">
        {cart.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 py-4">
            <div className="w-20 h-20 bg-[#E5E3DA] rounded-[4px] overflow-hidden shrink-0">
              {item.productImageUrl && (
                <img
                  src={
                    item.productImageUrl.startsWith('http')
                      ? item.productImageUrl
                      : `http://localhost:8080${item.productImageUrl}`
                  }
                  alt={item.productName}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="flex-1">
              <p className="font-body text-sm text-ink font-medium mb-1">{item.productName}</p>
              <p className="font-mono text-xs text-ink/50">₹{item.unitPrice.toFixed(2)} each</p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2 font-mono text-sm">
              <button
                onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                className="w-7 h-7 border border-hairline rounded-[4px] hover:border-ink cursor-pointer"
              >
                −
              </button>
              <span className="w-6 text-center">{item.quantity}</span>
              <button
                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                className="w-7 h-7 border border-hairline rounded-[4px] hover:border-ink cursor-pointer"
              >
                +
              </button>
            </div>

            <p className="font-mono text-sm text-ink w-20 text-right">
              ₹{item.subtotal.toFixed(2)}
            </p>

            {/* Remove Button */}
            <button
              onClick={() => handleRemove(item.id)}
              className="font-mono text-xs text-brick hover:underline cursor-pointer"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <p className="font-mono text-xs text-ink/50">{cart.totalItems} item(s)</p>
        <p className="font-display text-xl text-ink">₹{cart.totalPrice.toFixed(2)}</p>
      </div>

      <Link to="/checkout">
        <Button className="w-full mt-6">Proceed to checkout</Button>
      </Link>
    </div>
  )
}