import { type ReactNode, type SVGProps, useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { AlertTriangle, BarChart3, Flame, HomeIcon, Settings2, User2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  getProjects,
  getSessions,
  getStreak,
  type ProjectDto,
  type SessionDto,
  type StreakDto,
} from "@/api/cabinetApi"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Dock, DockIcon } from "@/components/ui/dock"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ThemeTogglerButton } from "@/components/animate-ui/components/buttons/theme-toggler"

function formatLocalDate(value: string | null | undefined) {
  if (!value) return "No data"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })
}

function formatDayKey(date: Date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  return `${year}-${month}-${day}`
}

function addDays(base: Date, offset: number) {
  const next = new Date(base)
  next.setDate(next.getDate() + offset)
  return next
}

function parseDurationToSeconds(value: string) {
  const text = value.trim()
  if (!text) return 0
  const normalized = text.replace(",", ".")

  const fullMatch = normalized.match(/^(?:(\d+)\.)?(\d{1,2}):(\d{2}):(\d{2})(?:\.\d+)?$/)
  if (fullMatch) {
    const days = Number(fullMatch[1] ?? "0")
    const hours = Number(fullMatch[2] ?? "0")
    const minutes = Number(fullMatch[3] ?? "0")
    const seconds = Number(fullMatch[4] ?? "0")
    return days * 86400 + hours * 3600 + minutes * 60 + seconds
  }

  const shortMatch = normalized.match(/^(\d{1,2}):(\d{2})(?:\.\d+)?$/)
  if (shortMatch) {
    const minutes = Number(shortMatch[1] ?? "0")
    const seconds = Number(shortMatch[2] ?? "0")
    return minutes * 60 + seconds
  }

  const numericSeconds = Number(normalized)
  if (!Number.isNaN(numericSeconds)) return Math.max(0, Math.floor(numericSeconds))
  return 0
}

function formatHoursMinutesSeconds(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds)
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = safe % 60
  return `${hours}h ${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`
}

function seededProjectRank(projectId: string, seed: number) {
  let hash = seed | 0
  for (let i = 0; i < projectId.length; i += 1) {
    hash = (hash * 31 + projectId.charCodeAt(i)) | 0
  }
  return hash >>> 0
}

function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto px-3 pb-[154px] pt-[96px] md:pl-4 md:pr-2 md:pb-[154px] md:pt-[96px]">
      <div className="flex w-full min-w-0 flex-1 flex-col justify-center gap-4">{children}</div>
    </div>
  )
}

const StatsIcons = {
  github: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 438.549 438.549" {...props}>
      <path
        fill="currentColor"
        d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
      />
    </svg>
  ),
}

const STATS_DOCK_DATA = {
  navbar: [
    { href: "/cabinet", icon: HomeIcon, label: "Home" },
    { href: "/statistics", icon: BarChart3, label: "Statistics" },
    { href: "/cabinet?dialog=account", icon: User2, label: "Account" },
    { href: "/cabinet?dialog=settings", icon: Settings2, label: "Settings" },
  ],
  contact: {
    social: {
      GitHub: { name: "GitHub", url: "https://github.com/D4cLoves", icon: StatsIcons.github },
    },
  },
}

