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
import { registerUser } from "@/api/authApi"

const framePanel =
  "supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 rounded-[28px] border border-border/70 bg-background/32 shadow-[inset_0_1px_0_hsl(var(--background)/0.7),0_24px_70px_hsl(var(--foreground)/0.16)] backdrop-blur-xl"

const softCard =
  "rounded-2xl border border-border/70 bg-background/24 shadow-[inset_0_1px_0_hsl(var(--background)/0.55)] backdrop-blur-md"

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

const trafficDots = [
  "bg-[#ff5f57]",
  "bg-[#febc2e]",
  "bg-[#28c840]",
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
    <section className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,hsl(var(--primary)/0.16),transparent_25%),radial-gradient(circle_at_88%_10%,hsl(var(--primary)/0.1),transparent_20%),radial-gradient(circle_at_50%_100%,hsl(var(--primary)/0.08),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-y-0 left-[6.5%] w-px bg-gradient-to-b from-transparent via-border/40 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-[6.5%] w-px bg-gradient-to-b from-transparent via-border/30 to-transparent" />
      <div className="pointer-events-none absolute inset-x-8 top-6 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative z-10 flex min-h-screen flex-col p-4 sm:p-5 lg:p-6">
        <div className="grid flex-1 min-h-[calc(100vh-2rem)] gap-4 lg:grid-cols-[minmax(430px,0.88fr)_minmax(0,1.12fr)]">
          <article className={`${framePanel} flex min-h-0 flex-col p-6 sm:p-8`}>
            <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-5">
              <div className="flex items-center gap-2">
                {trafficDots.map((item) => (
                  <span
                    key={item}
                    className={`size-2.5 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.08)] ${item}`}
                  />
                ))}
              </div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Account bootstrap
              </p>
            </div>

            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Register
                </p>
                <h1 className="mt-2 text-2xl font-semibold">
                  Create your Momentum profile
                </h1>
              </div>
              <div className="flex size-12 items-center justify-center rounded-2xl border border-border/70 bg-background/42">
                <UserRoundPlus className="size-5 text-primary" />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-2xl border border-border/70 bg-background/28 px-4 py-3 text-sm text-muted-foreground">
              <Sparkles className="size-4 text-primary" />
              Start with clean auth and move directly into project execution.
            </div>

            <form className="mt-6 flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <label className="grid gap-2">
                  <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground/95">
                    Name
                  </span>
                  <Input
                    type="text"
                    className="h-12 rounded-2xl border-border/75 bg-background/60 px-4"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                    required
                  />
                </label>

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
              </div>

              <div className="mt-auto space-y-4 pt-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  {registerTiles.map((item) => (
                    <div key={item.title} className={`${softCard} px-4 py-4`}>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="mt-2 text-xs leading-6 text-muted-foreground">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>

                <div className={`${softCard} flex flex-wrap items-center justify-between gap-4 px-4 py-3 text-sm text-muted-foreground`}>
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
              </div>
            </form>
          </article>

          <article className={`${framePanel} grid min-h-0 grid-rows-[auto_auto_minmax(0,1fr)_auto] p-6 sm:p-8`}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  <BadgePlus className="size-3.5 text-primary" />
                  New account bootstrap
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  <BadgeCheck className="size-3.5 text-primary" />
                  Guided onboarding flow
                </span>
              </div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Setup rail
              </p>
            </div>

            <div className="max-w-4xl space-y-5 pt-6">
              <h2 className="text-4xl font-semibold leading-[0.94] tracking-[-0.045em] sm:text-5xl xl:text-[5.4rem]">
                Build structure
                <br />
                before the chaos
                <br />
                gets expensive.
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Registration is the first move that defines how clean the
                workflow stays after day one. Set the account up once and keep
                the rest of the system coherent.
              </p>
            </div>

            <div className="grid min-h-0 gap-4 pt-6 xl:grid-cols-[minmax(0,1fr)_minmax(250px,0.72fr)]">
              <div className={`${softCard} flex min-h-0 flex-col p-4`}>
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Onboarding path
                </p>
                <div className="mt-4 space-y-2">
                  {registerTracks.map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-xl border border-border/60 bg-background/52 px-3 py-3 text-sm"
                    >
                      <span>{item}</span>
                      <span className="text-xs text-muted-foreground">
                        0{index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${softCard} p-4`}>
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

            <div className="grid gap-3 pt-6 md:grid-cols-3">
              {registerPerks.map((item) => (
                <div key={item.label} className={`${softCard} px-4 py-5`}>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
