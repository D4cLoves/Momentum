import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowRight,
  Clock3,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react"

import { useAuthSession } from "@/auth/auth-session"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { loginUser } from "../api/authApi"

const loginTracks = [
  { label: "Route handoff", value: "cabinet" },
  { label: "State restore", value: "immediate" },
  { label: "Flow latency", value: "< 10 sec" },
]

const loginChecklist = [
  "Recover your project context",
  "Resume active focus session",
  "Move directly to execution",
]

const loginPulse = [
  { title: "Signal", text: "No dead space between auth and work." },
  { title: "Rhythm", text: "One click back into the task stream." },
]

export function LoginPage() {
  const navigate = useNavigate()
  const { markAuthenticated } = useAuthSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError("")

    try {
      await loginUser({ email, password })
      markAuthenticated()
      navigate("/cabinet")
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Login failed"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-[linear-gradient(160deg,hsl(var(--background))_0%,color-mix(in_oklab,hsl(var(--background))_88%,hsl(var(--foreground))_12%)_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,hsl(var(--primary)/0.16),transparent_32%),radial-gradient(circle_at_90%_8%,hsl(var(--primary)/0.09),transparent_22%),radial-gradient(circle_at_50%_100%,hsl(var(--primary)/0.08),transparent_34%)]" />
      <div className="pointer-events-none absolute left-[12%] top-0 h-full w-px bg-gradient-to-b from-transparent via-border/45 to-transparent" />
      <div className="pointer-events-none absolute right-[10%] top-0 h-full w-px bg-gradient-to-b from-transparent via-border/35 to-transparent" />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="grid h-[80vh] w-[80vw] max-w-[1700px] grid-rows-[auto_minmax(0,1fr)] gap-5 rounded-[1.5rem] border border-border/60 bg-background/35 p-5 backdrop-blur-sm max-lg:h-[86vh] max-lg:w-[92vw] max-sm:h-full max-sm:min-h-screen max-sm:w-full max-sm:rounded-none max-sm:border-0 max-sm:p-4">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              <LockKeyhole className="size-3.5 text-primary" />
              Secure login channel
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground">
              <Clock3 className="size-3.5 text-primary" />
              Session restore ready
            </div>
          </header>

          <div className="grid min-h-0 gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)]">
            <article className="relative grid min-h-0 grid-rows-[auto_auto_minmax(0,1fr)] gap-5 overflow-hidden rounded-[1.75rem] border border-border/70 bg-background/75 p-6 shadow-[inset_0_1px_0_hsl(var(--background)),0_20px_55px_hsl(var(--foreground)/0.09)] sm:p-8">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,hsl(var(--primary)/0.1),transparent_28%)]" />

            <div className="relative z-10 space-y-4">
              <h1 className="max-w-4xl text-4xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-5xl xl:text-6xl">
                Re-enter the workspace
                <br />
                without losing the thread.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Authentication should feel like a fast checkpoint. You pass
                through, recover context, and continue shipping.
              </p>
            </div>

            <div className="relative z-10 grid gap-3 sm:grid-cols-3">
              {loginTracks.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border/70 bg-background/60 px-4 py-4"
                >
                  <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-2 text-lg font-semibold">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="relative z-10 grid min-h-0 gap-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(220px,0.9fr)]">
              <div className="rounded-2xl border border-border/70 bg-muted/15 p-4">
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Session queue
                </p>
                <div className="mt-3 space-y-2">
                  {loginChecklist.map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-xl bg-background/70 px-3 py-2 text-sm"
                    >
                      <span>{item}</span>
                      <Zap className="size-4 text-primary" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3">
                {loginPulse.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-border/70 bg-background/60 px-4 py-4"
                  >
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-2 text-xs leading-6 text-muted-foreground">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </article>

            <article className="flex min-h-0 flex-col rounded-[1.75rem] border border-border/70 bg-background/82 p-6 shadow-[0_20px_55px_hsl(var(--foreground)/0.09)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Login
                </p>
                <h2 className="mt-2 text-2xl font-semibold">Access your cabinet</h2>
              </div>
              <div className="flex size-12 items-center justify-center rounded-2xl border border-border/70 bg-muted/20">
                <KeyRound className="size-5 text-primary" />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border/70 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
              <Sparkles className="size-4 text-primary" />
              Designed for quick transition from auth to execution.
            </div>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
              <label className="grid gap-2">
                <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Email
                </span>
                <Input
                  type="email"
                  className="h-12 rounded-2xl border-border/80 bg-background/70 px-4 text-sm"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@momentum.app"
                  required
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Password
                </span>
                <Input
                  type="password"
                  className="h-12 rounded-2xl border-border/80 bg-background/70 px-4 text-sm"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </label>

              {error ? (
                <p className="rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-2xl text-sm font-semibold"
              >
                {loading ? "Signing in..." : "Enter workspace"}
              </Button>
            </form>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/70 bg-background/60 px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Access model
                </p>
                <p className="mt-2 text-sm font-medium">Protected route + session flag</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/60 px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Redirect
                </p>
                <p className="mt-2 text-sm font-medium">Straight to `/cabinet`</p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                Need an account?
              </span>
              <Button asChild variant="ghost" className="h-9 rounded-xl px-3">
                <Link to="/register">
                  Register
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
