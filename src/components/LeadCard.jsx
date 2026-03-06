import { Mail, Phone, Linkedin, ChevronDown, ChevronUp, Trash2, Pencil, X, Check } from 'lucide-react'
import { useState } from 'react'
import { ScoreBadge } from './ScoreBadge'
import { StagePill } from './StagePill'
import { SCORING_CRITERIA, getCriteriaMet, calculateScore } from '../lib/scoring'
import { INDUSTRIES, REVENUE_RANGES, TRIGGERS, SERVICES } from '../lib/demo-data'

export function LeadCard({ lead, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})

  const criteriaMet = getCriteriaMet(lead)

  const startEditing = () => {
    setForm({
      company: lead.company || '',
      contact_name: lead.contact_name || '',
      contact_title: lead.contact_title || '',
      email: lead.email || '',
      phone: lead.phone || '',
      linkedin_url: lead.linkedin_url || '',
      city: lead.city || '',
      industry: lead.industry || '',
      revenue_range: lead.revenue_range || '',
      trigger_type: lead.trigger_type || lead.trigger || '',
      services: lead.services || [],
    })
    setEditing(true)
  }

  const saveEditing = () => {
    const updates = { ...form }
    updates.score = calculateScore({ ...lead, ...updates })
    onUpdate(lead.id, updates)
    setEditing(false)
  }

  const cancelEditing = () => {
    setEditing(false)
  }

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const toggleCriterion = (criterion) => {
    const isCurrentlyMet = criteriaMet.includes(criterion.id)
    let updates = {}

    if (criterion.id === 'marketing_title') return
    if (criterion.id === 'new_in_role') updates.trigger_type = isCurrentlyMet ? '' : 'Ny i rollen'
    if (criterion.id === 'new_funding') updates.trigger_type = isCurrentlyMet ? '' : 'Ny finansiering'
    if (criterion.id === 'growth') updates.trigger_type = isCurrentlyMet ? '' : 'Tillväxt'
    if (criterion.id === 'healthcare') updates.industry = isCurrentlyMet ? '' : 'Hälsovård'
    if (criterion.id === 'revenue_fit') updates.revenue_range = isCurrentlyMet ? '' : '50-100 milj'
    if (criterion.id === 'stockholm') updates.city = isCurrentlyMet ? '' : 'Stockholm'

    const updatedLead = { ...lead, ...updates }
    updates.score = calculateScore(updatedLead)
    onUpdate(lead.id, updates)
  }

  const updatedAt = lead.updated_at && lead.updated_at !== lead.created_at
    ? new Date(lead.updated_at).toLocaleDateString('sv-SE')
    : null

  return (
    <div className="group bg-surface-elevated border border-border rounded-2xl p-6 hover:border-accent/40 transition-all">
      {/* Top row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-lg font-semibold text-text-primary truncate">
              {lead.company}
            </h3>
            {(lead.trigger_type || lead.trigger) && (
              <span className="shrink-0 px-2 py-0.5 rounded-md text-[11px] font-medium bg-accent/15 text-accent">
                {lead.trigger_type || lead.trigger}
              </span>
            )}
          </div>
          <p className="text-sm text-text-secondary">
            {lead.contact_name} &middot; {lead.contact_title}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ScoreBadge score={lead.score} />
          <StagePill
            stage={lead.stage}
            onChange={(stage) => onUpdate(lead.id, { stage })}
          />
        </div>
      </div>

      {/* Contact row */}
      <div className="flex items-center gap-4 mt-4 flex-wrap">
        {lead.email && (
          <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-sm text-accent hover:text-accent-hover">
            <Mail size={14} /> {lead.email}
          </a>
        )}
        {lead.phone && (
          <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary">
            <Phone size={14} /> {lead.phone}
          </a>
        )}
        {lead.linkedin_url && (
          <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent">
            <Linkedin size={14} /> LinkedIn
          </a>
        )}
        <span className="text-xs text-text-tertiary ml-auto">
          {[lead.city, lead.industry, lead.revenue_range].filter(Boolean).join(' \u00b7 ')}
          {(lead.city || lead.industry || lead.revenue_range) && ' \u00b7 '}
          {lead.source} \u00b7 {new Date(lead.created_at).toLocaleDateString('sv-SE')}
          {updatedAt && ` \u00b7 Uppdaterad ${updatedAt}`}
        </span>
      </div>

      {/* Services */}
      <div className="flex gap-2 mt-3 flex-wrap">
        {lead.services?.map((service) => (
          <span key={service} className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-surface-card text-text-secondary">
            {service}
          </span>
        ))}
      </div>

      {/* Expandable section */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 mt-3 text-xs text-text-tertiary hover:text-text-secondary cursor-pointer bg-transparent border-none p-0"
      >
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {expanded ? 'Dölj detaljer' : 'Visa detaljer'}
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-border space-y-4">

          {/* Edit / view mode */}
          {editing ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs text-text-tertiary uppercase tracking-wide">Redigera lead</label>
                <div className="flex gap-2">
                  <button onClick={cancelEditing} className="flex items-center gap-1 px-3 py-1.5 text-xs text-text-secondary bg-surface-card border border-border rounded-lg cursor-pointer hover:text-text-primary">
                    <X size={12} /> Avbryt
                  </button>
                  <button onClick={saveEditing} className="flex items-center gap-1 px-3 py-1.5 text-xs text-white bg-accent rounded-lg cursor-pointer border-none hover:bg-accent-hover">
                    <Check size={12} /> Spara
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <EditField label="Företag" value={form.company} onChange={(v) => set('company', v)} />
                <EditField label="Kontaktperson" value={form.contact_name} onChange={(v) => set('contact_name', v)} />
                <EditField label="Titel" value={form.contact_title} onChange={(v) => set('contact_title', v)} />
                <EditField label="E-post" value={form.email} onChange={(v) => set('email', v)} />
                <EditField label="Telefon" value={form.phone} onChange={(v) => set('phone', v)} />
                <EditField label="LinkedIn URL" value={form.linkedin_url} onChange={(v) => set('linkedin_url', v)} />
                <EditField label="Ort" value={form.city} onChange={(v) => set('city', v)} />
                <div>
                  <label className="block text-xs text-text-tertiary mb-1">Bransch</label>
                  <select value={form.industry} onChange={(e) => set('industry', e.target.value)} className="w-full bg-surface-card border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent">
                    <option value="">Välj...</option>
                    {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-text-tertiary mb-1">Omsättning</label>
                  <select value={form.revenue_range} onChange={(e) => set('revenue_range', e.target.value)} className="w-full bg-surface-card border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent">
                    <option value="">Välj...</option>
                    {REVENUE_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-text-tertiary mb-1">Trigger</label>
                  <select value={form.trigger_type} onChange={(e) => set('trigger_type', e.target.value)} className="w-full bg-surface-card border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent">
                    <option value="">Välj...</option>
                    {TRIGGERS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-text-tertiary mb-1">Tjänster</label>
                <div className="flex gap-2 flex-wrap">
                  {SERVICES.map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => {
                        const current = form.services || []
                        const updated = current.includes(service)
                          ? current.filter((s) => s !== service)
                          : [...current, service]
                        set('services', updated)
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border cursor-pointer transition-all ${
                        (form.services || []).includes(service)
                          ? 'bg-accent text-white border-accent'
                          : 'bg-surface-card border-border text-text-secondary hover:border-text-tertiary'
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={startEditing}
              className="flex items-center gap-2 px-3 py-2 text-xs text-text-secondary bg-surface-card border border-border rounded-lg cursor-pointer hover:border-accent hover:text-accent transition-all"
            >
              <Pencil size={12} /> Redigera lead-info
            </button>
          )}

          {/* Scoring criteria */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <label className="text-xs text-text-tertiary uppercase tracking-wide">
                Scoring-kriterier
              </label>
              <div className="flex items-center gap-1.5">
                <ScoreBadge score={lead.score} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SCORING_CRITERIA.map((criterion) => {
                const isMet = criteriaMet.includes(criterion.id)
                const isReadOnly = criterion.id === 'marketing_title'
                return (
                  <button
                    key={criterion.id}
                    type="button"
                    onClick={() => !isReadOnly && toggleCriterion(criterion)}
                    disabled={isReadOnly}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all border ${
                      isMet
                        ? 'bg-accent text-white border-accent font-medium'
                        : 'bg-surface-card text-text-tertiary border-border'
                    } ${isReadOnly ? 'opacity-50 cursor-default' : 'cursor-pointer hover:border-accent/50'}`}
                  >
                    <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] border ${
                      isMet ? 'bg-white/20 border-white/40 text-white' : 'border-border bg-surface'
                    }`}>
                      {isMet ? '✓' : ''}
                    </span>
                    <span className="flex-1 text-left">{criterion.label}</span>
                    <span className={`text-xs font-semibold ${isMet ? 'text-white/80' : 'text-text-tertiary'}`}>+{criterion.points}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Notes + delete */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <label className="text-xs text-text-tertiary uppercase tracking-wide">Anteckningar</label>
              <textarea
                value={lead.notes || ''}
                onChange={(e) => onUpdate(lead.id, { notes: e.target.value })}
                rows={2}
                className="mt-1 w-full bg-surface-card border border-border rounded-lg px-3 py-2 text-sm text-text-primary resize-none focus:outline-none focus:border-accent"
                placeholder="Lägg till anteckningar..."
              />
            </div>
            <button
              onClick={() => onDelete(lead.id)}
              className="ml-4 p-2 text-text-tertiary hover:text-danger cursor-pointer bg-transparent border-none"
              title="Ta bort lead"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function EditField({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs text-text-tertiary mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface-card border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
      />
    </div>
  )
}
