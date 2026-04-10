function normalizeApiBaseUrl(url: string) {
  if (url === "/") {
    return ""
  }

  return url.endsWith("/") ? url.slice(0, -1) : url
}

const rawApiBaseUrl = import.meta.env.VITE_API_URL?.trim() || "/api"

export const env = {
  apiBaseUrl: normalizeApiBaseUrl(rawApiBaseUrl),
}
