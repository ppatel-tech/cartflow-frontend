const colors: Record<string, string> = {
  CREATED: 'text-ink/60 border-hairline',
  CONFIRMED: 'text-forest border-forest',
  PACKING: 'text-forest border-forest',
  SHIPPED: 'text-forest border-forest',
  OUT_FOR_DELIVERY: 'text-forest border-forest',
  DELIVERED: 'text-forest border-forest bg-forest/5',
  CANCELLED: 'text-brick border-brick',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-[3px] border ${colors[status] ?? ''}`}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}