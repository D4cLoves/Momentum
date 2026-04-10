import { apiRequest } from "@/shared/api/http-client"

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
}

type LoginResponse = {
  accessToken: string
}

export async function loginUser(payload: LoginPayload) {
  return apiRequest<LoginResponse>("/users/login", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function registerUser(payload: RegisterPayload) {
  return apiRequest<void>("/users/register", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function refreshSession() {
  return apiRequest<void>("/users/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshTokens: "" }),
  })
}
