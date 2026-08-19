import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { productApi } from '../api/productApi'
import { Button } from '../components/ui/Button'
import type { ProductResponse } from '../types/product.types'
import { useCart } from '../context/CartContext'
import { wishlistApi } from '../api/wishlistApi'
import type { AxiosError } from 'axios'
import type { ApiResponse } from '../types/api.types'
import { BackButton } from '../components/ui/BackButton'
import { reviewApi } from '../api/reviewApi'
import { ReviewForm } from '../components/product/ReviewForm'
import { ReviewList } from '../components/product/ReviewList'
import { StarRating } from '../components/product/StarRating'
import { useAuth } from '../context/AuthContext'
import type { ReviewResponse, ReviewRequest } from '../types/review.types'

export function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<ProductResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)

  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [addedMessage, setAddedMessage] = useState('')
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false)
  const [wishlistMessage, setWishlistMessage] = useState('')

  const { user } = useAuth()
  const [reviews, setReviews] = useState<ReviewResponse[]>([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [editingReview, setEditingReview] = useState<ReviewResponse | null>(null)
  const [reviewError, setReviewError] = useState('')

  // Product load karne ka function
  function loadProduct() {
    if (!id) return
    productApi.getById(Number(id))
      .then((res) => setProduct(res.data.data))
      .finally(() => setIsLoading(false))
  }

  // Reviews load karne ka function
  function loadReviews() {
    if (!id) return
    reviewApi.getByProduct(Number(id), 0, 20)
      .then((res) => setReviews(res.data.data.content))
  }

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    loadProduct()
    loadReviews()
  }, [id])

  async function handleAddToCart() {
    if (!product) return
    setIsAdding(true)
    try {
      await addItem(product.id, 1)
      setAddedMessage('Added to cart')
      setTimeout(() => setAddedMessage(''), 2000)
    } catch {
      setAddedMessage('Could not add to cart')
    } finally {
      setIsAdding(false)
    }
  }

  async function handleAddToWishlist() {
    if (!product) return
    setIsAddingToWishlist(true)
    try {
      await wishlistApi.addItem(product.id)
      setWishlistMessage('Added to wishlist')
      setTimeout(() => setWishlistMessage(''), 2000)
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse<null>>
      setWishlistMessage(axiosError.response?.data?.message || 'Could not add to wishlist')
      setTimeout(() => setWishlistMessage(''), 2000)
    } finally {
      setIsAddingToWishlist(false)
    }
  }

  async function handleAddReview(data: ReviewRequest) {
    if (!id) return
    setReviewError('')
    try {
      await reviewApi.add(Number(id), data)
      setShowReviewForm(false)
      loadReviews()
      loadProduct() // Rating upar bhi refresh ho jaye
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse<null>>
      setReviewError(axiosError.response?.data?.message || 'Could not submit review')
      throw err
    }
  }

  async function handleUpdateReview(data: ReviewRequest) {
    if (!id || !editingReview) return
    setReviewError('')
    try {
      await reviewApi.update(Number(id), editingReview.id, data)
      setEditingReview(null)
      loadReviews()
      loadProduct() // Rating recalculate hoke refresh ho
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse<null>>
      setReviewError(axiosError.response?.data?.message || 'Could not update review')
      throw err
    }
  }

  async function handleDeleteReview(reviewId: number) {
    if (!id) return
    try {
      await reviewApi.remove(Number(id), reviewId)
      loadReviews()
      loadProduct() // Delete ke baad bhi average recalculate refresh ho
    } catch {
      setReviewError('Could not delete review')
    }
  }

  if (isLoading) return <p className="p-8 font-mono text-sm text-ink/50">Loading...</p>
  if (!product) return <p className="p-8 font-mono text-sm text-ink/50">Product not found.</p>

  const displayPrice = product.discountPrice ?? product.price

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <BackButton label="Back to products" />

      {/* Top 2-Column Grid: Images (Left) & Product Details (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        
        {/* Left Column: Product Image Gallery */}
        <div>
          <div className="aspect-square bg-[#E5E3DA] rounded-[4px] overflow-hidden mb-3">
            {product.imageUrls && product.imageUrls[activeImage] ? (
              <img
                src={`http://localhost:8080${product.imageUrls[activeImage]}`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-mono text-xs text-ink/30">
                No image
              </div>
            )}
          </div>

          {product.imageUrls && product.imageUrls.length > 1 && (
            <div className="flex gap-2">
              {product.imageUrls.map((url, i) => (
                <button
                  key={url}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-[4px] overflow-hidden border-2 cursor-pointer ${
                    i === activeImage ? 'border-forest' : 'border-transparent'
                  }`}
                >
                  <img src={`http://localhost:8080${url}`} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Information */}
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-ink/50 mb-2">
            {product.brandName} · {product.categoryName}
          </p>
          <h1 className="font-display text-2xl text-ink mb-1">{product.name}</h1>
          <p className="font-mono text-xs text-ink/40 mb-3">SKU: {product.sku}</p>

          {/* Average Rating Display */}
          <div className="flex items-center gap-2 mb-4">
            <StarRating value={Math.round(product.averageRating)} readOnly />
            <span className="font-mono text-xs text-ink/50">
              {product.averageRating.toFixed(1)} ({product.totalReviews} review{product.totalReviews !== 1 ? 's' : ''})
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-mono text-2xl text-ink">₹{displayPrice.toFixed(2)}</span>
            {product.discountPrice !== null && (
              <span className="font-mono text-sm text-ink/40 line-through">
                ₹{product.price.toFixed(2)}
              </span>
            )}
          </div>

          <p className="font-body text-sm text-ink/80 leading-relaxed mb-6">
            {product.description}
          </p>

          <p className={`font-mono text-xs uppercase tracking-wider mb-4 ${
            product.inStock ? 'text-forest' : 'text-brick'
          }`}>
            {product.inStock ? 'In stock' : 'Out of stock'}
          </p>

          <div className="flex gap-3">
            <Button disabled={!product.inStock || isAdding} onClick={handleAddToCart} className="flex-1">
              {isAdding ? 'Adding...' : 'Add to cart'}
            </Button>
            <Button
              variant="secondary"
              onClick={handleAddToWishlist}
              disabled={isAddingToWishlist}
            >
              {isAddingToWishlist ? '...' : '♡ Wishlist'}
            </Button>
          </div>

          {addedMessage && (
            <p className="font-mono text-xs text-forest mt-2">{addedMessage}</p>
          )}
          {wishlistMessage && (
            <p className="font-mono text-xs text-forest mt-2">{wishlistMessage}</p>
          )}
        </div>
      </div>

      {/* Bottom Section: Full Width Reviews Section */}
      <section className="border-t border-hairline pt-10 pb-16">
        <h2 className="font-display text-xl text-ink mb-4">Reviews</h2>

        {user && !showReviewForm && !editingReview && (
          <Button variant="secondary" onClick={() => setShowReviewForm(true)} className="mb-4">
            Write a review
          </Button>
        )}

        {reviewError && (
          <p className="font-mono text-xs text-brick border border-brick/30 bg-brick/5 px-3 py-2 rounded-[4px] mb-4">
            {reviewError}
          </p>
        )}

        {showReviewForm && (
          <div className="mb-6">
            <ReviewForm onSubmit={handleAddReview} onCancel={() => setShowReviewForm(false)} />
          </div>
        )}

        {editingReview && (
          <div className="mb-6">
            <ReviewForm
              initialData={{ rating: editingReview.rating, review: editingReview.review ?? undefined }}
              onSubmit={handleUpdateReview}
              onCancel={() => setEditingReview(null)}
            />
          </div>
        )}

        <ReviewList
          reviews={reviews}
          currentUserId={user?.id}
          onEdit={(r) => { setEditingReview(r); setShowReviewForm(false) }}
          onDelete={handleDeleteReview}
        />
      </section>

    </div>
  )
}