function StatisticsDock() {
  return (
    <div className="flex flex-col items-center justify-center">
      <TooltipProvider>
        <Dock
          direction="middle"
          iconSize={46}
          iconMagnification={66}
          iconDistance={155}
          className="h-[72px] gap-2.5 px-2.5"
        >
          {STATS_DOCK_DATA.navbar.map((item) => (
            <DockIcon key={item.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to={item.href}
                    aria-label={item.label}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-[3rem] rounded-full"
                    )}
                  >
                    <item.icon className="size-[18px]" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}

          <Separator orientation="vertical" className="h-full" />

          {Object.entries(STATS_DOCK_DATA.contact.social).map(([name, social]) => (
            <DockIcon key={name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={social.url}
                    aria-label={social.name}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-[3rem] rounded-full"
                    )}
                  >
                    <social.icon className="size-[18px]" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{name}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}

          <Separator orientation="vertical" className="h-full" />

          <DockIcon>
            <Tooltip>
              <TooltipTrigger asChild>
                <ThemeTogglerButton
                  variant="ghost"
                  size="sm"
                  direction="ltr"
                  modes={["light", "dark"]}
                  aria-label="Toggle theme"
                  className="size-[3rem] rounded-full"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Theme</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        </Dock>
      </TooltipProvider>
    </div>
  )
}

function HeroWidget({
  currentStreak,
  bestStreak,
  isCompletedToday,
  isBroken,
  statusLabel,
}: {
  currentStreak: number
  bestStreak: number
  isCompletedToday: boolean
  isBroken: boolean
  statusLabel: string
}) {
  const streakRatio = Math.min(100, Math.max(8, Math.round((currentStreak / Math.max(bestStreak, 1)) * 100)))

  return (
    <article className="group relative h-full overflow-hidden rounded-3xl border border-white/65 bg-gradient-to-br from-white/90 via-white/78 to-white/58 p-6 shadow-[0_28px_70px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-white/10 dark:from-white/[0.08] dark:via-white/[0.06] dark:to-white/[0.03]">
      <div
        className="pointer-events-none absolute -left-14 top-0 h-52 w-52 rounded-full blur-3xl transition-all duration-700"
        style={{
          background: isBroken
            ? "radial-gradient(circle, rgb(239 68 68 / 0.26), transparent 72%)"
            : "radial-gradient(circle, rgb(var(--cabinet-accent-rgb) / 0.38), transparent 72%)",
        }}
      />
      <div className="relative z-10 grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Daily momentum</p>
          <h2 className="mt-2 text-4xl font-semibold leading-tight md:text-5xl">
            {isBroken ? "Rebuild your cadence" : "Keep the loop alive"}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">{statusLabel}</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs shadow-sm transition-transform duration-300 group-hover:scale-105 dark:border-white/15 dark:bg-white/[0.06]">
            {isBroken ? (
              <AlertTriangle className="size-3.5 text-destructive" />
            ) : (
              <Flame className="size-3.5 text-[rgb(var(--cabinet-accent-rgb))]" />
            )}
            {isCompletedToday ? "Today is secured" : "Session needed today"}
          </div>
        </div>

        <div className="w-full max-w-[248px] rounded-2xl border border-white/65 bg-gradient-to-b from-white/85 to-white/65 p-4 shadow-[0_14px_34px_rgba(15,23,42,0.12)] dark:border-white/15 dark:from-white/[0.08] dark:to-white/[0.04]">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Current streak</p>
            <Flame className="size-4 text-[rgb(var(--cabinet-accent-rgb))]" />
          </div>

          <div className="mt-3 flex items-end gap-2">
            <p className="text-5xl font-semibold leading-none [font-variant-numeric:tabular-nums]">{currentStreak}</p>
            <p className="pb-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">days</p>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-300/35 dark:bg-white/12">
            <div
              className="h-full rounded-full"
              style={{
                width: `${streakRatio}%`,
                background:
                  "linear-gradient(90deg, rgb(var(--cabinet-accent-rgb) / 0.45), rgb(var(--cabinet-accent-rgb)))",
              }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Best</span>
            <span className="[font-variant-numeric:tabular-nums]">{bestStreak} days</span>
          </div>
        </div>
      </div>
    </article>
  )
}

function TopProductiveDays({
  items,
  rangeStart,
  rangeEnd,
}: {
  items: Array<{ dayKey: string; totalSeconds: number; sessionsCount: number }>
  rangeStart: string
  rangeEnd: string
}) {
  const maxSeconds = Math.max(...items.map((item) => item.totalSeconds), 1)
  const formattedRangeStart = formatLocalDate(rangeStart)
  const formattedRangeEnd = formatLocalDate(rangeEnd)

  return (
    <article className="rounded-3xl border border-white/60 bg-white/65 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.10)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.03]">
      <div className="mb-4">
        <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Top productive days</p>
        <h2 className="text-base font-semibold">Last 30 days</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {formattedRangeStart} - {formattedRangeEnd}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-white/60 bg-white/58 p-4 text-sm text-muted-foreground dark:border-white/10 dark:bg-white/[0.02]">
          No session activity in the last 30 days.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => {
            const date = new Date(`${item.dayKey}T00:00:00`)
            const label = Number.isNaN(date.getTime())
              ? item.dayKey
              : date.toLocaleDateString(undefined, {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
            return (
              <div
                key={item.dayKey}
                className="rounded-2xl border border-white/60 bg-white/58 p-3 dark:border-white/10 dark:bg-white/[0.02]"
              >
                <div className="mb-2 grid grid-cols-[26px_1fr_auto] items-center gap-3">
                  <p className="text-sm font-semibold text-muted-foreground">#{index + 1}</p>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{item.sessionsCount} session(s)</p>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-300/35 dark:bg-white/12">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(8, (item.totalSeconds / maxSeconds) * 100)}%`,
                      background:
                        "linear-gradient(90deg, rgb(var(--cabinet-accent-rgb) / 0.5), rgb(var(--cabinet-accent-rgb)))",
                    }}
                  />
                </div>
                <p className="mt-2 text-xs font-medium [font-variant-numeric:tabular-nums]">
                  {formatHoursMinutesSeconds(item.totalSeconds)}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </article>
  )
}

function CompactMetric({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <article className="h-full rounded-2xl border border-white/60 bg-white/65 p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03]">
      <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{title}</p>
      <p className="mt-2 text-2xl font-semibold [font-variant-numeric:tabular-nums]">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </article>
  )
}

function TopProjectsByTime({
  items,
}: {
  items: Array<{ projectName: string; totalSeconds: number; sessionsCount: number }>
}) {
  return (
    <article className="flex h-full min-h-0 flex-col rounded-3xl border border-white/60 bg-white/65 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.10)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.03]">
      <div className="mb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Top projects</p>
          <h3 className="text-base font-semibold">By focus time</h3>
        </div>
      </div>

      <div className="flex-1 space-y-3">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">No session data yet.</p>
        )}
        {items.map((item, index) => (
          <div
            key={`${item.projectName}-${index}`}
            className="grid grid-cols-[22px_1fr_auto] items-center gap-3 rounded-xl border border-white/55 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]"
          >
            <p className="text-xs font-semibold text-muted-foreground">#{index + 1}</p>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{item.projectName}</p>
              <p className="text-[11px] text-muted-foreground">{item.sessionsCount} session(s)</p>
            </div>
            <p className="text-sm font-semibold [font-variant-numeric:tabular-nums]">
              {formatHoursMinutesSeconds(item.totalSeconds)}
            </p>
          </div>
        ))}
      </div>
    </article>
  )
}

export function StatisticsPage() {
  const [streak, setStreak] = useState<StreakDto | null>(null)
  const [projects, setProjects] = useState<ProjectDto[]>([])
  const [sessions, setSessions] = useState<SessionDto[]>([])
  const [tieBreakSeed] = useState(() => Math.floor(Math.random() * 1_000_000_000))
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const [streakData, sessionsData, projectsData] = await Promise.all([
          getStreak(),
          getSessions(),
          getProjects(),
        ])
        if (!cancelled) {
          setStreak(streakData)
          setSessions(sessionsData)
          setProjects(projectsData)
          setError(null)
        }
      } catch (nextError) {
        if (!cancelled) {
          const message =
            nextError instanceof Error ? nextError.message : "Failed to load streak statistics"
          setError(message)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void load()
    const timer = window.setInterval(() => {
      void load()
    }, 60_000)

    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [])

  const currentStreak = streak?.currentStreak ?? 0
  const bestStreak = Math.max(streak?.bestStreak ?? 0, currentStreak)

  const statusLabel = useMemo(() => {
    if (!streak) return "Collecting streak status..."
    if (streak.isCompletedToday) return "Today completed. Streak is safe."
    if (streak.isBroken) return "Streak broken. Complete one session to restart."
    return "Today is still open. One session keeps the chain alive."
  }, [streak])

  const productive30 = useMemo(() => {
    const windowStart = addDays(new Date(), -29)
    windowStart.setHours(0, 0, 0, 0)
    const windowEnd = new Date()
    windowEnd.setHours(23, 59, 59, 999)
    const totals = new Map<string, { totalSeconds: number; sessionsCount: number }>()

    for (const session of sessions) {
      const started = new Date(session.startedAt)
      if (Number.isNaN(started.getTime())) continue
      if (started < windowStart) continue
      if (started > windowEnd) continue
      const key = formatDayKey(started)
      const seconds = parseDurationToSeconds(session.duration)
      const current = totals.get(key) ?? { totalSeconds: 0, sessionsCount: 0 }
      totals.set(key, {
        totalSeconds: current.totalSeconds + seconds,
        sessionsCount: current.sessionsCount + 1,
      })
    }

    const timeline = Array.from({ length: 30 }, (_, index) => {
      const day = addDays(windowStart, index)
      const key = formatDayKey(day)
      const aggregate = totals.get(key) ?? { totalSeconds: 0, sessionsCount: 0 }
      return {
        dayKey: key,
        totalSeconds: aggregate.totalSeconds,
        sessionsCount: aggregate.sessionsCount,
      }
    })

    const top = timeline
      .filter((item) => item.sessionsCount > 0)
      .map((item) => ({
        dayKey: item.dayKey,
        totalSeconds: item.totalSeconds,
        sessionsCount: item.sessionsCount,
      }))
      .sort((a, b) => {
        if (b.totalSeconds !== a.totalSeconds) return b.totalSeconds - a.totalSeconds
        if (b.sessionsCount !== a.sessionsCount) return b.sessionsCount - a.sessionsCount
        return b.dayKey.localeCompare(a.dayKey)
      })

    const topWithFallback = [...top.slice(0, 3)]
    const selectedKeys = new Set(topWithFallback.map((item) => item.dayKey))

    const totalsByDay = new Map(
      timeline.map((item) => [
        item.dayKey,
        { totalSeconds: item.totalSeconds, sessionsCount: item.sessionsCount },
      ])
    )

    const anchorDate =
      topWithFallback.length > 0
        ? new Date(`${topWithFallback[0].dayKey}T00:00:00`)
        : new Date(windowEnd.getFullYear(), windowEnd.getMonth(), windowEnd.getDate())

    let offset = 1
    while (topWithFallback.length < 3) {
      const fallbackDate = addDays(anchorDate, -offset)
      const fallbackKey = formatDayKey(fallbackDate)
      if (!selectedKeys.has(fallbackKey)) {
        const aggregate = totalsByDay.get(fallbackKey) ?? { totalSeconds: 0, sessionsCount: 0 }
        topWithFallback.push({
          dayKey: fallbackKey,
          totalSeconds: aggregate.totalSeconds,
          sessionsCount: aggregate.sessionsCount,
        })
        selectedKeys.add(fallbackKey)
      }
      offset += 1
    }

    return {
      timeline,
      top: topWithFallback,
      rangeStart: formatDayKey(windowStart),
      rangeEnd: formatDayKey(windowEnd),
    }
  }, [sessions])

  const topProductiveDays = useMemo(
    () =>
      productive30.top.map((item) => ({
        dayKey: item.dayKey,
        totalSeconds: item.totalSeconds,
        sessionsCount: item.sessionsCount,
      })),
    [productive30]
  )

  const topProjects = useMemo(() => {
    const totals = new Map<string, { totalSeconds: number; sessionsCount: number }>()

    for (const session of sessions) {
      const seconds = parseDurationToSeconds(session.duration)
      const current = totals.get(session.projectId) ?? { totalSeconds: 0, sessionsCount: 0 }
      totals.set(session.projectId, {
        totalSeconds: current.totalSeconds + seconds,
        sessionsCount: current.sessionsCount + 1,
      })
    }

    return projects
      .map((project) => {
        const aggregate = totals.get(project.id) ?? { totalSeconds: 0, sessionsCount: 0 }
        return {
          projectId: project.id,
          projectName: project.name,
          totalSeconds: aggregate.totalSeconds,
          sessionsCount: aggregate.sessionsCount,
        }
      })
      .sort((a, b) => {
        if (b.totalSeconds !== a.totalSeconds) return b.totalSeconds - a.totalSeconds
        if (b.sessionsCount !== a.sessionsCount) return b.sessionsCount - a.sessionsCount
        return seededProjectRank(a.projectId, tieBreakSeed) - seededProjectRank(b.projectId, tieBreakSeed)
      })
      .slice(0, Math.min(3, projects.length))
      .map(({ projectName, totalSeconds, sessionsCount }) => ({
        projectName,
        totalSeconds,
        sessionsCount,
      }))
  }, [projects, sessions, tieBreakSeed])

  return (
    <DashboardLayout>
      <div className="pointer-events-none fixed inset-x-0 bottom-[18px] z-50 flex justify-center px-4">
        <div className="pointer-events-auto">
          <StatisticsDock />
        </div>
      </div>
      <section>
        <div className="grid items-stretch gap-4 xl:grid-cols-2">
          {isLoading && (
            <div className="rounded-2xl border border-border bg-background/50 px-4 py-3 text-sm text-muted-foreground xl:col-span-2">
              Loading streak data...
            </div>
          )}

          {!isLoading && error && (
            <div className="rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive xl:col-span-2">
              {error}
            </div>
          )}

          {!isLoading && !error && (
            <>
              <HeroWidget
                currentStreak={currentStreak}
                bestStreak={bestStreak}
                isCompletedToday={streak?.isCompletedToday ?? false}
                isBroken={streak?.isBroken ?? false}
                statusLabel={statusLabel}
              />

              <div className="grid h-full gap-4 sm:grid-cols-2 xl:grid-cols-1 xl:grid-rows-2">
                <CompactMetric
                  title="Last activity"
                  value={formatLocalDate(streak?.lastActivityLocalDate)}
                  note="Last session checkpoint"
                />
                <CompactMetric
                  title="Next expected"
                  value={formatLocalDate(streak?.nextExpectedActivityDate)}
                  note="Keep sequence alive"
                />
              </div>

              <TopProductiveDays
                items={topProductiveDays}
                rangeStart={productive30.rangeStart}
                rangeEnd={productive30.rangeEnd}
              />

              <TopProjectsByTime items={topProjects} />
            </>
          )}
        </div>
      </section>
    </DashboardLayout>
  )
}
