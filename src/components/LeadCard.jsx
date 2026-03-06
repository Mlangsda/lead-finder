import { Mail, Phone, Linkedin, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { ScoreBadge } from './ScoreBadge'
import { StagePill } from './StagePill'

export function LeadCard({ lead, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false)

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

      {/* Contact row - always visible */}
      <div className="flex items-center gap-4 mt-4 flex-wrap">
        <a
          href={`mailto:${lead.email}`}
          className="flex items-center gap-2 text-sm text-accent hover:text-accent-hover"
        >
          <Mail size={14} />
          {lead.email}
        </a>
        {lead.phone && (
          <a
            href={`tel:${lead.phone}`}
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary"
          >
            <Phone size={14} />
            {lead.phone}
          </a>
        )}
        {lead.linkedin_url && (
          <a
            href={lead.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent"
          >
            <Linkedin size={14} />
            LinkedIn
          </a>
        )}
        <span className="text-xs text-text-tertiary ml-auto">
          {lead.source} &middot; {new Date(lead.created_at).toLocaleDateString('sv-SE')}
        </span>
      </div>

      {/* Services */}
      <div className="flex gap-2 mt-3 flex-wrap">
        {lead.services?.map((service) => (
          <span
            key={service}
            className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-surface-card text-text-secondary"
          >
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
        {expanded ? 'Dolj detaljer' : 'Visa detaljer'}
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <label className="text-xs text-text-tertiary uppercase tracking-wide">Anteckningar</label>
              <textarea
                value={lead.notes || ''}
                onChange={(e) => onUpdate(lead.id, { notes: e.target.value })}
                rows={2}
                className="mt-1 w-full bg-surface-card border border-border rounded-lg px-3 py-2 text-sm text-text-primary resize-none focus:outline-none focus:border-accent"
                placeholder="Lagg till anteckningar..."
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
