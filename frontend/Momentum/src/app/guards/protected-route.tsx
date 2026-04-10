import { Navigate, Outlet, useLocation } from "react-router-dom"

import { useAuth } from "@/features/auth/model/auth-context"

export default function ProtectedRoute() {
  const location = useLocation()
  const { status } = useAuth()

  if (status === "loading") {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,178,169,0.18),transparent_35%),radial-gradient(circle_at_80%_8%,rgba(255,178,89,0.12),transparent_40%)]" />
        <div className="panel-surface flex items-center gap-3 px-5 py-4 text-sm text-muted-foreground">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
          Checking session
        </div>
      </div>
    )
  }

  if (status === "guest") {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: `${location.pathname}${location.search}${location.hash}`,
        }}
      />
    )
  }

  return <Outlet />
}
