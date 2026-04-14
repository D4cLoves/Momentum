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

const landingFooter = [
  "Project rhythm tracking",
  "Session-based execution",
  "One workspace for every area",
  "Visible momentum instead of fake productivity",
]

export function LandingPage() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-[10%] w-px bg-gradient-to-b from-transparent via-border/40 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-[10%] w-px bg-gradient-to-b from-transparent via-border/30 to-transparent" />
      <div className="pointer-events-none absolute inset-x-8 top-6 h-px bg-gradient-to-r from-transparent via-border/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-8 bottom-6 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="grid h-[80vh] w-[80vw] max-w-[1700px] grid-rows-[minmax(0,1fr)_auto] gap-6 rounded-[1.5rem] border border-border/60 p-5 backdrop-blur-sm max-lg:h-[86vh] max-lg:w-[92vw] max-sm:h-full max-sm:min-h-screen max-sm:w-full max-sm:rounded-none max-sm:border-0 max-sm:p-4">
          <div className="grid min-h-0 gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
          <article className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-8 rounded-[1.75rem] border border-border/60 p-6 sm:p-8">
            <div className="flex flex-col justify-center space-y-8 xl:pr-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  <Sparkles className="size-3.5 text-primary" />
                  Momentum System
                </span>
                <span className="rounded-full border border-border/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]">
                  Focus stack
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="max-w-4xl text-4xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-5xl xl:text-[5.2rem]">
                  Work with intent.
                  <br />
                  Cut the noise.
                  <br />
                  Ship the next move.
                </h1>
                <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                  Momentum is a focus cockpit for people who are done pretending
                  that scattered notes and random tabs count as a workflow.
                  Enter, lock on the task, and move the project forward.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild className="h-12 rounded-2xl px-5 text-sm font-semibold">
                  <Link to="/login">
                    Open workspace
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-2xl border-border/80 px-5 text-sm"
                >
                  <Link to="/register">Create account</Link>
                </Button>
              </div>
            </div>

            <div className="grid content-end gap-3 md:grid-cols-3">
              {landingStats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-border/70 px-4 py-5">
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

          <aside className="grid h-full min-h-0 gap-4 xl:grid-rows-[auto_1fr]">
            <article className="rounded-[1.75rem] border border-border/60 p-6 sm:p-7">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div>
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
                <div className="rounded-2xl border border-border/70 p-4">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    Active target
                  </p>
                  <p className="mt-2 text-sm font-medium">
                    Finish the auth flow and stop shipping placeholder UI.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border/70 p-4">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                      Window
                    </p>
                    <p className="mt-2 text-2xl font-semibold">02:10:44</p>
                  </div>
                  <div className="rounded-2xl border border-border/70 p-4">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                      Progress
                    </p>
                    <p className="mt-2 text-2xl font-semibold">68%</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-border/70 p-4">
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

            <div className="grid min-h-0 gap-3 md:grid-cols-3 xl:auto-rows-fr xl:grid-cols-1">
              {landingSignals.map((item) => (
                <article
                  key={item.title}
                  className="flex flex-col justify-center rounded-2xl border border-border/70 p-5"
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

          <div className="grid gap-3 border-t border-border/60 pt-2 md:grid-cols-2 xl:grid-cols-4">
          {landingFooter.map((item) => (
            <div key={item} className="rounded-2xl border border-border/70 px-4 py-4 text-sm text-muted-foreground">
              {item}
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  )
}
