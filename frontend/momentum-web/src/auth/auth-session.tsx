import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { refreshSession } from '@/api/authApi'

type AuthStatus = 'loading' | 'authenticated' | 'guest'

type AuthSessionContextValue = {
  status: AuthStatus
  markAuthenticated: () => void
  markGuest: () => void
  revalidate: () => Promise<void>
}

const AuthSessionContext = createContext<AuthSessionContextValue | undefined>(undefined)

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading')

  const revalidate = useCallback(async () => {
    try {
      await refreshSession()
      setStatus('authenticated')
    } catch {
      setStatus('guest')
    }
  }, [])

  useEffect(() => {
    void revalidate()
  }, [revalidate])

  const markAuthenticated = useCallback(() => {
    setStatus('authenticated')
  }, [])

  const markGuest = useCallback(() => {
    setStatus('guest')
  }, [])

  const value = useMemo(
    () => ({
      status,
      markAuthenticated,
      markGuest,
      revalidate,
    }),
    [status, markAuthenticated, markGuest, revalidate],
  )

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext)
  if (!context) {
    throw new Error('useAuthSession must be used inside AuthSessionProvider')
  }

  return context
}
