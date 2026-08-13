import type { ReactNode } from 'react'
import { Navbar } from '../components/layout/Navbar'

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  )
}