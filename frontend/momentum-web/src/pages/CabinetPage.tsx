import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  HomeIcon,
  BarChart3,
  User2,
  Settings2,
  Sparkles,
  Play,
  Square,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  ACCENT_OPTIONS,
  DEFAULT_UI_SETTINGS,
  FONT_OPTIONS,
  applyUiSettings,
  loadUiSettings,
  saveUiSettings,
  type UiSettings,
} from "@/lib/ui-settings"
import { useAuthSession } from "@/auth/auth-session"
import { buttonVariants, Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/components/radix/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Dock, DockIcon } from "@/components/ui/dock"
import { ThemeTogglerButton } from "@/components/animate-ui/components/buttons/theme-toggler"
import {
  PlayfulTodolist,
  type PlayfulTodoItem,
} from "@/components/animate-ui/components/community/playful-todolist"
import { RadixFilesDemo } from "@/components/RadixFilesDemo"
import {
  getCurrentUserProfile,
  type CurrentUserProfileResponse,
  logoutUser,
} from "@/api/authApi"
import {
  createSessionTask,
  endSession,
  getAreas,
  getProjects,
  getSessions,
  startSession,
  updateSessionTaskStatus,
  type AreaDto,
  type ProjectDto,
  type SessionDto,
} from "@/api/cabinetApi"

type IconProps = React.HTMLAttributes<SVGElement>

type FocusedProject = {
  project: ProjectDto
  area: AreaDto | null
}

const Icons = {
  github: (props: IconProps) => (
    <svg viewBox="0 0 438.549 438.549" {...props}>
      <path
        fill="currentColor"
        d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
      />
    </svg>
  ),
}

const DATA = {
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/statistics", icon: BarChart3, label: "Statistics" },
    { href: "/account", icon: User2, label: "Account" },
    { href: "/settings", icon: Settings2, label: "Settings" },
  ],
  contact: {
    social: {
      GitHub: { name: "GitHub", url: "https://github.com/D4cLoves", icon: Icons.github },
    },
  },
}

