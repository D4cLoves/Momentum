import * as React from "react"
import {
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock3,
  Folder,
  FolderPlus,
  Layers3,
  Pencil,
  PlayCircle,
  Plus,
  RefreshCw,
  StopCircle,
  Trash2,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import {
  createArea,
  createProject,
  createSessionTask,
  deleteArea,
  deleteProject,
  deleteSession,
  deleteSessionTask,
  endSession,
  startSession,
  updateAreaName,
  updateProject,
  updateSessionTaskStatus,
} from "@/features/cabinet/api/cabinet-api"
import { ConfirmActionModal } from "@/features/cabinet/components/confirm-action-modal"
import { ModalShell } from "@/features/cabinet/components/modal-shell"
import { useCabinetData } from "@/features/cabinet/model/cabinet-data-context"
import type { AreaDto, ProjectDto, SessionDto } from "@/features/cabinet/model/cabinet-types"
import { ApiError } from "@/shared/api/http-client"
import { formatMinutes, parseDurationToMinutes } from "@/shared/lib/time"

type AreaModalState =
  | {
      mode: "create"
    }
  | {
      mode: "edit"
      area: AreaDto
    }
  | null

type ProjectModalState =
  | {
      mode: "create"
      areaId: string | null
    }
  | {
      mode: "edit"
      project: ProjectDto
    }
  | null

type SessionStartModalState =
  | {
      project: ProjectDto
    }
  | null

type SessionEndModalState =
  | {
      session: SessionDto
    }
  | null

type SessionTaskModalState =
  | {
      session: SessionDto
    }
  | null

type ConfirmActionState = {
  title: string
  description: string
  confirmLabel: string
  actionKey: string
  successText: string
  action: () => Promise<unknown>
}

type MutationConfig = {
  actionKey: string
  action: () => Promise<unknown>
  successText?: string
  onDone?: () => void
}

function formatTimestamp(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return "Unknown"
  }

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function toMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message
  }

  return "Operation failed. Check backend logs and try again."
}

function LoadingBoard() {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="panel-surface space-y-3 p-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ))}
    </div>
  )
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border/70 bg-background/45 px-4 py-6 text-center">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-xs leading-6 text-muted-foreground">{text}</p>
    </div>
  )
}

type AreaFormModalProps = {
  state: AreaModalState
  onClose: () => void
  onSubmit: (name: string) => Promise<void>
  isSubmitting: boolean
}

function AreaFormModal({ state, onClose, onSubmit, isSubmitting }: AreaFormModalProps) {
  const [name, setName] = React.useState("")

  React.useEffect(() => {
    if (!state) {
      return
    }

    if (state.mode === "create") {
      setName("")
      return
    }

    setName(state.area.name)
  }, [state])

  if (!state) {
    return null
  }

  const isEdit = state.mode === "edit"

  return (
    <ModalShell
      open
      onClose={onClose}
      title={isEdit ? "Edit area" : "Create area"}
      subtitle="Top-level folder for projects."
      className="max-w-lg"
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          void onSubmit(name)
        }}
      >
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Area name
          </span>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Deep work"
            minLength={2}
            maxLength={100}
            required
          />
        </label>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEdit ? "Save area" : "Create area"}
          </Button>
        </div>
      </form>
    </ModalShell>
  )
}

type ProjectFormModalProps = {
  state: ProjectModalState
  areas: AreaDto[]
  onClose: () => void
  onSubmit: (payload: {
    areaId: string
    name: string
    goal: string
    primaryTask: string
    targetHours: string
    notes: string
  }) => Promise<void>
  isSubmitting: boolean
}

