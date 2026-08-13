import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { wishlistApi } from '../api/wishlistApi'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { Button } from '../components/ui/Button'
import type { WishlistResponse } from '../types/wishlist.types'

export function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { addItem } = useCart()
  const { showToast } = useToast()

  function loadWishlist() {
    setIsLoading(true)
    wishlistApi.getWishlist()
      .then((res) => setWishlist(res.data.data))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    loadWishlist()
  }, [])

  async function handleRemove(productId: number) {
    await wishlistApi.removeItem(productId)
    loadWishlist()
    showToast('Removed from wishlist')
  }

  async function handleMoveToCart(productId: number) {
    await addItem(productId, 1)
    await wishlistApi.removeItem(productId)
    loadWishlist()
    showToast('Moved to cart')
  }

  if (isLoading) return <p className="p-8 font-mono text-sm text-ink/50">Loading...</p>

  if (!wishlist || wishlist.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="font-mono text-xs uppercase tracking-wider text-ink/50 mb-3">Wishlist</p>
        <h1 className="font-display text-2xl text-ink mb-6">Nothing saved yet</h1>
        <Link to="/products">
          <Button>Browse products</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl text-ink mb-8">Wishlist</h1>

      <div className="flex flex-col divide-y divide-hairline border-t border-b border-hairline">
        {wishlist.items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 py-4">
            <Link to={`/products/${item.productId}`} className="w-16 h-16 bg-[#E5E3DA] rounded-[4px] overflow-hidden shrink-0">
              {item.productImageUrl && (
                <img
                  src={`http://localhost:8080${item.productImageUrl}`}
                  className="w-full h-full object-cover"
                />
              )}
            </Link>

            <div className="flex-1">
              <Link to={`/products/${item.productId}`} className="font-body text-sm text-ink font-medium hover:underline">
                {item.productName}
              </Link>
              <p className="font-mono text-xs text-ink/50 mt-1">₹{item.price.toFixed(2)}</p>
              {!item.inStock && (
                <p className="font-mono text-[10px] uppercase tracking-wider text-brick mt-1">
                  Out of stock
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5 items-end">
              <button
                onClick={() => handleMoveToCart(item.productId)}
                disabled={!item.inStock}
                className="font-mono text-xs text-forest hover:underline disabled:text-ink/30 disabled:no-underline disabled:cursor-not-allowed"
              >
                Move to cart
              </button>
              <button
                onClick={() => handleRemove(item.productId)}
                className="font-mono text-xs text-brick hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}