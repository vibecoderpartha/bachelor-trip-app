import { useState, useCallback } from 'react'
import { type User } from '../constants/users'

const STORAGE_KEY = 'bali_active_user'

function loadFromStorage(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export function useCurrentUser() {
  const [user, setUserState] = useState<User | null>(loadFromStorage)

  const setUser = useCallback((u: User) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    setUserState(u)
  }, [])

  const clearUser = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUserState(null)
  }, [])

  return { user, setUser, clearUser }
}
