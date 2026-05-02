import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import type { SeedEvent } from '../constants/seedData'

export interface DBEvent extends SeedEvent {
  id: string
}

export function userSeesEvent(event: DBEvent, userName: string): boolean {
  if (!event.for_users || event.for_users.length === 0) return true
  return event.for_users.includes(userName)
}

export function useEvents(): { events: DBEvent[]; loading: boolean } {
  const [events, setEvents] = useState<DBEvent[]>([])
  const [loading, setLoading] = useState(true)
  const mountedRef = useRef(true)

  const fetchEvents = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date_ist', { ascending: true })

      if (!mountedRef.current) return

      if (error) throw error
      setEvents((data ?? []) as DBEvent[])
    } catch {
      if (mountedRef.current) setEvents([])
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    fetchEvents()

    let channel: ReturnType<typeof supabase.channel> | null = null
    try {
      channel = supabase
        .channel('events')
        .on(
          'postgres_changes' as never,
          { event: '*', schema: 'public', table: 'events' },
          () => fetchEvents(),
        )
        .subscribe()
    } catch {
      // realtime is optional — ignore
    }

    return () => {
      mountedRef.current = false
      if (channel) {
        try { supabase.removeChannel(channel) } catch { /* noop */ }
      }
    }
  }, [fetchEvents])

  return { events, loading }
}
