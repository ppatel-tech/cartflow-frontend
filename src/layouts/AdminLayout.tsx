import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/admin', label: 'Dashboard' },
  { path: '/admin/orders', label: 'Orders' },
  { path: '/admin/users', label: 'Users' },
  { path: '/admin/reports', label: 'Reports' },
]

export function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation()

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 border-r border-hairline bg-paper shrink-0 flex flex-col">
        <div className="px-6 py-5 border-b border-hairline">
          <p className="font-mono text-[10px] uppercase tracking-widest text-brass mb-1">Admin</p>
          <Link to="/" className="font-display text-lg text-ink">CartFlow</Link>
        </div>

        <nav className="flex flex-col p-3 gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`font-mono text-xs uppercase tracking-wider px-3 py-2.5 rounded-[4px] transition-colors ${
                  isActive ? 'bg-forest text-paper' : 'text-ink/70 hover:bg-hairline/40'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto p-3 border-t border-hairline">
          <Link to="/" className="font-mono text-xs text-ink/50 hover:text-ink px-3 py-2 block">
            ← Exit admin
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  )
}