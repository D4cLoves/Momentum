import type { ReactNode } from "react"
import { Link } from "react-router-dom"

import { AppStarsBackground } from "@/components/background/app-stars-background"

type AuthShellProps = {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

const quickNotes = [
  "Fast keyboard-first workflow",
  "Focused sprint sessions",
  "Data from your real backend",
]

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden px-3 py-4 sm:px-4 md:px-5">
      <AppStarsBackground className="opacity-75" />

      <div className="relative mx-auto grid min-h-[calc(100vh-2rem)] w-[96vw] max-w-[1880px] overflow-hidden rounded-[2rem] border border-border/70 bg-card/70 shadow-[0_30px_90px_rgba(2,9,17,0.45)] backdrop-blur md:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden border-r border-border/60 bg-[linear-gradient(165deg,rgba(12,20,34,0.95),rgba(8,12,20,0.95))] p-10 md:flex md:flex-col">
          <Link
            to="/"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-border/80 bg-background/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            Momentum
          </Link>

          <div className="mt-12 space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">
              Focus Command
            </p>
            <h2 className="text-4xl leading-tight font-semibold text-foreground">
              Build momentum with deliberate work.
            </h2>
            <p className="max-w-lg text-sm leading-6 text-muted-foreground">
              One cockpit for planning, execution and session tracking. Minimal
              friction. Maximum visibility.
            </p>
          </div>

          <ul className="mt-10 space-y-4">
            {quickNotes.map((note) => (
              <li key={note} className="flex items-center gap-3 text-sm text-foreground/90">
                <span className="h-2.5 w-2.5 rounded-full bg-primary/90 shadow-[0_0_16px_rgba(0,178,169,0.8)]" />
                {note}
              </li>
            ))}
          </ul>

          <div className="mt-auto rounded-2xl border border-border/60 bg-background/60 p-5 text-sm text-muted-foreground">
            Clean architecture in frontend means cleaner speed when you extend
            this app later.
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-8 md:p-12">
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                Momentum App
              </p>
              <h1 className="text-3xl leading-tight font-semibold text-foreground">
                {title}
              </h1>
              <p className="text-sm leading-6 text-muted-foreground">{subtitle}</p>
            </div>

            <div className="panel-surface p-5 sm:p-6">{children}</div>

            <div className="text-sm text-muted-foreground">{footer}</div>
          </div>
        </section>
      </div>
    </div>
  )
}
