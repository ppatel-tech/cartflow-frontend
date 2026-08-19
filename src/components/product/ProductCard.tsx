import { Link } from 'react-router-dom'
import type { ProductResponse } from '../../types/product.types'

export function ProductCard({ product }: { product: ProductResponse }) {
  const displayPrice = product.discountPrice ?? product.price
  const hasDiscount = product.discountPrice !== null

  return (
    <Link
      to={`/products/${product.id}`}
      className="group relative block border border-hairline bg-paper hover:border-ink transition-colors rounded-[4px] overflow-hidden"
    >
      <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full border border-hairline bg-paper z-10" />

      <div className="aspect-square bg-[#E5E3DA] overflow-hidden">
        {product.imageUrls[0] ? (
          <img
            src={`http://localhost:8080${product.imageUrls[0]}`}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-mono text-xs text-ink/30">
            No image
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="font-mono text-[10px] uppercase tracking-wider text-ink/50 mb-1">
          {product.brandName}
        </p>
        <h3 className="font-body text-sm text-ink font-medium leading-snug mb-2 line-clamp-2">
          {product.name}
        </h3>
        {product.totalReviews > 0 && (
          <div className="flex items-center gap-1 mb-1.5">
            <span className="text-brass text-xs">★</span>
            <span className="font-mono text-[11px] text-ink/60">
              {product.averageRating.toFixed(1)} ({product.totalReviews})
            </span>
          </div>
        )}
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-sm text-ink">₹{displayPrice.toFixed(2)}</span>
          {hasDiscount && (
            <span className="font-mono text-xs text-ink/40 line-through">
              ₹{product.price.toFixed(2)}
            </span>
          )}
        </div>

        {!product.inStock && (
          <p className="font-mono text-[10px] uppercase tracking-wider text-brick mt-2">
            Out of stock
          </p>
        )}
      </div>
    </Link>
  )
}