import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addressApi } from '../api/addressApi'
import { orderApi } from '../api/orderApi'
import { couponApi, type CouponDiscountResponse } from '../api/couponApi'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { Button } from '../components/ui/Button'
import type { AddressResponse } from '../types/address.types'
import type { AxiosError } from 'axios'
import type { ApiResponse } from '../types/api.types'
import { BackButton } from '../components/ui/BackButton'

export function CheckoutPage() {
    const { cart, refreshCart } = useCart()
    const { showToast } = useToast()
    const navigate = useNavigate()

    const [addresses, setAddresses] = useState<AddressResponse[]>([])
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
    const [couponCode, setCouponCode] = useState('')
    const [couponResult, setCouponResult] = useState<CouponDiscountResponse | null>(null)
    const [couponError, setCouponError] = useState('')
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)
    const [isPlacingOrder, setIsPlacingOrder] = useState(false)
    const [orderError, setOrderError] = useState('')
    const [config, setConfig] = useState<{ taxRate: number; shippingCharge: number } | null>(null)
    useEffect(() => {
        addressApi.getAll().then((res) => {
            setAddresses(res.data.data)
            const defaultAddr = res.data.data.find((a) => a.isDefault)
            if (defaultAddr) setSelectedAddressId(defaultAddr.id)
            else if (res.data.data.length > 0) setSelectedAddressId(res.data.data[0].id)
        })
        orderApi.getConfig().then((res) => setConfig(res.data.data))

    }, [])

    async function handleApplyCoupon() {
        if (!couponCode.trim()) return
        setIsValidatingCoupon(true)
        setCouponError('')
        try {
            const res = await couponApi.validate(couponCode.trim())
            setCouponResult(res.data.data)
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse<null>>
            setCouponError(axiosError.response?.data?.message || 'Invalid coupon')
            setCouponResult(null)
        } finally {
            setIsValidatingCoupon(false)
        }
    }

    async function handlePlaceOrder() {
        if (!selectedAddressId) {
            setOrderError('Please select a shipping address')
            return
        }

        setIsPlacingOrder(true)
        setOrderError('')

        try {
            const res = await orderApi.checkout({
                addressId: selectedAddressId,
                couponCode: couponResult ? couponCode.trim() : undefined,
            })
            await refreshCart()
            showToast('Order placed successfully')
            navigate(`/payment/${res.data.data.id}`)
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse<null>>
            setOrderError(axiosError.response?.data?.message || 'Could not place order')
        } finally {
            setIsPlacingOrder(false)
        }
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="max-w-2xl mx-auto px-6 py-16 text-center">
                <p className="font-mono text-sm text-ink/50">Your cart is empty.</p>
            </div>
        )
    }

    const taxAmount = config ? cart.totalPrice * config.taxRate : 0
    const shippingAmount = config?.shippingCharge ?? 0
    const discountAmount = couponResult ? couponResult.discountAmount : 0
    const finalTotal = cart.totalPrice - discountAmount + taxAmount + shippingAmount

    return (
        <div className="max-w-2xl mx-auto px-6 py-10">
              <BackButton label="Back to cart" />

            <h1 className="font-display text-2xl text-ink mb-8">Checkout</h1>

            <section className="mb-8">
                <h2 className="font-mono text-xs uppercase tracking-wider text-ink/50 mb-3">
                    Shipping address
                </h2>
                {addresses.length === 0 ? (
                    <p className="font-body text-sm text-ink/70">
                        No saved addresses. Please add one before checking out.
                    </p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {addresses.map((addr) => (
                            <label
                                key={addr.id}
                                className={`flex items-start gap-3 border p-3 rounded-[4px] cursor-pointer ${selectedAddressId === addr.id ? 'border-forest' : 'border-hairline'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="address"
                                    checked={selectedAddressId === addr.id}
                                    onChange={() => setSelectedAddressId(addr.id)}
                                    className="mt-1"
                                />
                                <div>
                                    <p className="font-body text-sm text-ink font-medium">{addr.fullName}</p>
                                    <p className="font-body text-sm text-ink/70">
                                        {addr.street}, {addr.city}, {addr.state} {addr.postalCode}
                                    </p>
                                </div>
                            </label>
                        ))}
                    </div>
                )}
            </section>

            <section className="mb-8">
                <h2 className="font-mono text-xs uppercase tracking-wider text-ink/50 mb-3">
                    Coupon
                </h2>
                <div className="flex gap-2">
                    <input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        className="flex-1 px-3 py-2.5 border border-hairline rounded-[4px] font-mono text-sm bg-paper"
                    />
                    <Button type="button" variant="secondary" onClick={handleApplyCoupon} disabled={isValidatingCoupon}>
                        {isValidatingCoupon ? 'Checking...' : 'Apply'}
                    </Button>
                </div>
                {couponError && <p className="font-mono text-xs text-brick mt-2">{couponError}</p>}
                {couponResult && (
                    <p className="font-mono text-xs text-forest mt-2">
                        Coupon applied — you save ₹{couponResult.discountAmount.toFixed(2)}
                    </p>
                )}
            </section>
            <section className="border-t border-hairline pt-4 mb-8">
                <div className="flex justify-between font-mono text-sm text-ink/70 mb-1">
                    <span>Subtotal</span>
                    <span>₹{cart.totalPrice.toFixed(2)}</span>
                </div>
                {couponResult && (
                    <div className="flex justify-between font-mono text-sm text-forest mb-1">
                        <span>Discount</span>
                        <span>−₹{discountAmount.toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between font-mono text-sm text-ink/70 mb-1">
                    <span>Tax</span>
                    <span>₹{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-mono text-sm text-ink/70 mb-1">
                    <span>Shipping</span>
                    <span>₹{shippingAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-display text-xl text-ink mt-3 pt-3 border-t border-hairline">
                    <span>Total</span>
                    <span>₹{finalTotal.toFixed(2)}</span>
                </div>
            </section>
            {orderError && (
                <p className="font-mono text-xs text-brick border border-brick/30 bg-brick/5 px-3 py-2 rounded-[4px] mb-4">
                    {orderError}
                </p>
            )}

            <Button
                className="w-full"
                disabled={isPlacingOrder || addresses.length === 0}
                onClick={handlePlaceOrder}
            >
                {isPlacingOrder ? 'Placing order...' : 'Place order'}
            </Button>
        </div>
    )
}