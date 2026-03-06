// Auto-scoring baserat pa MLC:s kriterier
// Max score: 100

export function calculateScore(lead) {
  let score = 0

  // Kontakttitel: marknadschef/CMO/liknande = +15
  const title = (lead.contact_title || '').toLowerCase()
  const marketingTitles = ['marknadschef', 'cmo', 'head of marketing', 'marketing manager', 'head of brand', 'brand manager', 'marknadsdirektor', 'kommunikationschef']
  if (marketingTitles.some((t) => title.includes(t))) {
    score += 15
  }

  // Trigger: Ny i rollen = +15, Ny finansiering = +15, Tillvaxt = +10, andra = +5
  const trigger = lead.trigger_type || lead.trigger || ''
  if (trigger === 'Ny i rollen') score += 15
  else if (trigger === 'Ny finansiering') score += 15
  else if (trigger === 'Tillvaxt') score += 10
  else if (trigger === 'Varumarkeslansering') score += 10
  else if (trigger === 'Omorganisation') score += 10
  else if (trigger) score += 5

  // Bransch: Halsovard = +10, andra = +5
  const industry = lead.industry || ''
  if (industry === 'Halsovard') score += 10
  else if (industry && industry !== 'Annat') score += 5

  // Omsattning: 50-100 milj = +15, 100-500 milj = +10, 10-50 milj = +8
  const revenue = lead.revenue_range || ''
  if (revenue === '50-100 milj') score += 15
  else if (revenue === '100-500 milj') score += 10
  else if (revenue === '10-50 milj') score += 8
  else if (revenue === 'Over 500 milj') score += 5
  else if (revenue === 'Under 10 milj') score += 3

  // Ort: Stockholm = +10, annan svensk ort = +5
  const city = (lead.city || '').toLowerCase()
  if (city.includes('stockholm')) score += 10
  else if (city) score += 5

  // Tjanster: fler tjanster = hogre potential, +5 per tjanst (max +15)
  const serviceCount = (lead.services || []).length
  score += Math.min(serviceCount * 5, 15)

  // Har LinkedIn-profil = +5 (lattare att researcha)
  if (lead.linkedin_url) score += 5

  // Har anteckningar = +5 (mer kontext = battre forberedelse)
  if (lead.notes && lead.notes.length > 10) score += 5

  return Math.min(score, 100)
}
