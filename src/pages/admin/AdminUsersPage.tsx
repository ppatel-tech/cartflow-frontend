import { useEffect, useState } from 'react'
import { userApi } from '../../api/userApi'
import { useToast } from '../../context/ToastContext'
import type { UserResponse } from '../../types/user.types'

export function AdminUsersPage() {
  const [users, setUsers] = useState<UserResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const { showToast } = useToast()

  function loadUsers() {
    setIsLoading(true)
    userApi.getAllForAdmin(0, 50)
      .then((res) => setUsers(res.data.data.content))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    loadUsers()
  }, [])

  async function handleToggleStatus(user: UserResponse) {
    const newStatus = user.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED'
    setUpdatingId(user.id)
    try {
      await userApi.updateStatus(user.id, newStatus)
      showToast(newStatus === 'BLOCKED' ? 'User blocked' : 'User activated')
      loadUsers()
    } catch {
      showToast('Could not update user', 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  if (isLoading) return <p className="p-8 font-mono text-sm text-ink/50">Loading...</p>

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl text-ink mb-6">Users</h1>

      <div className="flex flex-col divide-y divide-hairline border-t border-b border-hairline">
        {users.map((u) => (
          <div key={u.id} className="py-3 flex items-center justify-between gap-4">
            <div>
              <p className="font-body text-sm text-ink font-medium">
                {u.firstName} {u.lastName}
              </p>
              <p className="font-mono text-xs text-ink/50">{u.email}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink/40">
                {u.role.replace('ROLE_', '')}
              </span>
              <span
                className={`font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-[3px] border ${
                  u.status === 'BLOCKED'
                    ? 'text-brick border-brick'
                    : u.status === 'DELETED'
                    ? 'text-ink/40 border-hairline'
                    : 'text-forest border-forest'
                }`}
              >
                {u.status}
              </span>

              {u.role !== 'ROLE_ADMIN' && u.status !== 'DELETED' && (
                <button
                  onClick={() => handleToggleStatus(u)}
                  disabled={updatingId === u.id}
                  className={`font-mono text-xs hover:underline disabled:opacity-50 ${
                    u.status === 'BLOCKED' ? 'text-forest' : 'text-brick'
                  }`}
                >
                  {u.status === 'BLOCKED' ? 'Activate' : 'Block'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}