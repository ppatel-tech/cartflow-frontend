import { useState, type FormEvent } from 'react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import type { AddressRequest, AddressType } from '../../types/address.types'

interface AddressFormProps {
  initialData?: AddressRequest
  onSubmit: (data: AddressRequest) => Promise<void>
  onCancel: () => void
}

const emptyForm: AddressRequest = {
  fullName: '', phone: '', street: '', city: '', state: '', country: '', postalCode: '',
  addressType: 'HOME',
}

export function AddressForm({ initialData, onSubmit, onCancel }: AddressFormProps) {
  const [form, setForm] = useState<AddressRequest>(initialData ?? emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(field: keyof AddressRequest, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(form)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 border border-hairline p-5 rounded-[4px]">
      <div className="grid grid-cols-2 gap-3">
        <Input id="fullName" label="Full name" value={form.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)} required />
        <Input id="phone" label="Phone" value={form.phone}
          onChange={(e) => handleChange('phone', e.target.value)} required />
      </div>
      <Input id="street" label="Street" value={form.street}
        onChange={(e) => handleChange('street', e.target.value)} required />
      <div className="grid grid-cols-2 gap-3">
        <Input id="city" label="City" value={form.city}
          onChange={(e) => handleChange('city', e.target.value)} required />
        <Input id="state" label="State" value={form.state}
          onChange={(e) => handleChange('state', e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input id="country" label="Country" value={form.country}
          onChange={(e) => handleChange('country', e.target.value)} required />
        <Input id="postalCode" label="Postal code" value={form.postalCode}
          onChange={(e) => handleChange('postalCode', e.target.value)} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-mono text-xs uppercase tracking-wider text-ink/70">Type</label>
        <select
          value={form.addressType}
          onChange={(e) => handleChange('addressType', e.target.value as AddressType)}
          className="px-3 py-2.5 bg-paper border border-hairline rounded-[4px] font-body text-sm text-ink"
        >
          <option value="HOME">Home</option>
          <option value="OFFICE">Office</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <div className="flex gap-3 mt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save address'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}