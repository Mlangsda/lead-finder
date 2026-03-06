// MLC Lead Scoring — kriterier och poäng

export const SCORING_CRITERIA = [
  { id: 'marketing_title', label: 'Marknadschef / CMO', points: 15 },
  { id: 'new_in_role', label: 'Ny i rollen (< 1 år)', points: 15 },
  { id: 'new_funding', label: 'Ny finansiering', points: 15 },
  { id: 'growth', label: 'Tillväxtföretag', points: 10 },
  { id: 'healthcare', label: 'Hälsovård', points: 10 },
  { id: 'revenue_fit', label: 'Omsättning 50-100 milj', points: 15 },
  { id: 'stockholm', label: 'Stockholm', points: 10 },
]

export function calculateScoreFromCriteria(criteriaMet) {
  return Math.min(
    SCORING_CRITERIA
      .filter((c) => criteriaMet.includes(c.id))
      .reduce((sum, c) => sum + c.points, 0),
    100
  )
}

// Auto-detect criteria from lead fields (used when creating/importing leads)
export function autoDetectCriteria(lead) {
  const met = []
  const title = (lead.contact_title || '').toLowerCase()
  const titleKeywords = ['marknadschef', 'cmo', 'chief marketing', 'head of marketing', 'marketing manager', 'head of brand', 'brand manager', 'marknadsdirektör', 'kommunikationschef', 'marketing director']
  if (titleKeywords.some((k) => title.includes(k))) met.push('marketing_title')

  const trigger = lead.trigger_type || lead.trigger || ''
  if (trigger === 'Ny i rollen') met.push('new_in_role')
  if (trigger === 'Ny finansiering') met.push('new_funding')
  if (trigger === 'Tillväxt' || trigger === 'Tillvaxt') met.push('growth')

  const industry = lead.industry || ''
  if (industry === 'Hälsovård' || industry === 'Halsovard') met.push('healthcare')

  if ((lead.revenue_range || '') === '50-100 milj') met.push('revenue_fit')
  if ((lead.city || '').toLowerCase().includes('stockholm')) met.push('stockholm')

  return met
}
