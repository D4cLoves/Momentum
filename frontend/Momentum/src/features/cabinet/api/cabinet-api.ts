import { apiRequest } from "@/shared/api/http-client"
import type {
  AreaDto,
  CreateAreaPayload,
  CreateProjectPayload,
  CreateSessionTaskPayload,
  EndSessionPayload,
  ProjectDto,
  SessionDto,
  StartSessionPayload,
  UpdateAreaPayload,
  UpdateProjectPayload,
  UpdateSessionTaskPayload,
} from "@/features/cabinet/model/cabinet-types"

export function getAreas() {
  return apiRequest<AreaDto[]>("/areas")
}

export function createArea(payload: CreateAreaPayload) {
  return apiRequest<AreaDto>("/areas", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function updateAreaName(areaId: string, payload: UpdateAreaPayload) {
  return apiRequest<AreaDto>(`/areas/${areaId}/name`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}

export function deleteArea(areaId: string) {
  return apiRequest<void>(`/areas/${areaId}`, {
    method: "DELETE",
  })
}

export function getProjects() {
  return apiRequest<ProjectDto[]>("/projects")
}

export function createProject(payload: CreateProjectPayload) {
  return apiRequest<ProjectDto>("/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function updateProject(projectId: string, payload: UpdateProjectPayload) {
  return apiRequest<ProjectDto>(`/projects/${projectId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}

export function deleteProject(projectId: string) {
  return apiRequest<void>(`/projects/${projectId}`, {
    method: "DELETE",
  })
}

export function getSessions() {
  return apiRequest<SessionDto[]>("/sessions")
}

export function startSession(payload: StartSessionPayload) {
  return apiRequest<SessionDto>("/sessions", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function endSession(sessionId: string, payload: EndSessionPayload) {
  return apiRequest<SessionDto>(`/sessions/${sessionId}/end`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}

export function deleteSession(sessionId: string) {
  return apiRequest<void>(`/sessions/${sessionId}`, {
    method: "DELETE",
  })
}

export function createSessionTask(sessionId: string, payload: CreateSessionTaskPayload) {
  return apiRequest<void>(`/sessions/${sessionId}/tasks`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function updateSessionTaskStatus(
  sessionId: string,
  taskId: string,
  payload: UpdateSessionTaskPayload
) {
  return apiRequest<void>(`/sessions/${sessionId}/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}

export function deleteSessionTask(sessionId: string, taskId: string) {
  return apiRequest<void>(`/sessions/${sessionId}/tasks/${taskId}`, {
    method: "DELETE",
  })
}
