import { useNavigate } from 'react-router-dom'

export function BackButton({ label = 'Back' }: { label?: string }) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-ink/60 hover:text-ink transition-colors mb-6"
    >
      <span>←</span>
      {label}
    </button>
  )
}