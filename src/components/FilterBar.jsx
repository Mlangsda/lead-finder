import { Search } from 'lucide-react'
import { STAGES, SOURCES, SERVICES } from '../lib/demo-data'

export function FilterBar({ filters, setFilters }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
        <input
          type="text"
          placeholder="Sok foretag, kontakt, e-post..."
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          className="w-full bg-surface-elevated border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
        />
      </div>

      {/* Stage filter */}
      <select
        value={filters.stage}
        onChange={(e) => setFilters((f) => ({ ...f, stage: e.target.value }))}
        className="bg-surface-elevated border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent cursor-pointer"
      >
        <option value="">Alla steg</option>
        {STAGES.map((s) => (
          <option key={s.id} value={s.id}>{s.label}</option>
        ))}
      </select>

      {/* Source filter */}
      <select
        value={filters.source}
        onChange={(e) => setFilters((f) => ({ ...f, source: e.target.value }))}
        className="bg-surface-elevated border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent cursor-pointer"
      >
        <option value="">Alla kallor</option>
        {SOURCES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Service filter */}
      <select
        value={filters.service}
        onChange={(e) => setFilters((f) => ({ ...f, service: e.target.value }))}
        className="bg-surface-elevated border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent cursor-pointer"
      >
        <option value="">Alla tjanster</option>
        {SERVICES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={filters.sort}
        onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
        className="bg-surface-elevated border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent cursor-pointer"
      >
        <option value="score">Hogst score</option>
        <option value="date">Senast tillagd</option>
        <option value="company">Foretag A-O</option>
      </select>
    </div>
  )
}
