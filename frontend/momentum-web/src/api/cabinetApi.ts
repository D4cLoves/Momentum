import { apiRequest } from './httpClient'

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

export type StartSessionPayload = {
  projectId: string
  title: string
  goal: string
}

export type StartSessionResponse = {
  id: string
  projectId: string
  title: string | null
  goal: string | null
  startedAt: string
  isActive: boolean
}

export type EndSessionPayload = {
  notes: string | null
}

export type CreateSessionTaskPayload = {
  description: string
}

export type UpdateSessionTaskStatusPayload = {
  isCompleted: boolean
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

export function getAreas(): Promise<AreaDto[]> {
  return apiRequest<AreaDto[]>("/api/areas")
}

export function createArea(name: string): Promise<AreaDto> {
  return apiRequest<AreaDto>("/api/areas", {
    method: "POST",
    body: JSON.stringify({ name }),
  })
}

export function getProjects(): Promise<ProjectDto[]> {
  return apiRequest<ProjectDto[]>("/api/projects")
}

export function createProject(payload: CreateProjectPayload): Promise<ProjectDto> {
  return apiRequest<ProjectDto>("/api/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function updateProject(
  projectId: string,
  payload: UpdateProjectPayload
): Promise<ProjectDto> {
  return apiRequest<ProjectDto>(`/api/projects/${projectId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}

export function deleteProject(projectId: string): Promise<void> {
  return apiRequest<void>(`/api/projects/${projectId}`, {
    method: "DELETE",
  })
}

export function updateAreaName(areaId: string, name: string): Promise<AreaDto> {
  return apiRequest<AreaDto>(`/api/areas/${areaId}/name`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  })
}

export function deleteArea(areaId: string): Promise<void> {
  return apiRequest<void>(`/api/areas/${areaId}`, {
    method: "DELETE",
  })
}

export function getSessions(): Promise<SessionDto[]> {
  return apiRequest<SessionDto[]>("/api/sessions")
}

export function startSession(payload: StartSessionPayload): Promise<StartSessionResponse> {
  return apiRequest<StartSessionResponse>("/api/sessions", {
    method: "POST",
    body: JSON.stringify({
      ProjectId: payload.projectId,
      Title: payload.title,
      Goal: payload.goal,
    }),
  })
}

export function endSession(sessionId: string, payload: EndSessionPayload): Promise<SessionDto> {
  return apiRequest<SessionDto>(`/api/sessions/${sessionId}/end`, {
    method: "PATCH",
    body: JSON.stringify({
      Notes: payload.notes,
    }),
  })
}

export function createSessionTask(
  sessionId: string,
  payload: CreateSessionTaskPayload
): Promise<SessionTaskDto> {
  return apiRequest<SessionTaskDto>(`/api/sessions/${sessionId}/tasks`, {
    method: "POST",
    body: JSON.stringify({
      Description: payload.description,
    }),
  })
}

export function updateSessionTaskStatus(
  sessionId: string,
  taskId: string,
  payload: UpdateSessionTaskStatusPayload
): Promise<SessionTaskDto> {
  return apiRequest<SessionTaskDto>(`/api/sessions/${sessionId}/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify({
      IsCompleted: payload.isCompleted,
    }),
  })
}
