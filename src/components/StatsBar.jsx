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
    <div className="flex rounded-[14px]" style={{ gap: '1px', background: 'var(--color-border)' }}>
      <StatCard label="Totalt" value={total} leads={leads} isFirst />
      {stageCounts.map((s, i) => (
        <StatCard key={s.id} label={s.label} value={s.count} leads={s.leads} isLast={i === stageCounts.length - 1} />
      ))}
    </div>
  )
}

function StatCard({ label, value, leads, isFirst, isLast }) {
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
        className={`w-full bg-surface-elevated px-4 py-[18px] text-center transition-all border-none ${
          value > 0 ? 'cursor-pointer hover:bg-surface-card' : 'cursor-default'
        }`}
        style={{
          borderRadius: isFirst ? '14px 0 0 14px' : isLast ? '0 14px 14px 0' : '0',
        }}
      >
        <p className="text-2xl font-bold text-text-primary">{value}</p>
        <p className="text-[11px] text-text-tertiary uppercase tracking-wider mt-0.5">{label}</p>
      </button>

      {open && leads.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-surface-elevated border border-border rounded-xl shadow-lg max-h-64 overflow-y-auto">
          <div className="p-2">
            <p className="text-[10px] text-text-tertiary uppercase tracking-wide px-2 py-1">{label} ({leads.length})</p>
            {[...leads].sort((a, b) => a.company.localeCompare(b.company, 'sv')).map((lead) => (
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
