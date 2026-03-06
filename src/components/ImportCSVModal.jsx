import { useState, useCallback } from 'react'
import { X, Upload, FileText, AlertCircle } from 'lucide-react'
import { calculateScore } from '../lib/scoring'

// Mappning fran Sales Navigator CSV-kolumner till vara falt
const COLUMN_MAP = {
  'first name': 'first_name',
  'last name': 'last_name',
  'company': 'company',
  'company name': 'company',
  'title': 'contact_title',
  'job title': 'contact_title',
  'email': 'email',
  'email address': 'email',
  'phone': 'phone',
  'phone number': 'phone',
  'linkedin url': 'linkedin_url',
  'profile url': 'linkedin_url',
  'person linkedin url': 'linkedin_url',
  'geography': 'city',
  'location': 'city',
  'city': 'city',
  'industry': 'industry',
  'company headcount': 'headcount',
  'number of employees': 'headcount',
}

function parseCSV(text) {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []

  // Hantera bade komma och semikolon som separator
  const separator = lines[0].includes(';') ? ';' : ','

  const headers = parseLine(lines[0], separator).map((h) => h.trim().toLowerCase())

  return lines.slice(1).map((line) => {
    const values = parseLine(line, separator)
    const row = {}
    headers.forEach((header, i) => {
      row[header] = (values[i] || '').trim()
    })
    return row
  })
}

function parseLine(line, separator) {
  const result = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === separator && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)
  return result
}

function mapRow(row) {
  const mapped = {}
  for (const [csvCol, ourField] of Object.entries(COLUMN_MAP)) {
    if (row[csvCol] !== undefined && row[csvCol] !== '') {
      mapped[ourField] = row[csvCol]
    }
  }

  // Kombinera first_name + last_name
  const parts = [mapped.first_name, mapped.last_name].filter(Boolean)
  if (parts.length > 0) {
    mapped.contact_name = parts.join(' ')
  }
  delete mapped.first_name
  delete mapped.last_name

  // Gissa omsattning fran headcount
  if (mapped.headcount) {
    const count = parseInt(mapped.headcount)
    if (count < 20) mapped.revenue_range = 'Under 10 milj'
    else if (count < 100) mapped.revenue_range = '10-50 milj'
    else if (count < 300) mapped.revenue_range = '50-100 milj'
    else if (count < 1000) mapped.revenue_range = '100-500 milj'
    else mapped.revenue_range = 'Over 500 milj'
    delete mapped.headcount
  }

  // Mappa bransch till vara varden
  if (mapped.industry) {
    mapped.industry = mapIndustry(mapped.industry)
  }

  return mapped
}

function mapIndustry(raw) {
  const lower = raw.toLowerCase()
  if (lower.includes('health') || lower.includes('pharma') || lower.includes('medical') || lower.includes('halso')) return 'Halsovard'
  if (lower.includes('tech') || lower.includes('software') || lower.includes('it ') || lower.includes('saas')) return 'Tech'
  if (lower.includes('real estate') || lower.includes('fastighet') || lower.includes('property')) return 'Fastigheter'
  if (lower.includes('financ') || lower.includes('bank') || lower.includes('finans') || lower.includes('insurance')) return 'Finans'
  if (lower.includes('consult') || lower.includes('konsult') || lower.includes('advisory')) return 'Konsult'
  if (lower.includes('media') || lower.includes('publish') || lower.includes('broadcast')) return 'Media'
  if (lower.includes('retail') || lower.includes('e-commerce') || lower.includes('handel')) return 'Retail'
  if (lower.includes('manufactur') || lower.includes('industrial') || lower.includes('industri')) return 'Industri'
  return 'Annat'
}

export function ImportCSVModal({ onClose, onImport }) {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')

  const handleFile = useCallback((e) => {
    const file = e.target.files[0]
    if (!file) return

    setFileName(file.name)
    setError('')

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = parseCSV(event.target.result)
        if (parsed.length === 0) {
          setError('Filen verkar vara tom eller har fel format.')
          return
        }
        const mapped = parsed.map(mapRow).filter((r) => r.company)
        if (mapped.length === 0) {
          setError('Hittade inga rader med foretagsnamn. Kolla att CSV-filen har en "Company"-kolumn.')
          return
        }
        // Berakna score for varje lead
        const withScores = mapped.map((lead) => ({
          ...lead,
          source: 'LinkedIn',
          stage: 'new',
          services: [],
          score: calculateScore(lead),
        }))
        setRows(withScores)
      } catch (err) {
        setError('Kunde inte lasa filen. Kontrollera att det ar en CSV-fil.')
      }
    }
    reader.readAsText(file)
  }, [])

  const handleImport = () => {
    onImport(rows)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-elevated border border-border rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Importera leads fran CSV</h2>
          <button
            onClick={onClose}
            className="p-2 text-text-tertiary hover:text-text-primary cursor-pointer bg-transparent border-none"
          >
            <X size={20} />
          </button>
        </div>

        {rows.length === 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              Exportera leads fran LinkedIn Sales Navigator som CSV och ladda upp filen har.
            </p>

            <label className="flex flex-col items-center justify-center gap-3 p-10 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-accent transition-colors">
              <Upload size={32} className="text-text-tertiary" />
              <span className="text-sm text-text-secondary">
                {fileName || 'Klicka for att valja CSV-fil'}
              </span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFile}
                className="hidden"
              />
            </label>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-danger/10 border border-danger/20 rounded-xl">
                <AlertCircle size={16} className="text-danger shrink-0" />
                <p className="text-sm text-danger">{error}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <FileText size={16} />
              <span>{fileName} — {rows.length} leads hittade</span>
            </div>

            <div className="border border-border rounded-xl overflow-hidden">
              <div className="max-h-60 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface-card text-text-tertiary text-xs uppercase tracking-wide">
                      <th className="px-3 py-2 text-left">Foretag</th>
                      <th className="px-3 py-2 text-left">Kontakt</th>
                      <th className="px-3 py-2 text-left">Titel</th>
                      <th className="px-3 py-2 text-left">Ort</th>
                      <th className="px-3 py-2 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="px-3 py-2 text-text-primary">{row.company}</td>
                        <td className="px-3 py-2 text-text-secondary">{row.contact_name || '-'}</td>
                        <td className="px-3 py-2 text-text-secondary">{row.contact_title || '-'}</td>
                        <td className="px-3 py-2 text-text-secondary">{row.city || '-'}</td>
                        <td className="px-3 py-2 text-right font-medium">
                          <span className={row.score >= 60 ? 'text-success' : row.score >= 40 ? 'text-warning' : 'text-text-secondary'}>
                            {row.score}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setRows([]); setFileName(''); setError('') }}
                className="flex-1 py-3 bg-surface-card border border-border text-text-primary rounded-2xl text-sm font-medium cursor-pointer hover:bg-surface-card/80"
              >
                Valj annan fil
              </button>
              <button
                onClick={handleImport}
                className="flex-1 py-3 bg-accent hover:bg-accent-hover text-white rounded-2xl text-sm font-semibold cursor-pointer border-none"
              >
                Importera {rows.length} leads
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
