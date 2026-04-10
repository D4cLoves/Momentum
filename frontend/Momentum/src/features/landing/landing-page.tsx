import { ArrowRight, BarChart3, Clock3, Layers3, ShieldCheck } from "lucide-react"
import { Link } from "react-router-dom"

import { AppStarsBackground } from "@/components/background/app-stars-background"
import { Button } from "@/components/ui/button"

const valueCards = [
  {
    icon: Clock3,
    title: "Session-first focus",
    text: "Track work in real sessions, not random notes scattered across tools.",
  },
  {
    icon: Layers3,
    title: "Clear structure",
    text: "Areas, projects and sessions in one place with no UI chaos.",
  },
  {
    icon: BarChart3,
    title: "Useful metrics",
    text: "See progress trends fast so decisions stay data-driven.",
  },
  {
    icon: ShieldCheck,
    title: "Backend ready",
    text: "Connected to your API with a clean frontend architecture for scaling.",
  },
]

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <AppStarsBackground className="opacity-80" />

      <header className="relative z-10 border-b border-border/60 bg-background/70 backdrop-blur">
        <div className="mx-auto flex w-[96vw] max-w-[1880px] items-center justify-between px-2 py-4 sm:px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground"
          >
            Momentum
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Start free</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-[96vw] max-w-[1880px] space-y-14 px-2 py-10 sm:px-4 sm:py-12">
        <section className="grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Built for deep work
            </p>

            <h1 className="max-w-2xl text-balance text-4xl leading-[1.02] font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              A dark, focused command center for serious execution.
            </h1>

            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Momentum keeps your priorities clean: define areas, move projects,
              run sessions, and monitor progress without visual noise.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button size="lg" className="h-11 px-5 text-sm font-semibold" asChild>
                <Link to="/register">
                  Create workspace
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-11 px-5 text-sm" asChild>
                <Link to="/login">Open dashboard</Link>
              </Button>
            </div>
          </div>

          <div className="panel-surface relative overflow-hidden p-6 sm:p-7">
            <div className="absolute top-0 right-0 h-28 w-28 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-accent/20 blur-2xl" />

            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Cabinet preview
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">
              Everything in one cockpit
            </h2>

            <div className="mt-5 space-y-3">
              <div className="rounded-xl border border-border/65 bg-background/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Active sessions
                </p>
                <p className="mt-1 text-2xl font-semibold text-foreground">2 running</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border/65 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Projects
                  </p>
                  <p className="mt-1 text-xl font-semibold text-foreground">14</p>
                </div>
                <div className="rounded-xl border border-border/65 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    This week
                  </p>
                  <p className="mt-1 text-xl font-semibold text-foreground">17h 40m</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {valueCards.map((card) => (
            <article
              key={card.title}
              className="panel-soft flex h-full flex-col rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-background/70 text-primary">
                <card.icon className="size-4" />
              </div>
              <h3 className="text-base font-semibold text-foreground">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.text}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}
