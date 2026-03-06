import { useState } from 'react'
import { X } from 'lucide-react'
import { SOURCES, SERVICES, INDUSTRIES, REVENUE_RANGES, TRIGGERS } from '../lib/demo-data'
import { calculateScore } from '../lib/scoring'

const emptyLead = {
  company: '',
  contact_name: '',
  contact_title: '',
  email: '',
  phone: '',
  linkedin_url: '',
  source: 'LinkedIn',
  stage: 'new',
  services: [],
  notes: '',
  trigger: '',
  industry: '',
  revenue_range: '',
  city: '',
}

export function AddLeadModal({ onClose, onSave }) {
  const [form, setForm] = useState(emptyLead)

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const toggleService = (service) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }))
  }

  const previewScore = calculateScore(form)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.company || !form.email) return
    onSave({ ...form, score: previewScore })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-elevated border border-border rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Ny lead</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-tertiary">
              Score: <span className={`font-bold ${previewScore >= 60 ? 'text-success' : previewScore >= 40 ? 'text-warning' : 'text-text-secondary'}`}>{previewScore}</span>
            </span>
            <button
              onClick={onClose}
              className="p-2 text-text-tertiary hover:text-text-primary cursor-pointer bg-transparent border-none"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Foretag *" value={form.company} onChange={(v) => set('company', v)} />
            <Field label="Kontaktperson" value={form.contact_name} onChange={(v) => set('contact_name', v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Titel" value={form.contact_title} onChange={(v) => set('contact_title', v)} placeholder="T.ex. Marknadschef" />
            <Field label="E-post *" value={form.email} onChange={(v) => set('email', v)} type="email" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Telefon" value={form.phone} onChange={(v) => set('phone', v)} />
            <Field label="LinkedIn URL" value={form.linkedin_url} onChange={(v) => set('linkedin_url', v)} />
          </div>

          {/* Scoring-relevant fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-tertiary uppercase tracking-wide mb-1.5">Bransch</label>
              <select
                value={form.industry}
                onChange={(e) => set('industry', e.target.value)}
                className="w-full bg-surface-card border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent"
              >
                <option value="">Valj bransch...</option>
                {INDUSTRIES.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-text-tertiary uppercase tracking-wide mb-1.5">Omsattning</label>
              <select
                value={form.revenue_range}
                onChange={(e) => set('revenue_range', e.target.value)}
                className="w-full bg-surface-card border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent"
              >
                <option value="">Valj omsattning...</option>
                {REVENUE_RANGES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Ort" value={form.city} onChange={(v) => set('city', v)} placeholder="T.ex. Stockholm" />
            <div>
              <label className="block text-xs text-text-tertiary uppercase tracking-wide mb-1.5">Kalla</label>
              <select
                value={form.source}
                onChange={(e) => set('source', e.target.value)}
                className="w-full bg-surface-card border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent"
              >
                {SOURCES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-text-tertiary uppercase tracking-wide mb-1.5">Trigger</label>
            <select
              value={form.trigger}
              onChange={(e) => set('trigger', e.target.value)}
              className="w-full bg-surface-card border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent"
            >
              <option value="">Valj trigger...</option>
              {TRIGGERS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-text-tertiary uppercase tracking-wide mb-2">Tjanster</label>
            <div className="flex gap-2 flex-wrap">
              {SERVICES.map((service) => (
                <button
                  key={service}
                  type="button"
                  onClick={() => toggleService(service)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border cursor-pointer transition-all ${
                    form.services.includes(service)
                      ? 'bg-accent/20 border-accent text-accent'
                      : 'bg-surface-card border-border text-text-secondary hover:border-text-tertiary'
                  }`}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>

          <Field
            label="Anteckningar"
            value={form.notes}
            onChange={(v) => set('notes', v)}
            textarea
          />

          <button
            type="submit"
            className="w-full py-3 bg-accent hover:bg-accent-hover text-white rounded-2xl text-sm font-semibold cursor-pointer border-none"
          >
            Lagg till lead
          </button>
        </form>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder, textarea }) {
  const cls = "w-full bg-surface-card border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
  return (
    <div>
      <label className="block text-xs text-text-tertiary uppercase tracking-wide mb-1.5">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className={`${cls} resize-none`}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
          placeholder={placeholder}
        />
      )}
    </div>
  )
}
