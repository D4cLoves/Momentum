import { CheckCircle2, CircleDashed, Rocket, Wrench } from "lucide-react"

const roadmapItems = [
  {
    title: "Statistics v2",
    text: "Deep analytics with custom date filters and trend comparisons.",
    status: "Planned",
    icon: CircleDashed,
  },
  {
    title: "Account backend",
    text: "Profile update, password actions and notification controls.",
    status: "In progress",
    icon: Wrench,
  },
  {
    title: "Productive release",
    text: "Final hardening, QA pass and deployment to your target host.",
    status: "Next milestone",
    icon: Rocket,
  },
]

export function CabinetRoadmapPage() {
  return (
    <div className="space-y-6">
      <section className="panel-surface p-6 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Future space
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-foreground">Roadmap placeholder</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          This page is intentionally prepared for upcoming features so you can
          plug in backend endpoints later without ripping layout and navigation.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {roadmapItems.map((item) => (
          <article key={item.title} className="panel-soft rounded-2xl p-5">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-background/70 text-primary">
              <item.icon className="size-4" />
            </span>
            <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <CheckCircle2 className="size-3.5" />
              {item.status}
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
