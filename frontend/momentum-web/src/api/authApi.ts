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

export type ForgotPasswordRequest = {
  email: string
}

export type VerifyResetCodeRequest = {
  email: string
  code: string
}

export type VerifyResetCodeResponse = {
  sessionToken: string
}

export type ResetPasswordRequest = {
  sessionToken: string
  newPassword: string
}

export type LoginResponse = {
  accessToken: string
}

export type CurrentUserProfileResponse = {
  id: string
  name: string | null
  email: string | null
}

export type UpdateUserTimeZoneRequest = {
  timeZoneId: string
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

export async function logoutUser(): Promise<void> {
  return apiRequest<void>('/api/users/logout', {
    method: 'POST',
    skipAuthRefresh: true,
  })
}

export async function getCurrentUserProfile(): Promise<CurrentUserProfileResponse> {
  return apiRequest<CurrentUserProfileResponse>('/api/users/me')
}

export async function updateUserTimeZone(payload: UpdateUserTimeZoneRequest): Promise<void> {
  return apiRequest<void>('/api/users/me/timezone', {
    method: 'PATCH',
    body: JSON.stringify({
      TimeZoneId: payload.timeZoneId,
    }),
  })
}

export async function forgotPassword(payload: ForgotPasswordRequest): Promise<void> {
  return apiRequest<void>('/api/users/forgot-password', {
    method: 'POST',
    body: JSON.stringify(payload),
    skipAuthRefresh: true,
  })
}

export async function verifyResetCode(
  payload: VerifyResetCodeRequest,
): Promise<VerifyResetCodeResponse> {
  return apiRequest<VerifyResetCodeResponse>('/api/users/verify-reset-code', {
    method: 'POST',
    body: JSON.stringify(payload),
    skipAuthRefresh: true,
  })
}

export async function resetPassword(payload: ResetPasswordRequest): Promise<void> {
  return apiRequest<void>('/api/users/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
    skipAuthRefresh: true,
  })
}
