import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { demoLeads } from '../lib/demo-data'
import { autoDetectCriteria } from '../lib/scoring'

// Högst score överst, därefter företag i bokstavsordning
function sortLeads(list) {
  return [...list].sort((a, b) => {
    const diff = (b.score || 0) - (a.score || 0)
    if (diff !== 0) return diff
    return (a.company || '').localeCompare(b.company || '', 'sv')
  })
}

export function useLeads() {
  // Utan Supabase-konfiguration visas demodata direkt vid första renderingen
  const [leads, setLeads] = useState(() => (supabase ? [] : sortLeads(demoLeads)))
  const [loading, setLoading] = useState(() => Boolean(supabase))

  // Fetch leads on mount
  useEffect(() => {
    if (!supabase) return

    supabase
      .from('leads')
      .select('*')
      .order('score', { ascending: false, nullsFirst: false })
      .order('company', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching leads:', error)
          setLeads(sortLeads(demoLeads))
        } else {
          setLeads(sortLeads(data || []))
        }
        setLoading(false)
      })
  }, [])

  const addLead = useCallback(async (lead) => {
    const row = {
      company: lead.company,
      contact_name: lead.contact_name,
      contact_title: lead.contact_title,
      email: lead.email,
      phone: lead.phone,
      linkedin_url: lead.linkedin_url,
      source: lead.source,
      stage: lead.stage || 'new',
      services: lead.services || [],
      score: lead.score || 0,
      notes: lead.notes,
      trigger_type: lead.trigger || lead.trigger_type,
      industry: lead.industry,
      revenue_range: lead.revenue_range,
      city: lead.city,
      criteria_met: lead.criteria_met || autoDetectCriteria(lead),
    }

    if (!supabase) {
      const local = { ...row, id: crypto.randomUUID(), created_at: new Date().toISOString() }
      setLeads((prev) => sortLeads([local, ...prev]))
      return local
    }

    const { data, error } = await supabase.from('leads').insert(row).select().single()
    if (error) {
      console.error('Error adding lead:', error)
      return null
    }
    setLeads((prev) => sortLeads([data, ...prev]))
    return data
  }, [])

  const updateLead = useCallback(async (id, updates) => {
    setLeads((prev) =>
      sortLeads(prev.map((lead) => (lead.id === id ? { ...lead, ...updates } : lead)))
    )

    if (!supabase) return

    const { error } = await supabase
      .from('leads')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) console.error('Error updating lead:', error)
  }, [])

  const deleteLead = useCallback(async (id) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id))

    if (!supabase) return

    const { error } = await supabase.from('leads').delete().eq('id', id)
    if (error) console.error('Error deleting lead:', error)
  }, [])

  const importLeads = useCallback(async (newLeads) => {
    const rows = newLeads.map((lead) => ({
      company: lead.company || '',
      contact_name: lead.contact_name || '',
      contact_title: lead.contact_title || '',
      email: lead.email || '',
      phone: lead.phone || '',
      linkedin_url: lead.linkedin_url || '',
      source: lead.source || 'LinkedIn',
      stage: lead.stage || 'new',
      services: lead.services || [],
      score: lead.score || 0,
      notes: lead.notes || '',
      trigger_type: lead.trigger_type || '',
      industry: lead.industry || '',
      revenue_range: lead.revenue_range || '',
      city: lead.city || '',
      criteria_met: lead.criteria_met || autoDetectCriteria(lead),
    }))

    if (!supabase) {
      const local = rows.map((r) => ({ ...r, id: crypto.randomUUID(), created_at: new Date().toISOString() }))
      setLeads((prev) => sortLeads([...local, ...prev]))
      return local
    }

    const { data, error } = await supabase.from('leads').insert(rows).select()
    if (error) {
      console.error('Error importing leads:', error)
      return []
    }
    setLeads((prev) => sortLeads([...(data || []), ...prev]))
    return data
  }, [])

  return { leads, loading, addLead, updateLead, deleteLead, importLeads }
}
