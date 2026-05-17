import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'

export interface Todo {
  id: string
  user_name: string
  text: string
  completed: boolean
  created_at: string
}

export function useTodos(userName: string) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const mountedRef = useRef(true)

  const fetchTodos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_name', userName)
        .order('created_at', { ascending: true })

      if (!mountedRef.current) return
      if (error) throw error
      setTodos((data ?? []) as Todo[])
    } catch {
      if (mountedRef.current) setTodos([])
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [userName])

  useEffect(() => {
    mountedRef.current = true
    setLoading(true)
    fetchTodos()

    let channel: ReturnType<typeof supabase.channel> | null = null
    try {
      channel = supabase
        .channel(`todos-${userName}`)
        .on(
          'postgres_changes' as never,
          { event: '*', schema: 'public', table: 'todos', filter: `user_name=eq.${userName}` },
          () => fetchTodos(),
        )
        .subscribe()
    } catch {
      // realtime optional
    }

    return () => {
      mountedRef.current = false
      if (channel) {
        try { supabase.removeChannel(channel) } catch { /* noop */ }
      }
    }
  }, [userName, fetchTodos])

  async function addTodo(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    await supabase.from('todos').insert({ user_name: userName, text: trimmed })
    await fetchTodos()
  }

  async function toggleTodo(id: string, completed: boolean) {
    await supabase.from('todos').update({ completed: !completed }).eq('id', id)
    await fetchTodos()
  }

  async function deleteTodo(id: string) {
    await supabase.from('todos').delete().eq('id', id)
    await fetchTodos()
  }

  async function clearCompleted() {
    await supabase.from('todos').delete().eq('user_name', userName).eq('completed', true)
    await fetchTodos()
  }

  return { todos, loading, addTodo, toggleTodo, deleteTodo, clearCompleted }
}
