// MLC Lead Scoring — kriterier och poäng

export const SCORING_CRITERIA = [
  { id: 'right_decision_maker', label: 'Rätt beslutsfattare', points: 20 },
  { id: 'need_identified', label: 'Behov identifierat', points: 20 },
  { id: 'personal_connection', label: 'Personlig koppling', points: 15 },
  { id: 'active_now', label: 'Aktiv just nu', points: 15 },
  { id: 'budget_exists', label: 'Budget finns', points: 15 },
  { id: 'good_timing', label: 'Bra timing', points: 15 },
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
  const titleKeywords = ['marknadschef', 'cmo', 'chief marketing', 'head of marketing', 'marketing manager', 'head of brand', 'brand manager', 'marknadsdirektör', 'kommunikationschef', 'marketing director', 'vd', 'ceo']
  if (titleKeywords.some((k) => title.includes(k))) met.push('right_decision_maker')
  return met
}
