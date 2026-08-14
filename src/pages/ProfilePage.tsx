import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { userApi } from '../api/userApi'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import type { UserResponse } from '../types/user.types'

export function ProfilePage() {
  const { logout } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [user, setUser] = useState<UserResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [form, setForm] = useState({ firstName: '', lastName: '', phoneNumber: '' })

  useEffect(() => {
    userApi.getMe().then((res) => {
      setUser(res.data.data)
      setForm({
        firstName: res.data.data.firstName,
        lastName: res.data.data.lastName,
        phoneNumber: res.data.data.phoneNumber ?? '',
      })
    }).finally(() => setIsLoading(false))
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    try {
      const res = await userApi.updateMe(form)
      setUser(res.data.data)
      showToast('Profile updated')
    } catch {
      showToast('Could not update profile', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteAccount() {
    try {
      await userApi.deleteMe()
      logout()
      navigate('/login')
      showToast('Account deleted')
    } catch {
      showToast('Could not delete account', 'error')
    }
  }

  if (isLoading) return <p className="p-8 font-mono text-sm text-ink/50">Loading...</p>
  if (!user) return <p className="p-8 font-mono text-sm text-ink/50">Could not load profile.</p>

  return (
    <div className="max-w-md mx-auto px-6 py-10">
      <h1 className="font-display text-2xl text-ink mb-1">Profile</h1>
      <p className="font-mono text-xs text-ink/40 mb-8">
        Member since {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
      </p>

      <div className="mb-6">
        <label className="font-mono text-xs uppercase tracking-wider text-ink/70">Email</label>
        <p className="font-body text-sm text-ink/80 mt-1">{user.email}</p>
        <p className="font-mono text-[10px] text-ink/40 mt-0.5">Email cannot be changed</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            id="firstName" label="First name" value={form.firstName}
            onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
            required
          />
          <Input
            id="lastName" label="Last name" value={form.lastName}
            onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
            required
          />
        </div>
        <Input
          id="phoneNumber" label="Phone" value={form.phoneNumber}
          onChange={(e) => setForm((p) => ({ ...p, phoneNumber: e.target.value }))}
        />

        <Button type="submit" disabled={isSaving} className="mt-2">
          {isSaving ? 'Saving...' : 'Save changes'}
        </Button>
      </form>

      <div className="mt-10 pt-6 border-t border-hairline">
        <h2 className="font-mono text-xs uppercase tracking-wider text-brick mb-3">Danger zone</h2>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="font-mono text-xs text-brick hover:underline"
          >
            Delete account
          </button>
        ) : (
          <div className="border border-brick/30 bg-brick/5 p-4 rounded-[4px]">
            <p className="font-body text-sm text-ink mb-3">
              This will deactivate your account. Are you sure?
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="!border-brick !text-brick hover:!bg-brick/10"
                onClick={handleDeleteAccount}
              >
                Yes, delete my account
              </Button>
              <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}