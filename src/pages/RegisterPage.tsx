import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api/authApi'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import type { AxiosError } from 'axios'
import type { ApiResponse } from '../types/api.types'

export function RegisterPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', phoneNumber: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await authApi.register(form)
      navigate('/login')
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse<null>>
      setError(axiosError.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-brass mb-2">CartFlow</p>
          <h1 className="font-display text-3xl text-ink">Create account</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input id="firstName" label="First name" value={form.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)} required />
            <Input id="lastName" label="Last name" value={form.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)} required />
          </div>
          <Input id="email" label="Email" type="email" value={form.email}
            onChange={(e) => handleChange('email', e.target.value)} required />
          <Input id="password" label="Password" type="password" value={form.password}
            onChange={(e) => handleChange('password', e.target.value)} required />
          <Input id="phoneNumber" label="Phone (optional)" value={form.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)} />

          {error && (
            <p className="font-mono text-xs text-brick border border-brick/30 bg-brick/5 px-3 py-2 rounded-[4px]">
              {error}
            </p>
          )}

          <Button type="submit" disabled={isSubmitting} className="mt-2">
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <p className="mt-6 font-body text-sm text-ink/60">
          Already have an account?{' '}
          <Link to="/login" className="text-forest font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}