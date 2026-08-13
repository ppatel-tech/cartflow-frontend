import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="border-b border-hairline bg-paper sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-xl text-ink tracking-tight">
          CartFlow
        </Link>

        <nav className="flex items-center gap-6 font-mono text-xs uppercase tracking-wider">
          <Link to="/products" className="text-ink/70 hover:text-ink transition-colors">
            Products
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/cart" className="text-ink/70 hover:text-ink transition-colors">
                Cart
              </Link>
              <Link to="/wishlist" className="text-ink/70 hover:text-ink transition-colors">
                Wishlist
              </Link>
              <Link to="/orders" className="text-ink/70 hover:text-ink transition-colors">
                Orders
              </Link>
              <Link to="/profile" className="text-ink/70 hover:text-ink transition-colors">
                Profile
              </Link>
              <Link to="/addresses" className="text-ink/70 hover:text-ink transition-colors">
                Addresses
              </Link>
              <button onClick={handleLogout} className="text-brick hover:underline">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-ink/70 hover:text-ink transition-colors">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}