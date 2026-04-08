export type RegisterRequest = {
  name: string
  email: string
  password: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  accessToken: string
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

export async function registerUser(payload: RegisterRequest): Promise<void> {
  const response = await fetch('/api/users/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(await readError(response))
  }
}

export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  const response = await fetch('/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(await readError(response))
  }

  return (await response.json()) as LoginResponse
}
