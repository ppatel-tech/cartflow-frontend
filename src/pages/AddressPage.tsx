import { useEffect, useState } from 'react'
import { addressApi } from '../api/addressApi'
import { AddressForm } from '../components/forms/AddressForm'
import { Button } from '../components/ui/Button'
import type { AddressResponse, AddressRequest } from '../types/address.types'
import { useToast } from '../context/ToastContext'

export function AddressPage() {
  const [addresses, setAddresses] = useState<AddressResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
const { showToast } = useToast()

  function loadAddresses() {
    setIsLoading(true)
    addressApi.getAll()
      .then((res) => setAddresses(res.data.data))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    loadAddresses()
  }, [])

async function handleSetDefault(id: number) {
  await addressApi.setDefault(id)
  loadAddresses()
  showToast('Default address updated')
}

async function handleDelete(id: number) {
  await addressApi.remove(id)
  loadAddresses()
  showToast('Address deleted')
}

async function handleCreate(data: AddressRequest) {
  await addressApi.create(data)
  setShowForm(false)
  loadAddresses()
  showToast('Address added')
}

async function handleUpdate(data: AddressRequest) {
  if (editingId === null) return
  await addressApi.update(editingId, data)
  setEditingId(null)
  loadAddresses()
  showToast('Address updated')
}
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl text-ink">Addresses</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>Add address</Button>
        )}
      </div>

      {showForm && (
        <div className="mb-6">
          <AddressForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {isLoading ? (
        <p className="font-mono text-sm text-ink/50">Loading...</p>
      ) : addresses.length === 0 && !showForm ? (
        <p className="font-mono text-sm text-ink/50">No addresses saved yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {addresses.map((addr) =>
            editingId === addr.id ? (
              <AddressForm
                key={addr.id}
                initialData={addr}
                onSubmit={handleUpdate}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div key={addr.id} className="border border-hairline p-4 rounded-[4px]">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-body text-sm text-ink font-medium">{addr.fullName}</p>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-ink/50 border border-hairline px-1.5 py-0.5 rounded-[3px]">
                        {addr.addressType}
                      </span>
                      {addr.isDefault && (
                        <span className="font-mono text-[10px] uppercase tracking-wider text-forest">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="font-body text-sm text-ink/70">
                      {addr.street}, {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                    </p>
                    <p className="font-mono text-xs text-ink/50 mt-1">{addr.phone}</p>
                  </div>
                </div>

                <div className="flex gap-4 mt-3 font-mono text-xs">
                  {!addr.isDefault && (
                    <button onClick={() => handleSetDefault(addr.id)} className="text-forest hover:underline">
                      Set as default
                    </button>
                  )}
                  <button onClick={() => setEditingId(addr.id)} className="text-ink/70 hover:text-ink">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(addr.id)} className="text-brick hover:underline">
                    Delete
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}