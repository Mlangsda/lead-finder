import { useState, useMemo } from 'react'
import { Plus, Upload, Zap } from 'lucide-react'
import { useLeads } from './hooks/useLeads'
import { StatsBar } from './components/StatsBar'
import { FilterBar } from './components/FilterBar'
import { LeadCard } from './components/LeadCard'
import { AddLeadModal } from './components/AddLeadModal'
import { ImportCSVModal } from './components/ImportCSVModal'

const defaultFilters = {
  search: '',
  stage: '',
  source: '',
  service: '',
  sort: 'company',
}

export default function App() {
  const { leads, loading, addLead, updateLead, deleteLead, importLeads } = useLeads()
  const [filters, setFilters] = useState(defaultFilters)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)

  const filtered = useMemo(() => {
    let result = [...leads]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (l) =>
          l.company.toLowerCase().includes(q) ||
          l.contact_name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q)
      )
    }
    if (filters.stage) {
      result = result.filter((l) => l.stage === filters.stage)
    }
    if (filters.source) {
      result = result.filter((l) => l.source === filters.source)
    }
    if (filters.service) {
      result = result.filter((l) => l.services?.includes(filters.service))
    }

    result.sort((a, b) => {
      if (filters.sort === 'score') return b.score - a.score
      if (filters.sort === 'date') return b.created_at.localeCompare(a.created_at)
      return a.company.localeCompare(b.company, 'sv')
    })

    return result
  }, [leads, filters])

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Lead Finder</h1>
              <p className="text-[11px] text-text-tertiary uppercase tracking-widest">MLC</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-surface-elevated border border-border hover:border-accent text-text-primary rounded-2xl text-sm font-medium cursor-pointer"
            >
              <Upload size={16} />
              Importera CSV
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-2xl text-sm font-medium cursor-pointer border-none"
            >
              <Plus size={16} />
              Ny lead
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <StatsBar leads={leads} />
        <FilterBar filters={filters} setFilters={setFilters} />

        {/* Results count */}
        <p className="text-sm text-text-tertiary">
          {filtered.length} {filtered.length === 1 ? 'lead' : 'leads'}
        </p>

        {/* Lead list */}
        <div className="space-y-3">
          {loading && (
            <div className="text-center py-20">
              <p className="text-text-tertiary text-lg">Laddar leads...</p>
            </div>
          )}
          {!loading && filtered.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onUpdate={updateLead}
              onDelete={deleteLead}
            />
          ))}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-text-tertiary text-lg">Inga leads matchar filtren</p>
              <button
                onClick={() => setFilters(defaultFilters)}
                className="mt-3 text-accent hover:text-accent-hover text-sm cursor-pointer bg-transparent border-none"
              >
                Rensa filter
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {showAddModal && (
        <AddLeadModal
          onClose={() => setShowAddModal(false)}
          onSave={addLead}
        />
      )}
      {showImportModal && (
        <ImportCSVModal
          onClose={() => setShowImportModal(false)}
          onImport={importLeads}
        />
      )}
    </div>
  )
}
