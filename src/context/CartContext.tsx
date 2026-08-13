import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { cartApi } from '../api/cartApi'
import type { CartResponse } from '../types/cart.types'
import { useAuth } from './AuthContext'
import { useEffect } from 'react'

interface CartContextType {
  cart: CartResponse | null
  refreshCart: () => Promise<void>
  addItem: (productId: number, quantity: number) => Promise<void>
  updateQuantity: (itemId: number, quantity: number) => Promise<void>
  removeItem: (itemId: number) => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [cart, setCart] = useState<CartResponse | null>(null)

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null)
      return
    }
    const res = await cartApi.getCart()
    setCart(res.data.data)
  }, [isAuthenticated])

  async function addItem(productId: number, quantity: number) {
    const res = await cartApi.addItem(productId, quantity)
    setCart(res.data.data)
  }

  async function updateQuantity(itemId: number, quantity: number) {
    const res = await cartApi.updateQuantity(itemId, quantity)
    setCart(res.data.data)
  }

  async function removeItem(itemId: number) {
    const res = await cartApi.removeItem(itemId)
    setCart(res.data.data)
  }

  useEffect(() => {
  refreshCart()
}, [refreshCart])

  return (
    <CartContext.Provider value={{ cart, refreshCart, addItem, updateQuantity, removeItem }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}