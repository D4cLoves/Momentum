import { apiRequest } from './httpClient'

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

export async function registerUser(payload: RegisterRequest): Promise<void> {
  return apiRequest<void>('/api/users/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/api/users/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function refreshSession(): Promise<void> {
  return apiRequest<void>('/api/users/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshTokens: '' }),
    skipAuthRefresh: true,
  })
}
