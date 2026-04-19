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
import { loginUser } from "@/api/authApi"

const framePanel =
  "supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 rounded-[28px] border border-border/70 bg-background/32 shadow-[inset_0_1px_0_hsl(var(--background)/0.7),0_24px_70px_hsl(var(--foreground)/0.16)] backdrop-blur-xl"

const softCard =
  "rounded-2xl border border-border/70 bg-background/24 shadow-[inset_0_1px_0_hsl(var(--background)/0.55)] backdrop-blur-md"

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

const trafficDots = [
  "bg-[#ff5f57]",
  "bg-[#febc2e]",
  "bg-[#28c840]",
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
    <section className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_12%,hsl(var(--primary)/0.16),transparent_24%),radial-gradient(circle_at_86%_10%,hsl(var(--primary)/0.1),transparent_20%),radial-gradient(circle_at_50%_100%,hsl(var(--primary)/0.08),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-y-0 left-[6.5%] w-px bg-gradient-to-b from-transparent via-border/40 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-[6.5%] w-px bg-gradient-to-b from-transparent via-border/30 to-transparent" />
      <div className="pointer-events-none absolute inset-x-8 top-6 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative z-10 flex min-h-screen flex-col p-4 sm:p-5 lg:p-6">
        <div className="grid flex-1 min-h-[calc(100vh-2rem)] gap-4 lg:grid-cols-[minmax(0,1.12fr)_minmax(420px,0.88fr)]">
          <article className={`${framePanel} grid min-h-0 grid-rows-[auto_auto_minmax(0,1fr)_auto] p-6 sm:p-8`}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {trafficDots.map((item) => (
                  <span
                    key={item}
                    className={`size-2.5 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.08)] ${item}`}
                  />
                ))}
              </div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Auth deck
              </p>
            </div>

            <div className="space-y-5 pt-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  <LockKeyhole className="size-3.5 text-primary" />
                  Secure login channel
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  <Clock3 className="size-3.5 text-primary" />
                  Session restore ready
                </span>
              </div>

              <div className="max-w-4xl">
                <h1 className="text-4xl font-semibold leading-[0.94] tracking-[-0.045em] sm:text-5xl xl:text-[5.4rem]">
                  Re-enter the workspace
                  <br />
                  without losing
                  <br />
                  the thread.
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  Authentication should feel like a fast checkpoint. You pass
                  through, recover context, and continue shipping instead of
                  staring at another dead form.
                </p>
              </div>
            </div>

            <div className="grid min-h-0 gap-4 pt-6 xl:grid-cols-[minmax(0,1fr)_minmax(250px,0.72fr)]">
              <div className={`${softCard} flex min-h-0 flex-col p-4`}>
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Session queue
                </p>
                <div className="mt-4 space-y-2">
                  {loginChecklist.map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-xl border border-border/60 bg-background/52 px-3 py-3 text-sm"
                    >
                      <span>{item}</span>
                      <Zap className="size-4 text-primary" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3">
                {loginPulse.map((item) => (
                  <div key={item.title} className={`${softCard} p-4`}>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      {item.title}
                    </p>
                    <p className="mt-3 text-sm font-semibold">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3 pt-6 md:grid-cols-3">
              {loginTracks.map((item) => (
                <div key={item.label} className={`${softCard} px-4 py-5`}>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-2 text-xl font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </article>

          <article className={`${framePanel} flex min-h-0 flex-col p-6 sm:p-8`}>
            <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Login
                </p>
                <h2 className="mt-2 text-2xl font-semibold">Access your cabinet</h2>
              </div>
              <div className="flex size-12 items-center justify-center rounded-2xl border border-border/70 bg-background/42">
                <KeyRound className="size-5 text-primary" />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-2xl border border-border/70 bg-background/28 px-4 py-3 text-sm text-muted-foreground">
              <Sparkles className="size-4 text-primary" />
              Designed to move from auth straight into active work.
            </div>

            <form className="mt-6 flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <label className="grid gap-2">
                  <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground/95">
                    Email
                  </span>
                  <Input
                    type="email"
                    className="h-12 rounded-2xl border-border/75 bg-background/60 px-4"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@momentum.app"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground/95">
                    Password
                  </span>
                  <Input
                    type="password"
                    className="h-12 rounded-2xl border-border/75 bg-background/60 px-4"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </label>

                <div className={`${softCard} flex flex-wrap items-center justify-between gap-3 px-4 py-3`}>
                  <div>
                    <p className="text-sm font-semibold">Forgot your password?</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Recovery entry point for the case when access is gone.
                    </p>
                  </div>
                  <Button asChild type="button" variant="ghost" className="h-10 rounded-xl px-3">
                    <Link to="/recover-code">Recover access</Link>
                  </Button>
                </div>

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
              </div>

              <div className="mt-auto space-y-4 pt-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className={`${softCard} px-4 py-4`}>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      Access model
                    </p>
                    <p className="mt-2 text-sm font-medium">
                      Protected route + session flag
                    </p>
                  </div>
                  <div className={`${softCard} px-4 py-4`}>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      Redirect
                    </p>
                    <p className="mt-2 text-sm font-medium">Straight to `/cabinet`</p>
                  </div>
                </div>

                <div className={`${softCard} flex flex-wrap items-center justify-between gap-4 px-4 py-3 text-sm text-muted-foreground`}>
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
              </div>
            </form>
          </article>
        </div>
      </div>
    </section>
  )
}
