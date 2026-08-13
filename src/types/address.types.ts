export type AddressType = 'HOME' | 'OFFICE' | 'OTHER'

export interface AddressResponse {
  id: number
  fullName: string
  phone: string
  street: string
  city: string
  state: string
  country: string
  postalCode: string
  addressType: AddressType
  isDefault: boolean
}

export interface AddressRequest {
  fullName: string
  phone: string
  street: string
  city: string
  state: string
  country: string
  postalCode: string
  addressType: AddressType
}