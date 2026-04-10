/* eslint-disable react-refresh/only-export-components */
import * as React from "react"

import {
  type LoginPayload,
  loginUser,
  refreshSession,
  type RegisterPayload,
  registerUser,
} from "@/features/auth/api/auth-api"
import type { AuthStatus, AuthUser } from "@/features/auth/model/auth-types"

const USER_STORAGE_KEY = "momentum.auth.user"

type AuthContextValue = {
  status: AuthStatus
  user: AuthUser | null
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

function deriveNameFromEmail(email: string) {
  const [username] = email.split("@")
  if (!username) {
    return "Momentum User"
  }

  const [first, ...rest] = username
  return `${first.toUpperCase()}${rest.join("")}`
}

function readStoredUser() {
  const rawUser = localStorage.getItem(USER_STORAGE_KEY)
  if (!rawUser) {
    return null
  }

  try {
    const parsed = JSON.parse(rawUser) as AuthUser
    if (!parsed.name || !parsed.email) {
      return null
    }

    return parsed
  } catch {
    return null
  }
}

function saveStoredUser(user: AuthUser) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
}

function clearStoredUser() {
  localStorage.removeItem(USER_STORAGE_KEY)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = React.useState<AuthStatus>("loading")
  const [user, setUser] = React.useState<AuthUser | null>(null)

  React.useEffect(() => {
    let isDisposed = false
    const storedUser = readStoredUser()

    const bootstrapSession = async () => {
      try {
        await refreshSession()
        if (isDisposed) {
          return
        }

        setUser(
          storedUser || {
            name: "Momentum User",
            email: "user@momentum.local",
          }
        )
        setStatus("authenticated")
      } catch {
        if (isDisposed) {
          return
        }

        clearStoredUser()
        setUser(null)
        setStatus("guest")
      }
    }

    void bootstrapSession()

    return () => {
      isDisposed = true
    }
  }, [])

  const login = React.useCallback(
    async (payload: LoginPayload) => {
      await loginUser(payload)

      const nextUser = {
        name: user?.name || deriveNameFromEmail(payload.email),
        email: payload.email,
      }

      saveStoredUser(nextUser)
      setUser(nextUser)
      setStatus("authenticated")
    },
    [user?.name]
  )

  const register = React.useCallback(async (payload: RegisterPayload) => {
    await registerUser(payload)
    await loginUser({ email: payload.email, password: payload.password })

    const nextUser = {
      name: payload.name.trim() || deriveNameFromEmail(payload.email),
      email: payload.email,
    }

    saveStoredUser(nextUser)
    setUser(nextUser)
    setStatus("authenticated")
  }, [])

  const logout = React.useCallback(() => {
    clearStoredUser()
    setUser(null)
    setStatus("guest")
  }, [])

  const value = React.useMemo(
    () => ({
      status,
      user,
      login,
      register,
      logout,
    }),
    [status, user, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }

  return context
}
