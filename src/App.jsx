import { useState, useMemo } from 'react'
import { Plus, Upload, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLeads } from './hooks/useLeads'
import { StatsBar } from './components/StatsBar'
import { FilterBar } from './components/FilterBar'
import { LeadCard } from './components/LeadCard'
import { AddLeadModal } from './components/AddLeadModal'
import { ImportCSVModal } from './components/ImportCSVModal'

const LEADS_PER_PAGE = 5

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
  const [currentPage, setCurrentPage] = useState(1)

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

  // Reset to page 1 when filters change
  const totalPages = Math.max(1, Math.ceil(filtered.length / LEADS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const paginatedLeads = filtered.slice((safePage - 1) * LEADS_PER_PAGE, safePage * LEADS_PER_PAGE)

  const handleFilterChange = (updater) => {
    setFilters(updater)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/mlc-logo.png" alt="MLC" className="w-14 h-14 object-contain" />
            <h1 className="text-2xl font-bold tracking-tight">Lead Finder</h1>
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
        <FilterBar filters={filters} setFilters={handleFilterChange} />

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
          {!loading && paginatedLeads.map((lead) => (
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
                onClick={() => { setFilters(defaultFilters); setCurrentPage(1) }}
                className="mt-3 text-accent hover:text-accent-hover text-sm cursor-pointer bg-transparent border-none"
              >
                Rensa filter
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
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

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = []
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <div className="flex items-center justify-center gap-1 pt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 text-sm text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-default cursor-pointer bg-transparent border-none"
      >
        <ChevronLeft size={16} />
        Previous
      </button>
      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`dots-${i}`} className="px-2 py-2 text-sm text-text-tertiary">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 rounded-lg text-sm font-medium cursor-pointer border-none ${
              page === currentPage
                ? 'bg-accent text-white'
                : 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
            }`}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 text-sm text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-default cursor-pointer bg-transparent border-none"
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
