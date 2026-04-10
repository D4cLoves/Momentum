export class ApiError extends Error {
  public readonly status: number

  public constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

type ApiRequestOptions = RequestInit & {
  skipAuthRefresh?: boolean
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

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

async function tryRefreshSession(): Promise<boolean> {
  const response = await fetch('/api/users/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ refreshTokens: '' }),
  })

  return response.ok
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { skipAuthRefresh = false, ...init } = options
  const method = init.method ?? 'GET'
  const headers = {
    'Content-Type': 'application/json',
    ...(init.headers ?? {}),
  }

  const response = await fetch(path, {
    method,
    headers,
    credentials: 'include',
    body: init.body,
  })

  if (response.status === 401 && !skipAuthRefresh && path !== '/api/users/refresh') {
    const refreshed = await tryRefreshSession()
    if (refreshed) {
      const retryResponse = await fetch(path, {
        method,
        headers,
        credentials: 'include',
        body: init.body,
      })

      if (!retryResponse.ok) {
        throw new ApiError(await readError(retryResponse), retryResponse.status)
      }

      return parseResponse<T>(retryResponse)
    }
  }

  if (!response.ok) {
    throw new ApiError(await readError(response), response.status)
  }

  return parseResponse<T>(response)
}
