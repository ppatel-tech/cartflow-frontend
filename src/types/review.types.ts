export interface ReviewResponse {
  id: number
  productId: number
  userId: number
  reviewerName: string
  rating: number
  review: string | null
  createdAt: string
}

export interface ReviewRequest {
  rating: number
  review?: string
}