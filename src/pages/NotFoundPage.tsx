import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-brass mb-3">404</p>
      <h1 className="font-display text-3xl text-ink mb-3">This page doesn't exist</h1>
      <p className="font-body text-sm text-ink/60 mb-8">
        The page you're looking for may have been moved or removed.
      </p>
      <Link to="/">
        <Button>Back to home</Button>
      </Link>
    </div>
  )
}