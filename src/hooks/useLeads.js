import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { demoLeads } from '../lib/demo-data'

export function useLeads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch leads on mount
  useEffect(() => {
    if (!supabase) {
      setLeads(demoLeads)
      setLoading(false)
      return
    }

    supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching leads:', error)
          setLeads(demoLeads)
        } else {
          setLeads(data || [])
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
    }

    if (!supabase) {
      const local = { ...row, id: crypto.randomUUID(), created_at: new Date().toISOString() }
      setLeads((prev) => [local, ...prev])
      return local
    }

    const { data, error } = await supabase.from('leads').insert(row).select().single()
    if (error) {
      console.error('Error adding lead:', error)
      return null
    }
    setLeads((prev) => [data, ...prev])
    return data
  }, [])

  const updateLead = useCallback(async (id, updates) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, ...updates } : lead))
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

  return { leads, loading, addLead, updateLead, deleteLead }
}
