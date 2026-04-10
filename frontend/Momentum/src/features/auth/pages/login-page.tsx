import * as React from "react"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"

import { AuthShell } from "@/features/auth/components/auth-shell"
import { useAuth } from "@/features/auth/model/auth-context"
import { ApiError } from "@/shared/api/http-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type LocationState = {
  from?: string
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { status, login } = useAuth()

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  if (status === "authenticated") {
    return <Navigate to="/cabinet" replace />
  }

  const redirectTo = (location.state as LocationState | null)?.from || "/cabinet"

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await login({ email: email.trim(), password })
      navigate(redirectTo, { replace: true })
    } catch (authError) {
      setError(
        authError instanceof ApiError
          ? authError.message
          : "Login failed. Check credentials and try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in and continue where you left off."
      footer={
        <p>
          No account yet?{" "}
          <Link className="font-semibold text-primary hover:text-primary/80" to="/register">
            Create one
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Email
          </span>
          <Input
            type="email"
            value={email}
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@momentum.dev"
            required
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Password
          </span>
          <Input
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Your secure password"
            required
          />
        </label>

        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button className="h-10 w-full text-sm font-semibold" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  )
}
