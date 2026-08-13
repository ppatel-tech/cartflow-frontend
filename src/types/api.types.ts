export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  errorCode?: string
  errors?: FieldError[]
  timestamp: string
}

export interface FieldError {
  field: string
  message: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}

