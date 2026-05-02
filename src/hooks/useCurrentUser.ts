import { useState, useCallback } from 'react'
import { type User } from '../constants/users'

export function useCurrentUser() {
  const [user, setUserState] = useState<User | null>(null)

  const setUser = useCallback((u: User) => {
    setUserState(u)
  }, [])

  const clearUser = useCallback(() => {
    setUserState(null)
  }, [])

  return { user, setUser, clearUser }
}
