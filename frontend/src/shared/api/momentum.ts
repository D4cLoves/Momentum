import { apiDelete, apiGet, apiPatch, apiPost, apiPostNoContent } from "@/shared/api/http";

export type AreaResponse = {
  id: string;
  name: string;
  createdAt: string;
  projectsCount: number;
};

export type ProjectResponse = {
  id: string;
  areaId: string;
  name: string;
  goal: string;
  primaryTask: string | null;
  notes: string | null;
  targetHours: number | null;
  createdAt: string;
  sessionsCount: number;
};

export type SessionTaskResponse = {
  id: string;
  description: string;
  isCompleted: boolean;
  completedAt: string | null;
};

export type SessionResponse = {
  id: string;
  projectId: string;
  title: string | null;
  goal: string | null;
  startedAt: string;
  endedAt: string | null;
  duration: string; // TimeSpan serialization (string)
  notes: string | null;
  isActive: boolean;
  tasks: SessionTaskResponse[];
};

export type StartSessionResponse = {
  id: string;
  projectId: string;
  title: string | null;
  goal: string | null;
  startedAt: string;
  isActive: boolean;
};

export type LoginRequest = { email: string; password: string };
export type RegisterRequest = { name: string; email: string; password: string };

export type CreateAreaRequest = { name: string };
export type UpdateAreaNameRequest = { name: string };

export type CreateProjectRequest = {
  areaId: string;
  name: string;
  goal: string;
  primaryTask: string | null;
  targetHours: number | null;
  notes: string | null;
};

export type UpdateProjectRequest = {
  name?: string;
  goal?: string;
  primaryTask?: string | null;
  targetHours?: number | null;
  notes?: string | null;
};

export type StartSessionRequest = {
  projectId: string;
  title: string;
  goal: string;
};

export type EndSessionRequest = { notes: string | null };

export type CreateSessionTaskRequest = { description: string };
export type UpdateSessionTaskStatusRequest = { isCompleted: boolean };

export async function login(request: LoginRequest): Promise<void> {
  // Backend sets cookies; response body is not important for us.
  await apiPost<LoginRequest, { accessToken: string }>("/api/users/login", request);
}

export async function register(request: RegisterRequest): Promise<void> {
  await apiPostNoContent<RegisterRequest>("/api/users/register", request);
}

export async function refreshAuth(): Promise<void> {
  // Not required for basic flow; kept for future use.
}

export async function getAreas(): Promise<AreaResponse[]> {
  return apiGet<AreaResponse[]>("/api/areas");
}

export async function createArea(request: CreateAreaRequest): Promise<AreaResponse> {
  return apiPost<CreateAreaRequest, AreaResponse>("/api/areas", request);
}

export async function updateAreaName(areaId: string, request: UpdateAreaNameRequest): Promise<AreaResponse> {
  return apiPatch<UpdateAreaNameRequest, AreaResponse>(`/api/areas/${areaId}/name`, request);
}

export async function deleteArea(areaId: string): Promise<void> {
  await apiDelete(`/api/areas/${areaId}`);
}

export async function getProjects(): Promise<ProjectResponse[]> {
  return apiGet<ProjectResponse[]>("/api/projects");
}

export async function getProjectById(projectId: string): Promise<ProjectResponse> {
  return apiGet<ProjectResponse>(`/api/projects/${projectId}`);
}

export async function createProject(request: CreateProjectRequest): Promise<ProjectResponse> {
  return apiPost<CreateProjectRequest, ProjectResponse>("/api/projects", request);
}

export async function updateProject(projectId: string, request: UpdateProjectRequest): Promise<ProjectResponse> {
  return apiPatch<UpdateProjectRequest, ProjectResponse>(`/api/projects/${projectId}`, request);
}

export async function deleteProject(projectId: string): Promise<void> {
  await apiDelete(`/api/projects/${projectId}`);
}

export async function getSessions(): Promise<SessionResponse[]> {
  return apiGet<SessionResponse[]>("/api/sessions");
}

export async function getSessionById(sessionId: string): Promise<SessionResponse> {
  return apiGet<SessionResponse>(`/api/sessions/${sessionId}`);
}

export async function startSession(request: StartSessionRequest): Promise<StartSessionResponse> {
  // Backend returns a subset. UI will fetch full session data from `/api/sessions`.
  return apiPost<StartSessionRequest, StartSessionResponse>("/api/sessions", request);
}

export async function endSession(sessionId: string, request: EndSessionRequest): Promise<SessionResponse> {
  return apiPatch<EndSessionRequest, SessionResponse>(`/api/sessions/${sessionId}/end`, request);
}

export async function deleteSession(sessionId: string): Promise<void> {
  await apiDelete(`/api/sessions/${sessionId}`);
}

export async function createSessionTask(
  sessionId: string,
  request: CreateSessionTaskRequest,
): Promise<SessionTaskResponse> {
  return apiPost<CreateSessionTaskRequest, SessionTaskResponse>(
    `/api/sessions/${sessionId}/tasks`,
    request,
  );
}

export async function updateSessionTaskStatus(
  sessionId: string,
  taskId: string,
  request: UpdateSessionTaskStatusRequest,
): Promise<SessionTaskResponse> {
  return apiPatch<UpdateSessionTaskStatusRequest, SessionTaskResponse>(
    `/api/sessions/${sessionId}/tasks/${taskId}`,
    request,
  );
}

export async function deleteSessionTask(
  sessionId: string,
  taskId: string,
): Promise<void> {
  await apiDelete(`/api/sessions/${sessionId}/tasks/${taskId}`);
}

