import { useMemo } from "react"

import { useCabinetData } from "@/features/cabinet/model/cabinet-data-context"
import { formatMinutes, parseDurationToMinutes } from "@/shared/lib/time"

type ProjectFocus = {
  projectId: string
  projectName: string
  minutes: number
}

function toWeekdayLabel(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return "N/A"
  }

  return date.toLocaleDateString([], { weekday: "short" })
}

export function CabinetStatsPage() {
  const { sessions, projects, isLoading } = useCabinetData()

  const overview = useMemo(() => {
    const totalMinutes = sessions.reduce(
      (sum, session) => sum + parseDurationToMinutes(session.duration),
      0
    )

    const completedSessions = sessions.filter((session) => session.endedAt).length
    const avgMinutes = sessions.length ? Math.round(totalMinutes / sessions.length) : 0

    return { totalMinutes, completedSessions, avgMinutes }
  }, [sessions])

  const topProjects = useMemo(() => {
    const byProject = new Map<string, number>()

    for (const session of sessions) {
      const current = byProject.get(session.projectId) || 0
      byProject.set(session.projectId, current + parseDurationToMinutes(session.duration))
    }

    const projectNameById = new Map(
      projects.map((project) => [project.id, project.name] as const)
    )

    const items: ProjectFocus[] = Array.from(byProject.entries()).map(
      ([projectId, minutes]) => ({
        projectId,
        projectName: projectNameById.get(projectId) || "Unknown project",
        minutes,
      })
    )

    return items.sort((a, b) => b.minutes - a.minutes).slice(0, 6)
  }, [projects, sessions])

  const weekdayHistogram = useMemo(() => {
    const map = new Map<string, number>()

    for (const session of sessions) {
      const label = toWeekdayLabel(session.startedAt)
      map.set(label, (map.get(label) || 0) + 1)
    }

    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  }, [sessions])

  const maxProjectMinutes = topProjects[0]?.minutes || 1
  const maxSessionsPerDay = Math.max(...weekdayHistogram.map((entry) => entry[1]), 1)

  if (isLoading) {
    return (
      <div className="panel-surface p-6 text-sm text-muted-foreground">
        Loading statistics...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <article className="panel-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Focus time
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {formatMinutes(overview.totalMinutes)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Summed from all sessions</p>
        </article>

        <article className="panel-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Avg session
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {formatMinutes(overview.avgMinutes)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Average duration per run</p>
        </article>

        <article className="panel-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Completed
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {overview.completedSessions} / {sessions.length}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Finished sessions count</p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="panel-surface p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Top projects by focus
          </p>
          <div className="mt-4 space-y-3">
            {topProjects.length === 0 && (
              <p className="text-sm text-muted-foreground">No session data yet.</p>
            )}

            {topProjects.map((project) => {
              const width = Math.max(9, Math.round((project.minutes / maxProjectMinutes) * 100))
              return (
                <div key={project.projectId} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <p className="truncate font-medium text-foreground">{project.projectName}</p>
                    <p className="text-muted-foreground">{formatMinutes(project.minutes)}</p>
                  </div>
                  <div className="h-2 rounded-full bg-muted/55">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </article>

        <article className="panel-surface p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Sessions per weekday
          </p>
          <div className="mt-4 space-y-3">
            {weekdayHistogram.length === 0 && (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            )}

            {weekdayHistogram.map(([day, count]) => {
              const width = Math.max(8, Math.round((count / maxSessionsPerDay) * 100))
              return (
                <div key={day} className="flex items-center gap-3">
                  <p className="w-12 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {day}
                  </p>
                  <div className="h-2 flex-1 rounded-full bg-muted/55">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent to-primary"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <p className="w-8 text-right text-sm text-foreground">{count}</p>
                </div>
              )
            })}
          </div>
        </article>
      </section>
    </div>
  )
}
