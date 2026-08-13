export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNumber?: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  userId: number
  email: string
  role: string
}

export interface User {
  id: number
  email: string
  role: string
}