import { Link } from "react-router-dom"
import {
  ArrowRight,
  ChartNoAxesColumn,
  Crosshair,
  Hourglass,
  Sparkles,
  Target,
} from "lucide-react"

import { Button } from "@/components/ui/button"

const glassPanel =
  "supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 rounded-[28px] border border-border/70 bg-background/32 shadow-[inset_0_1px_0_hsl(var(--background)/0.7),0_24px_70px_hsl(var(--foreground)/0.16)] backdrop-blur-xl"

const softCard =
  "rounded-2xl border border-border/70 bg-background/24 shadow-[inset_0_1px_0_hsl(var(--background)/0.55)] backdrop-blur-md"

const trafficDots = [
  "bg-[#ff5f57]",
  "bg-[#febc2e]",
  "bg-[#28c840]",
]

const landingStats = [
  { label: "Focus blocks", value: "24", note: "planned this week" },
  { label: "Execution rate", value: "87%", note: "tracked momentum" },
  { label: "Deep work", value: "31h", note: "without context switching" },
]

const landingSignals = [
  {
    icon: Target,
    title: "One target per sprint",
    copy: "A single clear objective instead of ten half-dead intentions.",
  },
  {
    icon: Hourglass,
    title: "Time you can see",
    copy: "Sessions turn effort into visible numbers, not vague self-deception.",
  },
  {
    icon: ChartNoAxesColumn,
    title: "Progress with structure",
    copy: "Projects, tasks, and rhythm stay in one system instead of scattered tabs.",
  },
]

export function LandingPage() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,hsl(var(--primary)/0.16),transparent_28%),radial-gradient(circle_at_86%_10%,hsl(var(--primary)/0.08),transparent_20%),radial-gradient(circle_at_50%_100%,hsl(var(--primary)/0.08),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-y-0 left-[7%] w-px bg-gradient-to-b from-transparent via-border/40 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-[7%] w-px bg-gradient-to-b from-transparent via-border/30 to-transparent" />
      <div className="pointer-events-none absolute inset-x-8 top-6 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative z-10 flex min-h-screen flex-col p-4 sm:p-5 lg:p-6">
        <div className="grid flex-1 min-h-[calc(100vh-2rem)] gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.85fr)]">
          <article className={`${glassPanel} grid min-h-0 grid-rows-[auto_1fr_auto] p-6 sm:p-8`}>
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
                Entry cockpit
              </p>
            </div>

            <div className="grid min-h-0 gap-6 pt-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(260px,0.9fr)]">
              <div className="flex min-h-0 flex-col justify-center">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    <Sparkles className="size-3.5 text-primary" />
                    Momentum System
                  </span>
                  <span className="rounded-full border border-border/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]">
                    Focus stack
                  </span>
                </div>
                <h1 className="max-w-5xl text-4xl font-semibold leading-[0.95] tracking-[-0.045em] sm:text-5xl xl:text-[5.7rem]">
                  Work with intent.
                  <br />
                  Cut the noise.
                  <br />
                  Ship the next move.
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  Momentum is a focus cockpit for people who are done pretending
                  that scattered notes and random tabs count as a workflow.
                  Enter, lock on the task, and move the project forward.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild className="h-12 rounded-2xl px-5 text-sm font-semibold">
                    <Link to="/login">
                      Open workspace
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-12 rounded-2xl border-border/80 bg-transparent px-5 text-sm"
                  >
                    <Link to="/register">Create account</Link>
                  </Button>
                </div>
              </div>

              <div className="grid gap-3">
                <div className={`${softCard} p-4`}>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    Session mode
                  </p>
                  <p className="mt-3 text-lg font-semibold">Focused execution</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Start a session, define the target, and keep the project thread alive.
                  </p>
                </div>
                <div className={`${softCard} p-4`}>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    Output lane
                  </p>
                  <p className="mt-3 text-lg font-semibold">Visible progress</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Projects, areas, sessions, and momentum stay in one place.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 pt-6 md:grid-cols-3">
              {landingStats.map((item) => (
                <div key={item.label} className={`${softCard} px-4 py-5`}>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.03em]">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>
                </div>
              ))}
            </div>
          </article>

          <aside className="grid min-h-0 gap-4">
            <article className={`${glassPanel} p-6 sm:p-7`}>
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    {trafficDots.map((item) => (
                      <span
                        key={item}
                        className={`size-2.5 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.08)] ${item}`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    Session deck
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">Tonight sprint</h2>
                </div>
                <div className="flex size-12 items-center justify-center rounded-2xl border border-border/70">
                  <Crosshair className="size-5 text-primary" />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className={`${softCard} p-4`}>
                  <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    Active target
                  </p>
                  <p className="mt-2 text-sm font-medium">
                    Finish the auth flow and stop shipping placeholder UI.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className={`${softCard} p-4`}>
                    <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                      Window
                    </p>
                    <p className="mt-2 text-2xl font-semibold">02:10:44</p>
                  </div>
                  <div className={`${softCard} p-4`}>
                    <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                      Progress
                    </p>
                    <p className="mt-2 text-2xl font-semibold">68%</p>
                  </div>
                </div>
                <div className={`${softCard} p-4`}>
                  <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    Queue
                  </p>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2">
                      <span>Landing redesign</span>
                      <span className="text-muted-foreground">done</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2">
                      <span>Login form polish</span>
                      <span className="text-muted-foreground">active</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2">
                      <span>Register flow</span>
                      <span className="text-muted-foreground">next</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <div className="grid min-h-0 gap-3 md:grid-cols-3 lg:grid-cols-1">
              {landingSignals.map((item) => (
                <article
                  key={item.title}
                  className={`${glassPanel} flex flex-col justify-center p-5`}
                >
                  <item.icon className="size-4 text-primary" />
                  <p className="mt-3 text-sm font-semibold">{item.title}</p>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">
                    {item.copy}
                  </p>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
