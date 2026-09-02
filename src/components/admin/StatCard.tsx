export function StatCard({ label, value, accent = false }: {
  label: string
  value: string | number
  accent?: boolean
}) {
  return (
    <div className="border border-hairline p-5 rounded-[4px]">
      <p className="font-mono text-[10px] uppercase tracking-widest text-ink/50 mb-2">{label}</p>
      <p className={`font-display text-2xl ${accent ? 'text-brass' : 'text-ink'}`}>{value}</p>
    </div>
  )
}