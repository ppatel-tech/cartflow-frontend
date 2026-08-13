import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function Input({ label, error, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-mono text-xs uppercase tracking-wider text-ink/70">
        {label}
      </label>
      <input
        id={id}
        className={`px-3 py-2.5 bg-paper border font-body text-sm text-ink outline-none rounded-[4px] focus:border-forest transition-colors ${
          error ? 'border-brick' : 'border-hairline'
        }`}
        {...props}
      />
      {error && <span className="font-mono text-xs text-brick">{error}</span>}
    </div>
  )
}