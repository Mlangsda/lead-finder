// MLC Lead Scoring — kriterier och poang

export const SCORING_CRITERIA = [
  {
    id: 'marketing_title',
    label: 'Marknadschef / CMO',
    points: 15,
    check: (lead) => {
      const title = (lead.contact_title || '').toLowerCase()
      const keywords = ['marknadschef', 'cmo', 'chief marketing', 'head of marketing', 'marketing manager', 'head of brand', 'brand manager', 'marknadsdirektor', 'kommunikationschef', 'marketing director']
      return keywords.some((k) => title.includes(k))
    },
  },
  {
    id: 'new_in_role',
    label: 'Ny i rollen (< 1 ar)',
    points: 15,
    check: (lead) => (lead.trigger_type || lead.trigger || '') === 'Ny i rollen',
  },
  {
    id: 'new_funding',
    label: 'Ny finansiering',
    points: 15,
    check: (lead) => (lead.trigger_type || lead.trigger || '') === 'Ny finansiering',
  },
  {
    id: 'growth',
    label: 'Tillvaxtforetag',
    points: 10,
    check: (lead) => (lead.trigger_type || lead.trigger || '') === 'Tillvaxt',
  },
  {
    id: 'healthcare',
    label: 'Halsovard',
    points: 10,
    check: (lead) => (lead.industry || '') === 'Halsovard',
  },
  {
    id: 'revenue_fit',
    label: 'Omsattning 50-100 milj',
    points: 15,
    check: (lead) => (lead.revenue_range || '') === '50-100 milj',
  },
  {
    id: 'stockholm',
    label: 'Stockholm',
    points: 10,
    check: (lead) => (lead.city || '').toLowerCase().includes('stockholm'),
  },
]

export function getCriteriaMet(lead) {
  return SCORING_CRITERIA.filter((c) => c.check(lead)).map((c) => c.id)
}

export function calculateScore(lead) {
  const met = getCriteriaMet(lead)
  return Math.min(
    SCORING_CRITERIA.filter((c) => met.includes(c.id)).reduce((sum, c) => sum + c.points, 0),
    100
  )
}
