export interface UserResponse {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string | null
  role: string
  status: string
  createdAt: string
}

export interface UpdateProfileRequest {
  firstName: string
  lastName: string
  phoneNumber?: string
}