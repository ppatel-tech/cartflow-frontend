import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary'
}

export function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  const base = 'px-5 py-2.5 font-body font-medium text-sm tracking-wide transition-colors rounded-[4px] disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-forest text-paper hover:bg-[#253d2d]',
    secondary: 'border border-hairline text-ink hover:border-ink bg-transparent',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}