function ProjectFormModal({
  state,
  areas,
  onClose,
  onSubmit,
  isSubmitting,
}: ProjectFormModalProps) {
  const [areaId, setAreaId] = React.useState("")
  const [name, setName] = React.useState("")
  const [goal, setGoal] = React.useState("")
  const [primaryTask, setPrimaryTask] = React.useState("")
  const [targetHours, setTargetHours] = React.useState("")
  const [notes, setNotes] = React.useState("")

  React.useEffect(() => {
    if (!state) {
      return
    }

    if (state.mode === "create") {
      setAreaId(state.areaId || areas[0]?.id || "")
      setName("")
      setGoal("")
      setPrimaryTask("")
      setTargetHours("")
      setNotes("")
      return
    }

    setAreaId(state.project.areaId)
    setName(state.project.name)
    setGoal(state.project.goal)
    setPrimaryTask(state.project.primaryTask || "")
    setTargetHours(state.project.targetHours ? String(state.project.targetHours) : "")
    setNotes(state.project.notes || "")
  }, [state, areas])

  if (!state) {
    return null
  }

  const isEdit = state.mode === "edit"

  return (
    <ModalShell
      open
      onClose={onClose}
      title={isEdit ? "Edit project" : "Create project"}
      subtitle="Main execution unit connected to sessions."
      className="max-w-2xl"
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          void onSubmit({ areaId, name, goal, primaryTask, targetHours, notes })
        }}
      >
        {!isEdit && (
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Area
            </span>
            <select
              className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring"
              value={areaId}
              onChange={(event) => setAreaId(event.target.value)}
              required
            >
              <option value="" disabled>
                Select area
              </option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Name
            </span>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              minLength={2}
              maxLength={100}
              required
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Target hours
            </span>
            <Input
              value={targetHours}
              onChange={(event) => setTargetHours(event.target.value)}
              type="number"
              min={1}
              max={10000}
              placeholder="Optional"
            />
          </label>
        </div>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Goal
          </span>
          <Textarea
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
            minLength={2}
            maxLength={100}
            required
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Primary task
          </span>
          <Input
            value={primaryTask}
            onChange={(event) => setPrimaryTask(event.target.value)}
            placeholder="Optional"
            maxLength={100}
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Notes
          </span>
          <Textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Optional"
            maxLength={10000}
          />
        </label>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEdit ? "Save project" : "Create project"}
          </Button>
        </div>
      </form>
    </ModalShell>
  )
}

type SessionStartModalProps = {
  state: SessionStartModalState
  onClose: () => void
  onSubmit: (payload: { title: string; goal: string }) => Promise<void>
  isSubmitting: boolean
}

function SessionStartModal({ state, onClose, onSubmit, isSubmitting }: SessionStartModalProps) {
  const [title, setTitle] = React.useState("")
  const [goal, setGoal] = React.useState("")

  React.useEffect(() => {
    if (!state) {
      return
    }

    setTitle(state.project.name)
    setGoal(state.project.goal)
  }, [state])

  if (!state) {
    return null
  }

  return (
    <ModalShell
      open
      onClose={onClose}
      title="Start session"
      subtitle={`Project: ${state.project.name}`}
      className="max-w-xl"
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          void onSubmit({ title, goal })
        }}
      >
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Session title
          </span>
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            minLength={2}
            maxLength={100}
            required
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Session goal
          </span>
          <Textarea
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
            minLength={2}
            maxLength={100}
            required
          />
        </label>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Starting..." : "Start session"}
          </Button>
        </div>
      </form>
    </ModalShell>
  )
}

type SessionEndModalProps = {
  state: SessionEndModalState
  onClose: () => void
  onSubmit: (notes: string) => Promise<void>
  isSubmitting: boolean
}

function SessionEndModal({ state, onClose, onSubmit, isSubmitting }: SessionEndModalProps) {
  const [notes, setNotes] = React.useState("")

  React.useEffect(() => {
    if (!state) {
      return
    }

    setNotes(state.session.notes || "")
  }, [state])

  if (!state) {
    return null
  }

  return (
    <ModalShell
      open
      onClose={onClose}
      title="Finish session"
      subtitle="Add final notes before stopping this run."
      className="max-w-xl"
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          void onSubmit(notes)
        }}
      >
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Notes
          </span>
          <Textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            maxLength={10000}
            placeholder="Optional"
          />
        </label>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Ending..." : "End session"}
          </Button>
        </div>
      </form>
    </ModalShell>
  )
}

type SessionTaskModalProps = {
  state: SessionTaskModalState
  onClose: () => void
  onSubmit: (description: string) => Promise<void>
  isSubmitting: boolean
}

function SessionTaskModal({ state, onClose, onSubmit, isSubmitting }: SessionTaskModalProps) {
  const [description, setDescription] = React.useState("")

  React.useEffect(() => {
    if (!state) {
      return
    }

    setDescription("")
  }, [state])

  if (!state) {
    return null
  }

  return (
    <ModalShell
      open
      onClose={onClose}
      title="Add session task"
      subtitle="Track the exact step inside this run."
      className="max-w-lg"
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          void onSubmit(description)
        }}
      >
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Task description
          </span>
          <Input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            minLength={2}
            maxLength={100}
            placeholder="Implement auth refresh endpoint"
            required
          />
        </label>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add task"}
          </Button>
        </div>
      </form>
    </ModalShell>
  )
}

