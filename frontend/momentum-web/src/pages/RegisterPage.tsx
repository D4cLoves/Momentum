import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowRight,
  BadgeCheck,
  BadgePlus,
  CheckCircle2,
  Orbit,
  Sparkles,
  UserRoundPlus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { registerUser } from "../api/authApi"

const registerPerks = [
  { label: "Workspace", value: "single source of truth" },
  { label: "Projects", value: "grouped by area" },
  { label: "Sessions", value: "measured by timeline" },
]

const registerTracks = [
  "Create account credentials",
  "Authenticate on login page",
  "Start focused session in cabinet",
]

const registerTiles = [
  { title: "Structure first", text: "Less chaos from day one." },
  { title: "Fast entry", text: "Signup flow keeps momentum." },
]

export function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      await registerUser({ name, email, password })
      setSuccess("Account created. Redirecting to login...")
      setTimeout(() => {
        navigate("/login")
      }, 900)
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Register failed"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-[linear-gradient(160deg,hsl(var(--background))_0%,color-mix(in_oklab,hsl(var(--background))_86%,hsl(var(--foreground))_14%)_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,hsl(var(--primary)/0.16),transparent_30%),radial-gradient(circle_at_88%_14%,hsl(var(--primary)/0.1),transparent_22%),radial-gradient(circle_at_50%_100%,hsl(var(--primary)/0.08),transparent_34%)]" />
      <div className="pointer-events-none absolute left-[10%] top-0 h-full w-px bg-gradient-to-b from-transparent via-border/45 to-transparent" />
      <div className="pointer-events-none absolute right-[14%] top-0 h-full w-px bg-gradient-to-b from-transparent via-border/35 to-transparent" />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="grid h-[80vh] w-[80vw] max-w-[1700px] grid-rows-[auto_minmax(0,1fr)] gap-5 rounded-[1.5rem] border border-border/60 bg-background/35 p-5 backdrop-blur-sm max-lg:h-[86vh] max-lg:w-[92vw] max-sm:h-full max-sm:min-h-screen max-sm:w-full max-sm:rounded-none max-sm:border-0 max-sm:p-4">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              <BadgePlus className="size-3.5 text-primary" />
              New account bootstrap
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground">
              <BadgeCheck className="size-3.5 text-primary" />
              Guided onboarding flow
            </div>
          </header>

          <div className="grid min-h-0 gap-5 lg:grid-cols-[minmax(420px,0.9fr)_minmax(0,1.1fr)]">
          <article className="flex min-h-0 flex-col rounded-[1.75rem] border border-border/70 bg-background/82 p-6 shadow-[0_20px_55px_hsl(var(--foreground)/0.09)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Register
                </p>
                <h1 className="mt-2 text-2xl font-semibold">Create your Momentum profile</h1>
              </div>
              <div className="flex size-12 items-center justify-center rounded-2xl border border-border/70 bg-muted/20">
                <UserRoundPlus className="size-5 text-primary" />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border/70 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
              <Sparkles className="size-4 text-primary" />
              Start with clean auth and move directly into project execution.
            </div>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
              <label className="grid gap-2">
                <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Name
                </span>
                <Input
                  type="text"
                  className="h-12 rounded-2xl border-border/80 bg-background/70 px-4 text-sm"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  required
                />
              </label>

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
                  placeholder="Create a password"
                  required
                />
              </label>

              {error ? (
                <p className="rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {error}
                </p>
              ) : null}
              {success ? (
                <p className="rounded-2xl border border-emerald-500/35 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
                  {success}
                </p>
              ) : null}

              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-2xl text-sm font-semibold"
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {registerTiles.map((item) => (
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

            <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                Already registered?
              </span>
              <Button asChild variant="ghost" className="h-9 rounded-xl px-3">
                <Link to="/login">
                  Sign in
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </article>

          <article className="relative grid min-h-0 grid-rows-[auto_auto_minmax(0,1fr)] gap-5 overflow-hidden rounded-[1.75rem] border border-border/70 bg-background/74 p-6 shadow-[inset_0_1px_0_hsl(var(--background)),0_20px_55px_hsl(var(--foreground)/0.09)] sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_16%,hsl(var(--primary)/0.1),transparent_28%)]" />

            <div className="relative z-10 space-y-4">
              <h2 className="max-w-4xl text-4xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-5xl xl:text-6xl">
                Build structure
                <br />
                before the chaos
                <br />
                gets expensive.
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Registration is not just a form. It is the first move that
                defines how clean your workflow stays after day one.
              </p>
            </div>

            <div className="relative z-10 grid gap-3 sm:grid-cols-3">
              {registerPerks.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border/70 bg-background/60 px-4 py-4"
                >
                  <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm font-semibold">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="relative z-10 grid min-h-0 gap-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(220px,0.9fr)]">
              <div className="rounded-2xl border border-border/70 bg-muted/15 p-4">
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Onboarding path
                </p>
                <div className="mt-3 space-y-2">
                  {registerTracks.map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-xl bg-background/70 px-3 py-2 text-sm"
                    >
                      <span>{item}</span>
                      <span className="text-xs text-muted-foreground">0{index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/60 px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Mode
                </p>
                <p className="mt-3 flex items-center gap-2 text-lg font-semibold">
                  <Orbit className="size-4 text-primary" />
                  Controlled start
                </p>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">
                  Auth flow aligned with project setup from the first minute.
                </p>
              </div>
            </div>
          </article>
          </div>
        </div>
      </div>
    </section>
  )
}
