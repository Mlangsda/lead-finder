import { useState, useRef, useEffect } from 'react'
import { STAGES } from '../lib/demo-data'

export function StatsBar({ leads }) {
  const total = leads.length

  const stageCounts = STAGES.map((stage) => ({
    ...stage,
    count: leads.filter((l) => l.stage === stage.id).length,
    leads: leads.filter((l) => l.stage === stage.id),
  }))

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <StatCard label="Totalt" value={total} leads={leads} />
      {stageCounts.map((s) => (
        <StatCard key={s.id} label={s.label} value={s.count} leads={s.leads} />
      ))}
    </div>
  )
}

function StatCard({ label, value, leads }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => value > 0 && setOpen(!open)}
        className={`w-full bg-surface-elevated border border-border rounded-2xl px-4 py-3 text-center transition-all ${
          value > 0 ? 'cursor-pointer hover:border-accent/50' : 'cursor-default'
        } ${open ? 'border-accent' : ''}`}
      >
        <p className="text-2xl font-bold text-text-primary">{value}</p>
        <p className="text-[11px] text-text-tertiary uppercase tracking-wider mt-0.5">{label}</p>
      </button>

      {open && leads.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-surface-elevated border border-border rounded-xl shadow-lg max-h-64 overflow-y-auto">
          <div className="p-2">
            <p className="text-[10px] text-text-tertiary uppercase tracking-wide px-2 py-1">{label} ({leads.length})</p>
            {leads.map((lead) => (
              <div key={lead.id} className="px-3 py-2 rounded-lg hover:bg-surface-card transition-colors">
                <p className="text-sm font-medium text-text-primary">{lead.company}</p>
                <p className="text-xs text-text-secondary">{lead.contact_name} · {lead.contact_title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
