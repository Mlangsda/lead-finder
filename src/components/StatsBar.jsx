import { STAGES } from '../lib/demo-data'

export function StatsBar({ leads }) {
  const total = leads.length

  const stageCounts = STAGES.map((stage) => ({
    ...stage,
    count: leads.filter((l) => l.stage === stage.id).length,
  }))

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <StatCard label="Totalt" value={total} />
      {stageCounts.map((s) => (
        <StatCard key={s.id} label={s.label} value={s.count} />
      ))}
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="bg-surface-elevated border border-border rounded-2xl px-4 py-3 text-center">
      <p className="text-2xl font-bold text-text-primary">{value}</p>
      <p className="text-[11px] text-text-tertiary uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  )
}
