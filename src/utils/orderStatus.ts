import type { OrderStatus } from '../types/order.types'

const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  CREATED: [],
  CONFIRMED: ['PACKING'],
  PACKING: ['SHIPPED'],
  SHIPPED: ['OUT_FOR_DELIVERY'],
  OUT_FOR_DELIVERY: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
}

export function getNextStatuses(current: OrderStatus): OrderStatus[] {
  return TRANSITIONS[current] ?? []
}