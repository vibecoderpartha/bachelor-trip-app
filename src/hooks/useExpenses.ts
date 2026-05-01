import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import type { Expense } from '../lib/splitting'

export function useExpenses(): {
  expenses: Expense[]
  loading: boolean
  refetch: () => void
} {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const mountedRef = useRef(true)

  const fetchAll = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false })
      if (!mountedRef.current) return
      if (error || !data) setExpenses([])
      else setExpenses(data as Expense[])
    } catch {
      if (mountedRef.current) setExpenses([])
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    fetchAll()

    let channel: ReturnType<typeof supabase.channel> | null = null
    try {
      channel = supabase
        .channel('expenses')
        .on(
          'postgres_changes' as never,
          { event: '*', schema: 'public', table: 'expenses' },
          () => fetchAll(),
        )
        .subscribe()
    } catch { /* noop */ }

    return () => {
      mountedRef.current = false
      if (channel) {
        try { supabase.removeChannel(channel) } catch { /* noop */ }
      }
    }
  }, [fetchAll])

  return { expenses, loading, refetch: fetchAll }
}
