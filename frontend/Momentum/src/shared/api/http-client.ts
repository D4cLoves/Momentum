import { env } from "@/shared/config/env"

export class ApiError extends Error {
  public readonly status: number

  public constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

function buildUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${env.apiBaseUrl}${normalizedPath}`
}

async function parseError(response: Response) {
  const body = (await response.text()).trim()
  const fallback = `Request failed with status ${response.status}`
  throw new ApiError(body || fallback, response.status)
}

async function parseResponse<T>(response: Response) {
  if (response.status === 204) {
    return undefined as T
  }

  const contentType = response.headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return (await response.json()) as T
  }

  return (await response.text()) as T
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers)

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
    credentials: "include",
  })

  if (!response.ok) {
    await parseError(response)
  }

  return parseResponse<T>(response)
}
