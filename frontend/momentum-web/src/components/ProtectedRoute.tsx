import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthSession } from '@/auth/auth-session'

type ProtectedRouteProps = {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { status } = useAuthSession()

  if (status === 'loading') {
    return null
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
