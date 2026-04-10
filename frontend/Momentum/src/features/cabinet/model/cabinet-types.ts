export type AreaDto = {
  id: string
  name: string
  createdAt: string
  projectsCount: number
}

export type ProjectDto = {
  id: string
  areaId: string
  name: string
  goal: string
  primaryTask: string | null
  notes: string | null
  targetHours: number | null
  createdAt: string
  sessionsCount: number
}

export type SessionTaskDto = {
  id: string
  description: string
  isCompleted: boolean
  completedAt: string | null
}

export type SessionDto = {
  id: string
  projectId: string
  title: string | null
  goal: string | null
  startedAt: string
  endedAt: string | null
  duration: string
  notes: string | null
  isActive: boolean
  tasks: SessionTaskDto[]
}

export type CreateAreaPayload = {
  name: string
}

export type UpdateAreaPayload = {
  name: string
}

export type CreateProjectPayload = {
  areaId: string
  name: string
  goal: string
  primaryTask: string | null
  targetHours: number | null
  notes: string | null
}

export type UpdateProjectPayload = {
  name: string | null
  goal: string | null
  primaryTask: string | null
  targetHours: number | null
  notes: string | null
}

export type StartSessionPayload = {
  projectId: string
  title: string
  goal: string
}

export type EndSessionPayload = {
  notes: string | null
}

export type CreateSessionTaskPayload = {
  description: string
}

export type UpdateSessionTaskPayload = {
  isCompleted: boolean
}
