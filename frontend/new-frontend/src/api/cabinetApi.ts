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

class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

async function readError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as {
      message?: string
      title?: string
      detail?: string
    }

    return (
      data.message ||
      data.title ||
      data.detail ||
      `Request failed with status ${response.status}`
    )
  } catch {
    return `Request failed with status ${response.status}`
  }
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const method = init?.method ?? "GET"
  const headers = {
    "Content-Type": "application/json",
    ...(init?.headers ?? {}),
  }

  const response = await fetch(path, {
    method,
    headers,
    credentials: "include",
    body: init?.body,
  })

  if (response.status === 401) {
    const refreshResponse = await fetch("/api/users/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ refreshTokens: "" }),
    })

    if (refreshResponse.ok) {
      const retryResponse = await fetch(path, {
        method,
        headers,
        credentials: "include",
        body: init?.body,
      })

      if (!retryResponse.ok) {
        throw new ApiError(await readError(retryResponse), retryResponse.status)
      }

      return (await retryResponse.json()) as T
    }
  }

  if (!response.ok) {
    throw new ApiError(await readError(response), response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
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