export function CabinetOverviewPage() {
  const { areas, projects, sessions, isLoading, isRefreshing, error, refresh } = useCabinetData()

  const [selectedAreaId, setSelectedAreaId] = React.useState<string | null>(null)
  const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(null)
  const [expandedSessionId, setExpandedSessionId] = React.useState<string | null>(null)

  const [areaModalState, setAreaModalState] = React.useState<AreaModalState>(null)
  const [projectModalState, setProjectModalState] = React.useState<ProjectModalState>(null)
  const [sessionStartModalState, setSessionStartModalState] =
    React.useState<SessionStartModalState>(null)
  const [sessionEndModalState, setSessionEndModalState] =
    React.useState<SessionEndModalState>(null)
  const [sessionTaskModalState, setSessionTaskModalState] =
    React.useState<SessionTaskModalState>(null)
  const [confirmActionState, setConfirmActionState] = React.useState<ConfirmActionState | null>(
    null
  )

  const [busyAction, setBusyAction] = React.useState<string | null>(null)
  const [actionError, setActionError] = React.useState<string | null>(null)
  const [notice, setNotice] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (areas.length === 0) {
      if (selectedAreaId !== null) {
        setSelectedAreaId(null)
      }
      return
    }

    if (selectedAreaId && areas.some((area) => area.id === selectedAreaId)) {
      return
    }

    setSelectedAreaId(areas[0].id)
  }, [areas, selectedAreaId])

  const areaProjects = React.useMemo(() => {
    if (!selectedAreaId) {
      return []
    }

    return projects.filter((project) => project.areaId === selectedAreaId)
  }, [projects, selectedAreaId])

  React.useEffect(() => {
    if (areaProjects.length === 0) {
      if (selectedProjectId !== null) {
        setSelectedProjectId(null)
      }
      return
    }

    if (selectedProjectId && areaProjects.some((project) => project.id === selectedProjectId)) {
      return
    }

    setSelectedProjectId(areaProjects[0].id)
  }, [areaProjects, selectedProjectId])

  const selectedArea = React.useMemo(
    () => areas.find((area) => area.id === selectedAreaId) || null,
    [areas, selectedAreaId]
  )

  const selectedProject = React.useMemo(
    () => projects.find((project) => project.id === selectedProjectId) || null,
    [projects, selectedProjectId]
  )

  const sessionsForProject = React.useMemo(() => {
    if (!selectedProjectId) {
      return []
    }

    return sessions
      .filter((session) => session.projectId === selectedProjectId)
      .slice()
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
  }, [sessions, selectedProjectId])

  React.useEffect(() => {
    if (!expandedSessionId) {
      return
    }

    if (sessionsForProject.some((session) => session.id === expandedSessionId)) {
      return
    }

    setExpandedSessionId(null)
  }, [sessionsForProject, expandedSessionId])

  const totalFocusMinutes = React.useMemo(
    () => sessions.reduce((sum, session) => sum + parseDurationToMinutes(session.duration), 0),
    [sessions]
  )

  const activeSessions = React.useMemo(
    () => sessions.filter((session) => session.isActive).length,
    [sessions]
  )

  const completedTasks = React.useMemo(
    () =>
      sessions.reduce(
        (sum, session) => sum + session.tasks.filter((task) => task.isCompleted).length,
        0
      ),
    [sessions]
  )

  const runMutation = React.useCallback(
    async ({ actionKey, action, successText, onDone }: MutationConfig) => {
      setBusyAction(actionKey)
      setActionError(null)

      try {
        await action()
        await refresh()

        if (successText) {
          setNotice(successText)
        }

        onDone?.()
      } catch (mutationError) {
        setActionError(toMessage(mutationError))
      } finally {
        setBusyAction(null)
      }
    },
    [refresh]
  )

  const handleAreaSubmit = async (name: string) => {
    const normalizedName = name.trim()
    if (normalizedName.length < 2) {
      setActionError("Area name must be at least 2 characters.")
      return
    }

    if (!areaModalState) {
      return
    }

    if (areaModalState.mode === "create") {
      await runMutation({
        actionKey: "area-submit",
        action: () => createArea({ name: normalizedName }),
        successText: "Area created.",
        onDone: () => setAreaModalState(null),
      })
      return
    }

    await runMutation({
      actionKey: "area-submit",
      action: () => updateAreaName(areaModalState.area.id, { name: normalizedName }),
      successText: "Area updated.",
      onDone: () => setAreaModalState(null),
    })
  }

  const handleProjectSubmit = async (payload: {
    areaId: string
    name: string
    goal: string
    primaryTask: string
    targetHours: string
    notes: string
  }) => {
    const normalizedName = payload.name.trim()
    const normalizedGoal = payload.goal.trim()
    const normalizedPrimaryTask = payload.primaryTask.trim()
    const normalizedNotes = payload.notes.trim()

    if (normalizedName.length < 2 || normalizedGoal.length < 2) {
      setActionError("Project name and goal must be at least 2 characters.")
      return
    }

    const targetHoursRaw = payload.targetHours.trim()
    const parsedTargetHours = targetHoursRaw ? Number(targetHoursRaw) : null
    if (
      parsedTargetHours !== null &&
      (!Number.isFinite(parsedTargetHours) || parsedTargetHours < 1 || parsedTargetHours > 10000)
    ) {
      setActionError("Target hours must be between 1 and 10000.")
      return
    }

    if (!projectModalState) {
      return
    }

    if (projectModalState.mode === "create") {
      await runMutation({
        actionKey: "project-submit",
        action: () =>
          createProject({
            areaId: payload.areaId,
            name: normalizedName,
            goal: normalizedGoal,
            primaryTask: normalizedPrimaryTask || null,
            targetHours: parsedTargetHours,
            notes: normalizedNotes || null,
          }),
        successText: "Project created.",
        onDone: () => setProjectModalState(null),
      })
      return
    }

    await runMutation({
      actionKey: "project-submit",
      action: () =>
        updateProject(projectModalState.project.id, {
          name: normalizedName,
          goal: normalizedGoal,
          primaryTask: normalizedPrimaryTask || null,
          targetHours: parsedTargetHours,
          notes: normalizedNotes || null,
        }),
      successText: "Project updated.",
      onDone: () => setProjectModalState(null),
    })
  }

  const handleSessionStart = async (payload: { title: string; goal: string }) => {
    if (!sessionStartModalState) {
      return
    }

    const normalizedTitle = payload.title.trim()
    const normalizedGoal = payload.goal.trim()
    if (normalizedTitle.length < 2 || normalizedGoal.length < 2) {
      setActionError("Session title and goal must be at least 2 characters.")
      return
    }

    await runMutation({
      actionKey: "session-start",
      action: () =>
        startSession({
          projectId: sessionStartModalState.project.id,
          title: normalizedTitle,
          goal: normalizedGoal,
        }),
      successText: "Session started.",
      onDone: () => {
        setSessionStartModalState(null)
        setExpandedSessionId(null)
      },
    })
  }

  const handleSessionEnd = async (notes: string) => {
    if (!sessionEndModalState) {
      return
    }

    const normalizedNotes = notes.trim()
    const session = sessionEndModalState.session

    await runMutation({
      actionKey: `session-end:${session.id}`,
      action: () => endSession(session.id, { notes: normalizedNotes || null }),
      successText: "Session finished.",
      onDone: () => setSessionEndModalState(null),
    })
  }

  const handleSessionTaskCreate = async (description: string) => {
    if (!sessionTaskModalState) {
      return
    }

    const normalizedDescription = description.trim()
    if (normalizedDescription.length < 2) {
      setActionError("Task description must be at least 2 characters.")
      return
    }

    const session = sessionTaskModalState.session

    await runMutation({
      actionKey: `task-create:${session.id}`,
      action: () => createSessionTask(session.id, { description: normalizedDescription }),
      successText: "Task added.",
      onDone: () => {
        setSessionTaskModalState(null)
        setExpandedSessionId(session.id)
      },
    })
  }

  const handleConfirmAction = () => {
    if (!confirmActionState) {
      return
    }

    void runMutation({
      actionKey: confirmActionState.actionKey,
      action: confirmActionState.action,
      successText: confirmActionState.successText,
      onDone: () => setConfirmActionState(null),
    })
  }

  const metrics = [
    {
      label: "Areas",
      value: String(areas.length),
      description: "Top-level folders",
      icon: Layers3,
    },
    {
      label: "Projects",
      value: String(projects.length),
      description: "Execution units",
      icon: Folder,
    },
    {
      label: "Active sessions",
      value: String(activeSessions),
      description: "Live right now",
      icon: PlayCircle,
    },
    {
      label: "Focus time",
      value: formatMinutes(totalFocusMinutes),
      description: `${completedTasks} tasks completed`,
      icon: Clock3,
    },
  ]

  return (
    <div className="space-y-4 pb-4">
      <section className="panel-surface flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Cabinet control
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">
            Areas, projects and sessions
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Minimal dark workflow. Pick area, pick project, run sessions, track tasks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => setAreaModalState({ mode: "create" })}>
            <Plus className="size-4" />
            Area
          </Button>
          <Button
            variant="outline"
            disabled={!selectedArea}
            onClick={() =>
              setProjectModalState({
                mode: "create",
                areaId: selectedArea?.id || null,
              })
            }
          >
            <FolderPlus className="size-4" />
            Project
          </Button>
          <Button
            disabled={!selectedProject}
            onClick={() =>
              selectedProject &&
              setSessionStartModalState({
                project: selectedProject,
              })
            }
          >
            <PlayCircle className="size-4" />
            Start session
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => void refresh()}
            disabled={isRefreshing}
            aria-label="Refresh"
          >
            <RefreshCw className={cn("size-4", isRefreshing && "animate-spin")} />
          </Button>
        </div>
      </section>

      {error && !isLoading && (
        <div className="panel-soft border-destructive/50 px-4 py-3 text-sm text-destructive">
          Backend load error: {error.message}
        </div>
      )}

      {actionError && (
        <div className="panel-soft border-destructive/50 px-4 py-3 text-sm text-destructive">
          {actionError}
        </div>
      )}

      {notice && (
        <div className="panel-soft border-primary/45 px-4 py-3 text-sm text-primary">{notice}</div>
      )}

      {isLoading ? (
        <LoadingBoard />
      ) : (
        <>
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <article key={metric.label} className="panel-soft p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {metric.label}
                  </p>
                  <metric.icon className="size-4 text-primary" />
                </div>
                <p className="mt-2 text-2xl font-semibold text-foreground">{metric.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{metric.description}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-4 xl:grid-cols-[0.9fr_1.15fr_1.65fr]">
            <article className="panel-surface flex min-h-[560px] flex-col p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Areas
                  </p>
                  <p className="text-sm text-muted-foreground">Folders for project groups</p>
                </div>
                <Button size="icon-sm" variant="outline" onClick={() => setAreaModalState({ mode: "create" })}>
                  <Plus className="size-4" />
                </Button>
              </div>

              <div className="mt-4 flex-1 space-y-2 overflow-y-auto pr-1">
                {areas.length === 0 && (
                  <EmptyState
                    title="No areas yet"
                    text="Create the first area to organize your backend data."
                  />
                )}

                {areas.map((area) => {
                  const isActive = area.id === selectedAreaId
                  return (
                    <div
                      key={area.id}
                      className={cn(
                        "rounded-xl border border-border/65 bg-background/45",
                        isActive && "border-primary/55 bg-primary/12"
                      )}
                    >
                      <button
                        type="button"
                        className="w-full px-3 py-3 text-left"
                        onClick={() => setSelectedAreaId(area.id)}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-foreground">{area.name}</p>
                          <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                            {area.projectsCount} projects
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Created {formatTimestamp(area.createdAt)}
                        </p>
                      </button>

                      <div className="flex items-center justify-end gap-1 border-t border-border/60 p-2">
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          onClick={() => setAreaModalState({ mode: "edit", area })}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          size="icon-xs"
                          variant="destructive"
                          onClick={() =>
                            setConfirmActionState({
                              title: "Delete area",
                              description: `Area "${area.name}" will be removed from backend data.`,
                              confirmLabel: "Delete area",
                              actionKey: `area-delete:${area.id}`,
                              successText: "Area deleted.",
                              action: () => deleteArea(area.id),
                            })
                          }
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </article>

            <article className="panel-surface flex min-h-[560px] flex-col p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Projects
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedArea ? selectedArea.name : "Select an area first"}
                  </p>
                </div>
                <Button
                  size="icon-sm"
                  variant="outline"
                  disabled={!selectedArea}
                  onClick={() =>
                    setProjectModalState({
                      mode: "create",
                      areaId: selectedArea?.id || null,
                    })
                  }
                >
                  <Plus className="size-4" />
                </Button>
              </div>

              <div className="mt-4 flex-1 space-y-2 overflow-y-auto pr-1">
                {!selectedArea && (
                  <EmptyState
                    title="No area selected"
                    text="Pick an area in the left column to open its projects."
                  />
                )}

                {selectedArea && areaProjects.length === 0 && (
                  <EmptyState
                    title="No projects yet"
                    text="Create a project to start sessions and track progress."
                  />
                )}

                {areaProjects.map((project) => {
                  const isActive = project.id === selectedProjectId

                  return (
                    <div
                      key={project.id}
                      className={cn(
                        "rounded-xl border border-border/65 bg-background/45",
                        isActive && "border-primary/55 bg-primary/12"
                      )}
                    >
                      <button
                        type="button"
                        className="w-full px-3 py-3 text-left"
                        onClick={() => setSelectedProjectId(project.id)}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-foreground">{project.name}</p>
                          <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                            {project.sessionsCount} sessions
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs leading-6 text-muted-foreground">
                          {project.goal}
                        </p>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                          {project.targetHours ? `${project.targetHours}h target` : "No target"}
                        </p>
                      </button>

                      <div className="flex items-center justify-end gap-1 border-t border-border/60 p-2">
                        <Button
                          size="icon-xs"
                          variant="outline"
                          onClick={() => setSessionStartModalState({ project })}
                        >
                          <PlayCircle className="size-3.5" />
                        </Button>
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          onClick={() => setProjectModalState({ mode: "edit", project })}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          size="icon-xs"
                          variant="destructive"
                          onClick={() =>
                            setConfirmActionState({
                              title: "Delete project",
                              description: `Project "${project.name}" will be removed from backend data.`,
                              confirmLabel: "Delete project",
                              actionKey: `project-delete:${project.id}`,
                              successText: "Project deleted.",
                              action: () => deleteProject(project.id),
                            })
                          }
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </article>

            <article className="panel-surface flex min-h-[560px] flex-col p-4">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Sessions
                  </p>
                  {selectedProject ? (
                    <>
                      <p className="text-sm font-semibold text-foreground">{selectedProject.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedProject.goal}</p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Select a project to see sessions</p>
                  )}
                </div>

                <Button
                  disabled={!selectedProject}
                  onClick={() =>
                    selectedProject &&
                    setSessionStartModalState({
                      project: selectedProject,
                    })
                  }
                >
                  <PlayCircle className="size-4" />
                  Start
                </Button>
              </div>

              <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
                {!selectedProject && (
                  <EmptyState
                    title="No project selected"
                    text="Choose a project in the center column to manage sessions and tasks."
                  />
                )}

                {selectedProject && sessionsForProject.length === 0 && (
                  <EmptyState
                    title="No sessions yet"
                    text="Start your first session for this project."
                  />
                )}

                {sessionsForProject.map((session) => {
                  const isExpanded = expandedSessionId === session.id

                  return (
                    <article
                      key={session.id}
                      className={cn(
                        "rounded-xl border border-border/65 bg-background/45 p-3",
                        session.isActive && "border-primary/55 bg-primary/10"
                      )}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-foreground">
                            {session.title || "Untitled session"}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span className="rounded-full border border-border/70 px-2 py-0.5 uppercase tracking-[0.12em]">
                              {session.isActive ? "Active" : "Finished"}
                            </span>
                            <span>{formatMinutes(parseDurationToMinutes(session.duration))}</span>
                            <span>{formatTimestamp(session.startedAt)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            size="icon-xs"
                            variant="ghost"
                            onClick={() =>
                              setExpandedSessionId((current) =>
                                current === session.id ? null : session.id
                              )
                            }
                          >
                            <ChevronDown
                              className={cn("size-3.5 transition-transform", isExpanded && "rotate-180")}
                            />
                          </Button>
                          <Button
                            size="icon-xs"
                            variant="outline"
                            onClick={() => setSessionTaskModalState({ session })}
                          >
                            <Plus className="size-3.5" />
                          </Button>
                          {session.isActive && (
                            <Button
                              size="icon-xs"
                              variant="outline"
                              onClick={() => setSessionEndModalState({ session })}
                            >
                              <StopCircle className="size-3.5" />
                            </Button>
                          )}
                          <Button
                            size="icon-xs"
                            variant="destructive"
                            onClick={() =>
                              setConfirmActionState({
                                title: "Delete session",
                                description:
                                  "This session and all of its tasks will be removed permanently.",
                                confirmLabel: "Delete session",
                                actionKey: `session-delete:${session.id}`,
                                successText: "Session deleted.",
                                action: () => deleteSession(session.id),
                              })
                            }
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-3 space-y-3 border-t border-border/60 pt-3">
                          <p className="text-xs leading-6 text-muted-foreground">
                            {session.goal || "No goal defined for this session."}
                          </p>

                          {session.notes && (
                            <div className="rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-xs text-muted-foreground">
                              Notes: {session.notes}
                            </div>
                          )}

                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                Tasks ({session.tasks.length})
                              </p>
                              <Button
                                size="xs"
                                variant="outline"
                                onClick={() => setSessionTaskModalState({ session })}
                              >
                                <Plus className="size-3" />
                                Add task
                              </Button>
                            </div>

                            {session.tasks.length === 0 && (
                              <p className="text-xs text-muted-foreground">No tasks in this session yet.</p>
                            )}

                            {session.tasks.map((task) => (
                              <div
                                key={task.id}
                                className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-background/50 px-2 py-2"
                              >
                                <button
                                  type="button"
                                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                                  onClick={() =>
                                    void runMutation({
                                      actionKey: `task-toggle:${session.id}:${task.id}`,
                                      action: () =>
                                        updateSessionTaskStatus(session.id, task.id, {
                                          isCompleted: !task.isCompleted,
                                        }),
                                    })
                                  }
                                >
                                  {task.isCompleted ? (
                                    <CheckCircle2 className="size-4 text-primary" />
                                  ) : (
                                    <Circle className="size-4 text-muted-foreground" />
                                  )}
                                  <span
                                    className={cn(
                                      "truncate text-xs text-foreground",
                                      task.isCompleted && "text-muted-foreground line-through"
                                    )}
                                  >
                                    {task.description}
                                  </span>
                                </button>

                                <Button
                                  size="icon-xs"
                                  variant="ghost"
                                  onClick={() =>
                                    setConfirmActionState({
                                      title: "Delete task",
                                      description: "Task will be removed from this session.",
                                      confirmLabel: "Delete task",
                                      actionKey: `task-delete:${session.id}:${task.id}`,
                                      successText: "Task deleted.",
                                      action: () => deleteSessionTask(session.id, task.id),
                                    })
                                  }
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            </article>
          </section>
        </>
      )}

      <AreaFormModal
        state={areaModalState}
        onClose={() => setAreaModalState(null)}
        onSubmit={handleAreaSubmit}
        isSubmitting={busyAction === "area-submit"}
      />

      <ProjectFormModal
        state={projectModalState}
        areas={areas}
        onClose={() => setProjectModalState(null)}
        onSubmit={handleProjectSubmit}
        isSubmitting={busyAction === "project-submit"}
      />

      <SessionStartModal
        state={sessionStartModalState}
        onClose={() => setSessionStartModalState(null)}
        onSubmit={handleSessionStart}
        isSubmitting={busyAction === "session-start"}
      />

      <SessionEndModal
        state={sessionEndModalState}
        onClose={() => setSessionEndModalState(null)}
        onSubmit={handleSessionEnd}
        isSubmitting={Boolean(
          sessionEndModalState && busyAction === `session-end:${sessionEndModalState.session.id}`
        )}
      />

      <SessionTaskModal
        state={sessionTaskModalState}
        onClose={() => setSessionTaskModalState(null)}
        onSubmit={handleSessionTaskCreate}
        isSubmitting={Boolean(
          sessionTaskModalState && busyAction === `task-create:${sessionTaskModalState.session.id}`
        )}
      />

      <ConfirmActionModal
        open={Boolean(confirmActionState)}
        title={confirmActionState?.title || "Confirm action"}
        description={confirmActionState?.description || "This action will modify backend data."}
        confirmLabel={confirmActionState?.confirmLabel || "Confirm"}
        busy={Boolean(confirmActionState && busyAction === confirmActionState.actionKey)}
        onCancel={() => setConfirmActionState(null)}
        onConfirm={handleConfirmAction}
      />
    </div>
  )
}
