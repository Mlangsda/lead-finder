import { Mail, Phone, Linkedin, MapPin, Building2, TrendingUp, Banknote, ChevronDown, ChevronUp, Trash2, Pencil, X, Check, FileText } from 'lucide-react'
import { useState } from 'react'
import { ScoreBadge } from './ScoreBadge'
import { StagePill } from './StagePill'
import { SCORING_CRITERIA, calculateScoreFromCriteria } from '../lib/scoring'
import { INDUSTRIES, REVENUE_RANGES, TRIGGERS, SERVICES } from '../lib/demo-data'

export function LeadCard({ lead, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editingResearch, setEditingResearch] = useState(false)
  const [researchDraft, setResearchDraft] = useState('')
  const [researchExpanded, setResearchExpanded] = useState(false)
  const [form, setForm] = useState({})

  const criteriaMet = lead.criteria_met || []

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
    onUpdate(lead.id, updates)
    setEditing(false)
  }

  const cancelEditing = () => {
    setEditing(false)
  }

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const toggleCriterion = (criterion) => {
    const isCurrentlyMet = criteriaMet.includes(criterion.id)
    const newCriteria = isCurrentlyMet
      ? criteriaMet.filter((id) => id !== criterion.id)
      : [...criteriaMet, criterion.id]
    const newScore = calculateScoreFromCriteria(newCriteria)
    onUpdate(lead.id, { criteria_met: newCriteria, score: newScore })
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

      {/* Info grid — always visible */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-sm">
        {lead.email && (
          <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 text-accent hover:text-accent-hover">
            <Mail size={13} /> {lead.email}
          </a>
        )}
        {lead.phone && (
          <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary">
            <Phone size={13} /> {lead.phone}
          </a>
        )}
        {lead.linkedin_url && (
          <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-text-secondary hover:text-accent">
            <Linkedin size={13} /> LinkedIn
          </a>
        )}
        {lead.city && (
          <span className="flex items-center gap-1.5 text-text-secondary">
            <MapPin size={13} /> {lead.city}
          </span>
        )}
        {lead.industry && (
          <span className="flex items-center gap-1.5 text-text-secondary">
            <Building2 size={13} /> {lead.industry}
          </span>
        )}
        {lead.revenue_range && (
          <span className="flex items-center gap-1.5 text-text-secondary">
            <Banknote size={13} /> {lead.revenue_range}
          </span>
        )}
        {(lead.trigger_type || lead.trigger) && (
          <span className="flex items-center gap-1.5 text-text-secondary">
            <TrendingUp size={13} /> {lead.trigger_type || lead.trigger}
          </span>
        )}
      </div>

      {/* Tags row: services + scoring criteria + meta */}
      <div className="flex flex-wrap items-center gap-2 mt-3">
        {lead.services?.map((service) => (
          <span key={service} className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-surface-card text-text-secondary">
            {service}
          </span>
        ))}
        {criteriaMet.length > 0 && lead.services?.length > 0 && (
          <span className="text-border">|</span>
        )}
        {SCORING_CRITERIA.filter((c) => criteriaMet.includes(c.id)).map((c) => (
          <span key={c.id} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-accent/15 text-accent">
            {c.label}
          </span>
        ))}
        <span className="text-[11px] text-text-tertiary ml-auto">
          {lead.source} · {new Date(lead.created_at).toLocaleDateString('sv-SE')}
          {updatedAt && ` · Uppdaterad ${updatedAt}`}
        </span>
      </div>

      {/* Notes preview */}
      {lead.notes && (
        <p className="mt-2 text-xs text-text-tertiary italic whitespace-pre-line line-clamp-4">
          {lead.notes}
        </p>
      )}

      {/* Research summary — visible on collapsed card */}
      {lead.research && !expanded && (() => {
        const lines = lead.research.split('\n')
          .map(l => l.trim())
          .filter(l => l && !l.startsWith('═') && !l.startsWith('---') && !l.startsWith('***') && l !== '|')
        const meaningful = lines.filter(l =>
          !l.match(/^[\s═─\-\*\|]+$/) &&
          l.length > 10
        ).slice(0, 6)
        return (
          <div className="mt-3 bg-accent/5 border border-accent/15 rounded-lg px-4 py-3">
            <button
              onClick={() => { setExpanded(true); setResearchExpanded(true) }}
              className="flex items-center gap-2 mb-1.5 cursor-pointer bg-transparent border-none p-0 hover:opacity-80"
            >
              <FileText size={13} className="text-accent" />
              <span className="text-xs font-semibold text-accent uppercase tracking-wide">Research</span>
              <ChevronDown size={12} className="text-accent" />
            </button>
            <p className="text-xs text-text-secondary leading-relaxed line-clamp-5 whitespace-pre-line">
              {meaningful.join('\n')}
            </p>
          </div>
        )
      })()}

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
                return (
                  <button
                    key={criterion.id}
                    type="button"
                    onClick={() => toggleCriterion(criterion)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all border cursor-pointer ${
                      isMet
                        ? 'bg-accent text-white border-accent font-medium'
                        : 'bg-surface-card text-text-tertiary border-border hover:border-accent/50'
                    }`}
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

          {/* Research section */}
          {(lead.research || editingResearch) && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => setResearchExpanded(!researchExpanded)}
                  className="flex items-center gap-2 text-xs text-text-tertiary uppercase tracking-wide cursor-pointer bg-transparent border-none p-0 hover:text-text-secondary"
                >
                  <FileText size={13} />
                  Research
                  {researchExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                <button
                  onClick={() => {
                    if (editingResearch) {
                      onUpdate(lead.id, { research: researchDraft })
                      setEditingResearch(false)
                    } else {
                      setResearchDraft(lead.research || '')
                      setEditingResearch(true)
                      setResearchExpanded(true)
                    }
                  }}
                  className="flex items-center gap-1 px-2 py-1 text-[11px] text-text-tertiary bg-surface-card border border-border rounded-md cursor-pointer hover:text-accent hover:border-accent transition-all"
                >
                  {editingResearch ? <><Check size={10} /> Spara</> : <><Pencil size={10} /> Redigera</>}
                </button>
              </div>
              {researchExpanded && (
                editingResearch ? (
                  <textarea
                    value={researchDraft}
                    onChange={(e) => setResearchDraft(e.target.value)}
                    rows={12}
                    className="w-full bg-surface-card border border-accent/40 rounded-lg px-3 py-2 text-sm text-text-primary resize-y focus:outline-none focus:border-accent font-mono"
                    placeholder="Lägg till research..."
                  />
                ) : (
                  <div className="bg-surface-card border border-border rounded-lg px-4 py-3 text-sm text-text-primary max-h-80 overflow-y-auto leading-relaxed whitespace-pre-wrap">
                    {lead.research}
                  </div>
                )
              )}
            </div>
          )}

          {/* Add research button (when no research exists) */}
          {!lead.research && !editingResearch && (
            <button
              onClick={() => {
                setResearchDraft('')
                setEditingResearch(true)
                setResearchExpanded(true)
              }}
              className="flex items-center gap-2 px-3 py-2 text-xs text-text-tertiary bg-surface-card border border-dashed border-border rounded-lg cursor-pointer hover:border-accent hover:text-accent transition-all"
            >
              <FileText size={12} /> Lägg till research
            </button>
          )}

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
