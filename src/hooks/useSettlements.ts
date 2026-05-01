import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import type { Settlement } from '../lib/splitting'

export function useSettlements(): {
  settlements: Settlement[]
  loading: boolean
  refetch: () => void
} {
  const [settlements, setSettlements] = useState<Settlement[]>([])
  const [loading, setLoading] = useState(true)
  const mountedRef = useRef(true)

  const fetchAll = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('settlements')
        .select('*')
        .order('created_at', { ascending: false })
      if (!mountedRef.current) return
      if (error || !data) setSettlements([])
      else setSettlements(data as Settlement[])
    } catch {
      if (mountedRef.current) setSettlements([])
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
        .channel('settlements')
        .on(
          'postgres_changes' as never,
          { event: '*', schema: 'public', table: 'settlements' },
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

  return { settlements, loading, refetch: fetchAll }
}
