import * as React from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthShell } from "@/features/auth/components/auth-shell"
import { useAuth } from "@/features/auth/model/auth-context"
import { ApiError } from "@/shared/api/http-client"

export function RegisterPage() {
  const navigate = useNavigate()
  const { status, register } = useAuth()

  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  if (status === "authenticated") {
    return <Navigate to="/cabinet" replace />
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      })
      navigate("/cabinet", { replace: true })
    } catch (registerError) {
      setError(
        registerError instanceof ApiError
          ? registerError.message
          : "Registration failed. Try a different email."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Set up your workspace and start tracking progress today."
      footer={
        <p>
          Already have an account?{" "}
          <Link className="font-semibold text-primary hover:text-primary/80" to="/login">
            Sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Name
          </span>
          <Input
            type="text"
            value={name}
            autoComplete="name"
            onChange={(event) => setName(event.target.value)}
            placeholder="Vladislav"
            minLength={2}
            required
          />
        </label>

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
            autoComplete="new-password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            minLength={8}
            required
          />
        </label>

        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button className="h-10 w-full text-sm font-semibold" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </AuthShell>
  )
}