function DockDemo({
  onAccountClick,
  onSettingsClick,
}: {
  onAccountClick: () => void
  onSettingsClick: () => void
}) {
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
          {DATA.navbar.map((item) => (
            <DockIcon key={item.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  {item.label === "Account" || item.label === "Settings" ? (
                    <button
                      type="button"
                      onClick={item.label === "Account" ? onAccountClick : onSettingsClick}
                      aria-label={item.label}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "size-[3rem] rounded-full"
                      )}
                    >
                      <item.icon className="size-[18px]" />
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      aria-label={item.label}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "size-[3rem] rounded-full"
                      )}
                    >
                      <item.icon className="size-[18px]" />
                    </a>
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}

          <Separator orientation="vertical" className="h-full" />

          {Object.entries(DATA.contact.social).map(([name, social]) => (
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
                  modes={['light', 'dark']}
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

function formatStartedAt(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString()
}

function formatElapsed(seconds: number) {
  const safe = Math.max(0, seconds)
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const secs = safe % 60

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`
}

export function CabinetPage() {
  const navigate = useNavigate()
  const { markGuest } = useAuthSession()
  const [areas, setAreas] = useState<AreaDto[]>([])
  const [projects, setProjects] = useState<ProjectDto[]>([])
  const [sessions, setSessions] = useState<SessionDto[]>([])
  const [isWorkspaceLoading, setIsWorkspaceLoading] = useState(true)
  const [workspaceError, setWorkspaceError] = useState<string | null>(null)
  const [focusedProjectId, setFocusedProjectId] = useState<string | null>(null)
  const [focusedAreaId, setFocusedAreaId] = useState<string | null>(null)
  const [isStartingSession, setIsStartingSession] = useState(false)
  const [sessionActionError, setSessionActionError] = useState<string | null>(null)
  const [isStartDialogOpen, setIsStartDialogOpen] = useState(false)
  const [startSessionTitle, setStartSessionTitle] = useState("")
  const [startSessionGoal, setStartSessionGoal] = useState("")
  const [sessionTaskDraft, setSessionTaskDraft] = useState("")
  const [, setIsSubmittingTask] = useState(false)
  const [isEndingSession, setIsEndingSession] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [accountActionError, setAccountActionError] = useState<string | null>(null)
  const [accountProfile, setAccountProfile] = useState<CurrentUserProfileResponse | null>(null)
  const [isAccountProfileLoading, setIsAccountProfileLoading] = useState(false)
  const [accountProfileError, setAccountProfileError] = useState<string | null>(null)
  const [uiSettings, setUiSettings] = useState<UiSettings>(() => loadUiSettings())

  useEffect(() => {
    applyUiSettings(uiSettings)
    saveUiSettings(uiSettings)
  }, [uiSettings])

  const loadWorkspace = useCallback(async ({ silent = false }: { silent?: boolean } = {}) => {
    if (!silent) {
      setIsWorkspaceLoading(true)
    }
    setWorkspaceError(null)
    try {
      const [nextAreas, nextProjects, nextSessions] = await Promise.all([
        getAreas(),
        getProjects(),
        getSessions(),
      ])
      setAreas(nextAreas)
      setProjects(nextProjects)
      setSessions(nextSessions)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load project workspace"
      setWorkspaceError(message)
    } finally {
      if (!silent) {
        setIsWorkspaceLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    void loadWorkspace()
  }, [loadWorkspace])

  const handleProjectFocus = useCallback((payload: FocusedProject | null) => {
    if (!payload) {
      // Ignore transient null focus events from tree rerenders to keep workspace context stable.
      return
    }

    setFocusedProjectId(payload.project.id)
    setFocusedAreaId(payload.area?.id ?? null)
  }, [])

  const focusedProject = useMemo(() => {
    const activeProjectId =
      sessions
        .filter((session) => session.isActive)
        .sort(
          (left, right) =>
            new Date(right.startedAt).getTime() - new Date(left.startedAt).getTime()
        )[0]?.projectId ?? null

    const effectiveProjectId = focusedProjectId ?? activeProjectId
    if (!effectiveProjectId) {
      return null
    }
    return projects.find((project) => project.id === effectiveProjectId) || null
  }, [focusedProjectId, projects, sessions])

  const focusedArea = useMemo(() => {
    if (focusedAreaId) {
      return areas.find((area) => area.id === focusedAreaId) || null
    }

    if (!focusedProject) {
      return null
    }
    return areas.find((area) => area.id === focusedProject.areaId) || null
  }, [areas, focusedAreaId, focusedProject])

  const projectSessions = useMemo(() => {
    if (!focusedProject) {
      return []
    }

    return sessions
      .filter((session) => session.projectId === focusedProject.id)
      .slice()
      .sort(
        (left, right) =>
          new Date(right.startedAt).getTime() - new Date(left.startedAt).getTime()
      )
  }, [focusedProject, sessions])

  const activeProjectSession = useMemo(
    () => projectSessions.find((session) => session.isActive) || null,
    [projectSessions]
  )

  const activeSession = useMemo(
    () =>
      sessions
        .filter((session) => session.isActive)
        .sort(
          (left, right) =>
            new Date(right.startedAt).getTime() - new Date(left.startedAt).getTime()
        )[0] ?? null,
    [sessions]
  )

  const workspaceSummary = useMemo(
    () => ({
      totalAreas: areas.length,
      totalProjects: projects.length,
      totalSessions: sessions.length,
    }),
    [areas.length, projects.length, sessions]
  )

  const activeAccent = useMemo(
    () => ACCENT_OPTIONS.find((option) => option.id === uiSettings.accentId) ?? ACCENT_OPTIONS[0],
    [uiSettings.accentId]
  )

  const loadAccountProfile = useCallback(async () => {
    setIsAccountProfileLoading(true)
    setAccountProfileError(null)
    try {
      const profile = await getCurrentUserProfile()
      setAccountProfile(profile)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Не удалось загрузить данные аккаунта"
      setAccountProfileError(message)
      setAccountProfile(null)
    } finally {
      setIsAccountProfileLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAccountDialogOpen) {
      void loadAccountProfile()
    }
  }, [isAccountDialogOpen, loadAccountProfile])

  const recentSessions = useMemo(() => projectSessions, [projectSessions])

  const sessionsLast7 = useMemo(() => {
    const threshold = Date.now() - 7 * 24 * 60 * 60 * 1000
    return projectSessions.filter(
      (session) => new Date(session.startedAt).getTime() >= threshold
    ).length
  }, [projectSessions])

  const activeDaysLast14 = useMemo(() => {
    const threshold = Date.now() - 14 * 24 * 60 * 60 * 1000
    const uniqueDays = new Set(
      projectSessions
        .filter((session) => new Date(session.startedAt).getTime() >= threshold)
        .map((session) => new Date(session.startedAt).toISOString().slice(0, 10))
    )
    return uniqueDays.size
  }, [projectSessions])

  const goalHours = useMemo(
    () => Math.max(1, focusedProject?.targetHours ?? 24),
    [focusedProject?.targetHours]
  )

  const demoElapsedHours = useMemo(() => {
    const modeled = sessionsLast7 * 1.6 + activeDaysLast14 * 0.7
    return Math.min(goalHours, Number(modeled.toFixed(1)))
  }, [activeDaysLast14, goalHours, sessionsLast7])

  const goalProgressPercent = useMemo(
    () => Math.min(100, Math.round((demoElapsedHours / goalHours) * 100)),
    [demoElapsedHours, goalHours]
  )

  const activeSessionTodoItems = useMemo<PlayfulTodoItem[]>(
    () =>
      (activeSession?.tasks ?? []).map((task) => ({
        id: task.id,
        label: task.description,
        isCompleted: task.isCompleted,
      })) ?? [],
    [activeSession]
  )

  useEffect(() => {
    if (!activeSession) {
      setElapsedSeconds(0)
      return
    }

    const update = () => {
      const started = new Date(activeSession.startedAt).getTime()
      if (Number.isNaN(started)) {
        setElapsedSeconds(0)
        return
      }

      setElapsedSeconds(Math.floor((Date.now() - started) / 1000))
    }

    update()
    const timer = window.setInterval(update, 1000)
    return () => window.clearInterval(timer)
  }, [activeSession])

  const openStartSessionDialog = useCallback(() => {
    if (!focusedProject) {
      return
    }

    setStartSessionTitle(
      focusedProject.primaryTask
        ? `Focus: ${focusedProject.primaryTask}`
        : `Focus: ${focusedProject.name}`
    )
    setStartSessionGoal(focusedProject.goal || `Advance ${focusedProject.name}`)
    setSessionActionError(null)
    setIsStartDialogOpen(true)
  }, [focusedProject])

  const handleStartSession = useCallback(async () => {
    if (!focusedProject) {
      return
    }

    const title = startSessionTitle.trim()
    if (!title) {
      setSessionActionError("Session title is required.")
      return
    }

    setSessionActionError(null)
    setIsStartingSession(true)
    try {
      const created = await startSession({
        projectId: focusedProject.id,
        title,
        goal: startSessionGoal.trim() || `Advance ${focusedProject.name}`,
      })
      const normalizedCreatedSession: SessionDto = {
        id: created.id,
        projectId: created.projectId,
        title: created.title,
        goal: created.goal,
        startedAt: created.startedAt,
        endedAt: null,
        duration: "00:00",
        notes: null,
        isActive: created.isActive,
        tasks: [],
      }
      setSessions((previous) => [
        normalizedCreatedSession,
        ...previous.filter((session) => session.id !== created.id),
      ])
      setFocusedProjectId(created.projectId)
      setIsStartDialogOpen(false)
      setSessionTaskDraft("")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to start a new session"
      setSessionActionError(message)
    } finally {
      setIsStartingSession(false)
    }
  }, [focusedProject, startSessionGoal, startSessionTitle])

  const handleCreateSessionTask = useCallback(async () => {
    if (!activeSession) {
      return
    }

    const description = sessionTaskDraft.trim()
    if (!description) {
      return
    }

    setIsSubmittingTask(true)
    setSessionActionError(null)
    try {
      const createdTask = await createSessionTask(activeSession.id, { description })
      setSessions((previous) =>
        previous.map((session) =>
          session.id === activeSession.id
            ? { ...session, tasks: [...(session.tasks ?? []), createdTask] }
            : session
        )
      )
      setSessionTaskDraft("")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to add session task"
      setSessionActionError(message)
    } finally {
      setIsSubmittingTask(false)
    }
  }, [activeSession, sessionTaskDraft])

  const handleToggleTask = useCallback(
    async (taskId: string, nextChecked: boolean) => {
      if (!activeSession) {
        return
      }

      setSessionActionError(null)
      try {
        const updatedTask = await updateSessionTaskStatus(activeSession.id, taskId, {
          isCompleted: nextChecked,
        })

        setSessions((previous) =>
          previous.map((session) =>
            session.id === activeSession.id
              ? {
                  ...session,
                  tasks: (session.tasks ?? []).map((task) =>
                    task.id === taskId ? updatedTask : task
                  ),
                }
              : session
          )
        )
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to update task status"
        setSessionActionError(message)
      }
    },
    [activeSession]
  )

  const handleEndSession = useCallback(async () => {
    if (!activeSession) {
      return
    }

    setSessionActionError(null)
    setIsEndingSession(true)
    try {
      const ended = await endSession(activeSession.id, { notes: null })
      setSessions((previous) =>
        previous.map((session) => (session.id === activeSession.id ? ended : session))
      )
      setSessionTaskDraft("")
      void loadWorkspace({ silent: true })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to end session"
      setSessionActionError(message)
    } finally {
      setIsEndingSession(false)
    }
  }, [activeSession, loadWorkspace])

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true)
    setAccountActionError(null)
    try {
      await logoutUser()
      markGuest()
      setIsAccountDialogOpen(false)
      navigate("/login")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Logout failed"
      setAccountActionError(message)
    } finally {
      setIsLoggingOut(false)
    }
  }, [markGuest, navigate])

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
      <div
        className={cn(
          "flex h-full min-h-0 flex-col transition-all duration-300",
          activeSession && "pointer-events-none blur-[12px]"
        )}
      >
        <div className="pointer-events-none fixed inset-x-0 bottom-[18px] z-50 flex justify-center px-4">
          <div className="pointer-events-auto">
            <DockDemo
              onAccountClick={() => {
                setAccountActionError(null)
                setAccountProfileError(null)
                setIsAccountDialogOpen(true)
              }}
              onSettingsClick={() => {
                setIsSettingsDialogOpen(true)
              }}
            />
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden px-3 pb-[40px] pt-3 md:pl-4 md:pr-2 md:pt-4">
          <div className="h-full w-full">
            <div className="grid h-full min-h-0 grid-cols-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
              <div className="flex min-h-0 w-full flex-col gap-4">
              <section className="supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 flex h-[390px] flex-none flex-col rounded-2xl border shadow-sm backdrop-blur-md">
                <div className="border-b border-border px-4 py-3">
                  <p className="text-center text-sm font-semibold">Focus Summary</p>
                </div>

                <div className="grid h-full grid-rows-[auto_1fr_auto] gap-4 p-4">
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/25 px-3 py-2.5">
                    <div className="flex size-8 items-center justify-center rounded-full border border-border bg-card text-xs font-semibold">
                      VL
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">Welcome back, Vlad</p>
                      <p className="truncate text-xs text-muted-foreground">
                        Pick a project from the tree to inspect details.
                      </p>
                    </div>
                  </div>

                  <div className="flex min-h-0 flex-col items-center justify-center rounded-xl border border-border bg-muted/40 px-3 py-4 text-center">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Today Focus</p>
                    <p className="mt-2 text-[clamp(32px,3.4vw,52px)] font-semibold leading-none [font-variant-numeric:tabular-nums]">1h 34m</p>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/25 px-3 py-2">
                    <p className="text-[11px] text-muted-foreground">Streak</p>
                    <p className="text-sm font-medium">4 days</p>
                  </div>
                </div>
              </section>

              <div className="min-h-0 flex-1">
                <RadixFilesDemo
                  onProjectFocus={handleProjectFocus}
                  onTreeMutated={() => {
                    void loadWorkspace()
                  }}
                />
              </div>
            </div>

            <section className="supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 flex min-h-[420px] min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border shadow-sm backdrop-blur-md lg:min-h-0">
              <div className="flex justify-center border-b border-border px-4 py-3">
                <p className="text-sm font-semibold">Project Workspace</p>
              </div>

              <div className="flex min-h-0 flex-1 flex-col gap-4 p-4">
                {workspaceError && (
                  <div className="rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    {workspaceError}
                  </div>
                )}

                {!workspaceError && isWorkspaceLoading && (
                  <div className="rounded-xl border border-border bg-background/70 px-4 py-3 text-sm text-muted-foreground">
                    Loading project workspace...
                  </div>
                )}

                {!workspaceError && !isWorkspaceLoading && !focusedProject && (
                  <article className="grid min-h-0 flex-1 place-items-center rounded-xl border border-border bg-muted/25 p-8 text-center">
                    <div className="mx-auto w-full max-w-xl">
                      <Sparkles className="mx-auto size-6 text-muted-foreground" />
                      <h3 className="mt-3 text-lg font-semibold">Project Details Panel</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Right-click a project in the files tree, or open its menu and press
                        <span className="font-medium text-foreground"> Properties</span>.
                        The focused project details will appear here.
                      </p>
                    </div>
                  </article>
                )}

                {!workspaceError && !isWorkspaceLoading && focusedProject && (
                  <div className="grid h-full min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] xl:grid-rows-[auto_minmax(0,1fr)_minmax(0,1fr)]">
                      <article className="rounded-xl border border-border bg-muted/25 p-4">
                        <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                          Focused Project
                        </p>
                        <h3 className="mt-1 text-xl font-semibold">{focusedProject.name}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {focusedArea ? focusedArea.name : "Area not found"}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                          {focusedProject.goal}
                        </p>

                        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                          <div className="rounded-lg border border-border bg-background/70 px-3 py-2">
                            <p className="text-[11px] text-muted-foreground">Primary Task</p>
                            <p className="mt-1 line-clamp-2 text-sm font-medium">
                              {focusedProject.primaryTask || "Not set"}
                            </p>
                          </div>
                          <div className="rounded-lg border border-border bg-background/70 px-3 py-2">
                            <p className="text-[11px] text-muted-foreground">Target Hours</p>
                            <p className="mt-1 text-sm font-medium">
                              {focusedProject.targetHours !== null
                                ? `${focusedProject.targetHours}h`
                                : "Not set"}
                            </p>
                          </div>
                          <div className="rounded-lg border border-border bg-background/70 px-3 py-2">
                            <p className="text-[11px] text-muted-foreground">Sessions</p>
                            <p className="mt-1 text-sm font-medium">{focusedProject.sessionsCount}</p>
                          </div>
                          <div className="rounded-lg border border-border bg-background/70 px-3 py-2">
                            <p className="text-[11px] text-muted-foreground">State</p>
                            <p className="mt-1 text-sm font-medium">
                              {activeProjectSession
                                ? "Active session"
                                : "Ready to launch"}
                            </p>
                          </div>
                        </div>
                      </article>

                      <article className="overflow-hidden rounded-xl border border-border bg-muted/25">
                        <div className="flex justify-center border-b border-border px-4 py-3">
                          <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                            Goal Time Slider
                          </p>
                        </div>
                        <div className="p-4">
                          <div className="rounded-lg border border-border bg-background/70 px-4 py-4">
                          <div className="h-3 w-full overflow-hidden rounded-full bg-muted/70">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${goalProgressPercent}%`,
                                background:
                                  "linear-gradient(90deg, rgb(var(--cabinet-accent-rgb) / 0.72), rgb(var(--cabinet-accent-rgb)), rgb(var(--cabinet-accent-rgb) / 0.82))",
                                boxShadow: "0 0 18px rgb(var(--cabinet-accent-rgb) / 0.5)",
                              }}
                            />
                          </div>
                          <div className="mt-4 flex items-end justify-between">
                            <p className="text-3xl font-semibold leading-none [font-variant-numeric:tabular-nums]">
                              {goalProgressPercent}%
                            </p>
                            <p className="text-sm font-medium [font-variant-numeric:tabular-nums]">
                              {demoElapsedHours}h / {goalHours}h
                            </p>
                          </div>
                        </div>
                        </div>
                      </article>

                      <article className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-muted/25 p-5 xl:row-span-2">
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,hsl(var(--primary)/0.18),transparent_42%),radial-gradient(circle_at_88%_82%,hsl(var(--primary)/0.12),transparent_44%)]" />
                        <div className="relative z-10 flex h-full flex-col">
                          <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                            Session Command Deck
                          </p>
                          <h4 className="mt-2 text-2xl font-semibold leading-tight">
                            Ready to lock in a focused sprint?
                          </h4>
                          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                            One clean start. One concrete goal. No context-switch circus.
                            Launch a session and push the project forward.
                          </p>

                          {activeSession ? (
                            <div
                              className="mt-4 rounded-xl border border-border bg-background/70 px-4 py-3 text-sm text-muted-foreground"
                              style={{
                                borderColor: "rgb(var(--cabinet-accent-rgb) / 0.45)",
                                boxShadow: "0 0 0 1px rgb(var(--cabinet-accent-rgb) / 0.16) inset",
                              }}
                            >
                              Active now: <span className="font-medium text-foreground">{activeSession.title || "Untitled session"}</span>
                            </div>
                          ) : null}
                          {sessionActionError ? (
                            <div className="mt-4 rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                              {sessionActionError}
                            </div>
                          ) : null}

                          <div className="mt-5 flex flex-1 items-center justify-center">
                            <Button
                              className="h-24 w-full max-w-2xl rounded-full border border-primary/30 bg-primary text-primary-foreground text-xl font-semibold shadow-[0_14px_34px_hsl(var(--primary)/0.45)] transition-all hover:scale-[1.01] hover:shadow-[0_18px_40px_hsl(var(--primary)/0.55)]"
                              onClick={() => {
                                openStartSessionDialog()
                              }}
                              disabled={isStartingSession || !!activeSession}
                            >
                              <Play className="mr-3 size-5" />
                              {isStartingSession ? "Starting Session..." : "Start Focus Session"}
                            </Button>
                          </div>

                          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
                            <span className="rounded-full border border-border bg-background/70 px-3 py-1">
                              Deep work mode
                            </span>
                            <span className="rounded-full border border-border bg-background/70 px-3 py-1">
                              Single objective per launch
                            </span>
                            <span className="rounded-full border border-border bg-background/70 px-3 py-1">
                              Zero distractions
                            </span>
                          </div>
                        </div>
                      </article>

                      <article className="overflow-hidden rounded-xl border border-border bg-muted/25">
                        <div className="flex justify-center border-b border-border px-4 py-3">
                          <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                            Project Snapshot
                          </p>
                        </div>
                        <div className="space-y-2 p-4">
                          <div className="rounded-lg border border-border bg-background/70 px-3 py-2">
                            <p className="text-[11px] text-muted-foreground">Last Start</p>
                            <p className="mt-1 text-sm font-medium">
                              {projectSessions[0]
                                ? formatStartedAt(projectSessions[0].startedAt)
                                : "None"}
                            </p>
                          </div>
                          <div className="rounded-lg border border-border bg-background/70 px-3 py-2">
                            <p className="text-[11px] text-muted-foreground">Goal Summary</p>
                            <p className="mt-1 line-clamp-3 text-sm font-medium">
                              {focusedProject.goal || "No goal set"}
                            </p>
                          </div>
                        </div>
                      </article>

                      <article className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-muted/25">
                        <div className="flex justify-center border-b border-border px-4 py-3">
                          <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                            Activity Feed
                          </p>
                        </div>
                        <div className="min-h-0 flex-1 space-y-2 overflow-auto p-4 pr-3">
                          {recentSessions.length === 0 ? (
                            <div className="rounded-lg border border-border bg-background/70 px-3 py-2 text-sm text-muted-foreground">
                              No recent sessions.
                            </div>
                          ) : (
                            recentSessions.map((session) => (
                              <div
                                key={session.id}
                                className="rounded-lg border border-border bg-background/75 px-3 py-2"
                              >
                                <p className="truncate text-sm font-medium">
                                  {session.title || "Untitled session"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatStartedAt(session.startedAt)}
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      </article>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
      </div>

      <Dialog
        open={isAccountDialogOpen}
        onOpenChange={(nextOpen: boolean) => {
          setIsAccountDialogOpen(nextOpen)
          if (!nextOpen) {
            setAccountActionError(null)
            setAccountProfileError(null)
          }
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-hidden sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Аккаунт</DialogTitle>
            <DialogDescription>
              Информация о проекте и управление текущей сессией аккаунта.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 overflow-y-auto pr-1">
            <section className="rounded-xl border border-border bg-muted/25 p-4">
              <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                Данные аккаунта
              </p>
              {isAccountProfileLoading ? (
                <div className="mt-3 rounded-lg border border-border bg-background/70 px-3 py-2 text-sm text-muted-foreground">
                  Загружаем данные аккаунта...
                </div>
              ) : null}
              {accountProfileError ? (
                <div className="mt-3 rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                  {accountProfileError}
                </div>
              ) : null}
              {!isAccountProfileLoading && !accountProfileError ? (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-lg border border-border bg-background/70 px-3 py-2">
                    <p className="text-[11px] text-muted-foreground">Имя</p>
                    <p className="mt-1 text-sm font-medium">
                      {accountProfile?.name || "Не указано"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-background/70 px-3 py-2">
                    <p className="text-[11px] text-muted-foreground">Почта</p>
                    <p className="mt-1 text-sm font-medium">
                      {accountProfile?.email || "Не указана"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-background/70 px-3 py-2">
                    <p className="text-[11px] text-muted-foreground">Пароль</p>
                    <p className="mt-1 text-sm font-medium">••••••••</p>
                  </div>
                  <div className="rounded-lg border border-border bg-background/70 px-3 py-2">
                    <p className="text-[11px] text-muted-foreground">Статус безопасности</p>
                    <p className="mt-1 text-sm font-medium">Пароль скрыт сервером</p>
                  </div>
                </div>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAccountDialogOpen(false)
                    setAccountActionError(null)
                    navigate("/recover-code")
                  }}
                >
                  Сменить пароль
                </Button>
                <Button variant="outline" disabled>
                  Редактировать профиль (скоро)
                </Button>
              </div>
            </section>

            <section className="rounded-xl border border-border bg-muted/25 p-4">
              <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                Статистика workspace
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-background/70 px-3 py-2">
                  <p className="text-[11px] text-muted-foreground">Областей</p>
                  <p className="mt-1 text-sm font-medium">{workspaceSummary.totalAreas}</p>
                </div>
                <div className="rounded-lg border border-border bg-background/70 px-3 py-2">
                  <p className="text-[11px] text-muted-foreground">Проектов</p>
                  <p className="mt-1 text-sm font-medium">{workspaceSummary.totalProjects}</p>
                </div>
                <div className="rounded-lg border border-border bg-background/70 px-3 py-2">
                  <p className="text-[11px] text-muted-foreground">Сессий</p>
                  <p className="mt-1 text-sm font-medium">{workspaceSummary.totalSessions}</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-border bg-muted/25 p-4">
              <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                Фокус-проект
              </p>
              {!focusedProject ? (
                <div className="mt-3 rounded-lg border border-border bg-background/70 px-3 py-2 text-sm text-muted-foreground">
                  Выбери проект в дереве workspace, чтобы увидеть его детали здесь.
                </div>
              ) : (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-lg border border-border bg-background/70 px-3 py-2">
                    <p className="text-[11px] text-muted-foreground">Название</p>
                    <p className="mt-1 text-sm font-medium">{focusedProject.name}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-background/70 px-3 py-2">
                    <p className="text-[11px] text-muted-foreground">Область</p>
                    <p className="mt-1 text-sm font-medium">
                      {focusedArea ? focusedArea.name : "Area not found"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-background/70 px-3 py-2">
                    <p className="text-[11px] text-muted-foreground">Основная задача</p>
                    <p className="mt-1 line-clamp-2 text-sm font-medium">
                      {focusedProject.primaryTask || "Не задано"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-background/70 px-3 py-2">
                    <p className="text-[11px] text-muted-foreground">Целевые часы</p>
                    <p className="mt-1 text-sm font-medium">
                      {focusedProject.targetHours !== null
                        ? `${focusedProject.targetHours}h`
                        : "Не задано"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-background/70 px-3 py-2 sm:col-span-2">
                    <p className="text-[11px] text-muted-foreground">Цель</p>
                    <p className="mt-1 break-words text-sm font-medium">
                      {focusedProject.goal || "Цель не задана"}
                    </p>
                  </div>
                </div>
              )}
            </section>
          </div>
          {accountActionError ? (
            <p className="text-xs text-destructive">{accountActionError}</p>
          ) : null}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAccountDialogOpen(false)}
              disabled={isLoggingOut}
            >
              Закрыть
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                void handleLogout()
              }}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Выходим..." : "Выйти"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isSettingsDialogOpen}
        onOpenChange={(nextOpen: boolean) => {
          setIsSettingsDialogOpen(nextOpen)
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-hidden sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Visual preferences for typography, scale, and accent tone.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 overflow-y-auto pr-1">
            <section className="rounded-xl border border-border bg-muted/25 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  Font Family
                </p>
                <span className="text-xs text-muted-foreground">10 presets</span>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {FONT_OPTIONS.map((font) => {
                  const isSelected = uiSettings.fontId === font.id
                  return (
                    <button
                      key={font.id}
                      type="button"
                      onClick={() => {
                        setUiSettings((previous) => ({ ...previous, fontId: font.id }))
                      }}
                      className={cn(
                        "rounded-lg border bg-background/80 px-3 py-2 text-left transition-all hover:bg-background",
                        isSelected ? "text-foreground" : "text-muted-foreground"
                      )}
                      style={{
                        fontFamily: font.family,
                        borderColor: isSelected
                          ? "rgb(var(--cabinet-accent-rgb) / 0.55)"
                          : undefined,
                        boxShadow: isSelected
                          ? "0 0 0 1px rgb(var(--cabinet-accent-rgb) / 0.2) inset"
                          : undefined,
                      }}
                    >
                      <p className="text-sm font-semibold">{font.label}</p>
                      <p className="mt-1 text-xs">{font.preview}</p>
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="rounded-xl border border-border bg-muted/25 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  Font Size
                </p>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "rgb(var(--cabinet-accent-rgb))" }}
                >
                  {uiSettings.fontScale}%
                </span>
              </div>

              <div className="mt-4">
                <input
                  type="range"
                  min={85}
                  max={125}
                  step={1}
                  value={uiSettings.fontScale}
                  onChange={(event) => {
                    const next = Number(event.target.value)
                    setUiSettings((previous) => ({ ...previous, fontScale: next }))
                  }}
                  className="h-2 w-full cursor-pointer rounded-lg bg-muted/70"
                  style={{ accentColor: `rgb(${activeAccent.rgb})` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>85%</span>
                <span>100%</span>
                <span>125%</span>
              </div>
            </section>

            <section className="rounded-xl border border-border bg-muted/25 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  Accent Color
                </p>
                <span className="text-xs text-muted-foreground">UI highlight tone</span>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {ACCENT_OPTIONS.map((option) => {
                  const isSelected = uiSettings.accentId === option.id
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setUiSettings((previous) => ({ ...previous, accentId: option.id }))
                      }}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border bg-background/80 px-3 py-2 text-left transition-all hover:bg-background",
                        isSelected ? "text-foreground" : "text-muted-foreground"
                      )}
                      style={{
                        borderColor: isSelected
                          ? "rgb(var(--cabinet-accent-rgb) / 0.55)"
                          : undefined,
                        boxShadow: isSelected
                          ? "0 0 0 1px rgb(var(--cabinet-accent-rgb) / 0.2) inset"
                          : undefined,
                      }}
                    >
                      <span
                        className="size-4 rounded-full border border-black/10 dark:border-white/15"
                        style={{ backgroundColor: `rgb(${option.rgb})` }}
                      />
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  )
                })}
              </div>
            </section>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUiSettings(DEFAULT_UI_SETTINGS)}
            >
              Reset defaults
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsSettingsDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isStartDialogOpen}
        onOpenChange={(nextOpen: boolean) => {
          setIsStartDialogOpen(nextOpen)
          if (!nextOpen) {
            setSessionActionError(null)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Session</DialogTitle>
            <DialogDescription>
              Enter session title before launch.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <label className="text-xs text-muted-foreground">Title</label>
              <Input
                value={startSessionTitle}
                onChange={(event) => setStartSessionTitle(event.target.value)}
                placeholder="Focus: Feature implementation"
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-xs text-muted-foreground">Goal</label>
              <Input
                value={startSessionGoal}
                onChange={(event) => setStartSessionGoal(event.target.value)}
                placeholder="What should be done in this session?"
              />
            </div>
            {sessionActionError ? (
              <p className="text-xs text-destructive">{sessionActionError}</p>
            ) : null}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStartDialogOpen(false)}
              disabled={isStartingSession}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                void handleStartSession()
              }}
              disabled={isStartingSession}
            >
              {isStartingSession ? "Starting..." : "Start"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {activeSession ? (
        <div className="absolute inset-0 z-[70] flex items-center justify-center bg-background/35 p-6">
          <div className="flex h-[min(84vh,860px)] w-full max-w-7xl flex-col p-2">
            <section className="flex flex-col items-center">
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Live Session
              </p>
              <h3 className="mt-2 text-center text-3xl font-semibold">
                {activeSession.title || "Untitled session"}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Started at {formatStartedAt(activeSession.startedAt)}
              </p>
            </section>

            <div className="relative mt-4 min-h-0 flex-1">
              <section className="flex min-h-[280px] flex-col items-center justify-center md:absolute md:left-1/2 md:top-1/2 md:min-h-0 md:-translate-x-1/2 md:-translate-y-1/2">
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Elapsed
                </p>
                <p className="mt-3 text-[clamp(72px,10vw,150px)] font-semibold leading-none [font-variant-numeric:tabular-nums]">
                  {formatElapsed(elapsedSeconds)}
                </p>
              </section>

              <section className="w-full md:absolute md:top-0 md:w-[min(340px,28vw)] lg:-right-10 xl:-right-16">
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Session Tasks
                </p>
                <div className="mt-3">
                  <Input
                    className="rounded-xl"
                    value={sessionTaskDraft}
                    onChange={(event) => setSessionTaskDraft(event.target.value)}
                    placeholder="Add task for current session..."
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault()
                        void handleCreateSessionTask()
                      }
                    }}
                  />
                </div>

                <div className="mt-3 max-h-[44vh] overflow-auto md:max-h-[48vh]">
                  <PlayfulTodolist
                    items={activeSessionTodoItems}
                    onToggle={(id, nextChecked) => {
                      void handleToggleTask(id, nextChecked)
                    }}
                    emptyMessage="Session started with an empty list. Add your first task."
                    showDividers={false}
                    className="h-full !rounded-none !bg-transparent !p-0 dark:!bg-transparent"
                  />
                </div>
              </section>
            </div>

            <section className="flex justify-center">
              <Button
                variant="destructive"
                className="min-w-[240px] rounded-2xl"
                onClick={() => {
                  void handleEndSession()
                }}
                disabled={isEndingSession}
              >
                <Square className="mr-2 size-4" />
                {isEndingSession ? "Ending session..." : "Finish Session"}
              </Button>
            </section>
          </div>
        </div>
      ) : null}
    </div>
  )
}
