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

    useEffect(() => {
        if (!id) return
        setIsLoading(true)
        productApi.getById(Number(id))
            .then((res) => setProduct(res.data.data))
            .finally(() => setIsLoading(false))
    }, [id])

    if (isLoading) return <p className="p-8 font-mono text-sm text-ink/50">Loading...</p>
    if (!product) return <p className="p-8 font-mono text-sm text-ink/50">Product not found.</p>

    const displayPrice = product.discountPrice ?? product.price

    return (
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
            
            <div>
                <BackButton label="Back to products" />
                <div className="aspect-square bg-[#E5E3DA] rounded-[4px] overflow-hidden mb-3">
                    {product.imageUrls[activeImage] ? (
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

                {product.imageUrls.length > 1 && (
                    <div className="flex gap-2">
                        {product.imageUrls.map((url, i) => (
                            <button
                                key={url}
                                onClick={() => setActiveImage(i)}
                                className={`w-16 h-16 rounded-[4px] overflow-hidden border-2 ${i === activeImage ? 'border-forest' : 'border-transparent'
                                    }`}
                            >
                                <img src={`http://localhost:8080${url}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <p className="font-mono text-xs uppercase tracking-wider text-ink/50 mb-2">
                    {product.brandName} · {product.categoryName}
                </p>
                <h1 className="font-display text-2xl text-ink mb-1">{product.name}</h1>
                <p className="font-mono text-xs text-ink/40 mb-4">SKU: {product.sku}</p>

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

                <p className={`font-mono text-xs uppercase tracking-wider mb-4 ${product.inStock ? 'text-forest' : 'text-brick'
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
    )
}

