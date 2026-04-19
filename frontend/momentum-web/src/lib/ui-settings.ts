export type UiSettings = {
  fontId: string
  fontScale: number
  accentId: string
}

type FontOption = {
  id: string
  label: string
  family: string
  preview: string
}

type AccentOption = {
  id: string
  label: string
  rgb: string
}

const UI_SETTINGS_STORAGE_KEY = "momentum:ui-settings"

const MIN_FONT_SCALE = 85
const MAX_FONT_SCALE = 125

export const FONT_OPTIONS: FontOption[] = [
  {
    id: "jetbrains-mono",
    label: "JetBrains Mono",
    family: '"JetBrains Mono Variable", "JetBrains Mono", monospace',
    preview: "Code-minded default",
  },
  {
    id: "segoe-ui",
    label: "Segoe UI",
    family: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    preview: "Modern Windows style",
  },
  {
    id: "inter-ui",
    label: "Inter",
    family: 'Inter, "Segoe UI", Roboto, Arial, sans-serif',
    preview: "Neutral product style",
  },
  {
    id: "system-sans",
    label: "System Sans",
    family: "system-ui, -apple-system, \"Segoe UI\", Roboto, sans-serif",
    preview: "Native UI typography",
  },
  {
    id: "trebuchet",
    label: "Trebuchet MS",
    family: '"Trebuchet MS", "Segoe UI", sans-serif',
    preview: "Readable and compact",
  },
  {
    id: "verdana",
    label: "Verdana",
    family: "Verdana, Geneva, sans-serif",
    preview: "Classic wide glyphs",
  },
  {
    id: "georgia",
    label: "Georgia",
    family: "Georgia, \"Times New Roman\", serif",
    preview: "Editorial serif tone",
  },
  {
    id: "palatino",
    label: "Palatino",
    family: "\"Palatino Linotype\", \"Book Antiqua\", Palatino, serif",
    preview: "Book-like serif look",
  },
  {
    id: "consolas",
    label: "Consolas",
    family: 'Consolas, "Courier New", monospace',
    preview: "Developer terminal vibe",
  },
  {
    id: "courier",
    label: "Courier New",
    family: '"Courier New", Courier, monospace',
    preview: "Typewriter style",
  },
]

export const ACCENT_OPTIONS: AccentOption[] = [
  { id: "cobalt", label: "Cobalt", rgb: "59 130 246" },
  { id: "emerald", label: "Emerald", rgb: "16 185 129" },
  { id: "amber", label: "Amber", rgb: "245 158 11" },
  { id: "rose", label: "Rose", rgb: "244 63 94" },
  { id: "violet", label: "Violet", rgb: "139 92 246" },
  { id: "cyan", label: "Cyan", rgb: "6 182 212" },
  { id: "lime", label: "Lime", rgb: "132 204 22" },
  { id: "orange", label: "Orange", rgb: "249 115 22" },
]

export const DEFAULT_UI_SETTINGS: UiSettings = {
  fontId: FONT_OPTIONS[0].id,
  fontScale: 100,
  accentId: ACCENT_OPTIONS[0].id,
}

function isBrowser() {
  return typeof window !== "undefined"
}

function clampFontScale(value: number) {
  return Math.min(MAX_FONT_SCALE, Math.max(MIN_FONT_SCALE, Math.round(value)))
}

function sanitize(raw: Partial<UiSettings>): UiSettings {
  const fontExists = FONT_OPTIONS.some((item) => item.id === raw.fontId)
  const accentExists = ACCENT_OPTIONS.some((item) => item.id === raw.accentId)

  return {
    fontId: fontExists ? raw.fontId! : DEFAULT_UI_SETTINGS.fontId,
    accentId: accentExists ? raw.accentId! : DEFAULT_UI_SETTINGS.accentId,
    fontScale:
      typeof raw.fontScale === "number"
        ? clampFontScale(raw.fontScale)
        : DEFAULT_UI_SETTINGS.fontScale,
  }
}

export function loadUiSettings(): UiSettings {
  if (!isBrowser()) {
    return DEFAULT_UI_SETTINGS
  }

  try {
    const raw = window.localStorage.getItem(UI_SETTINGS_STORAGE_KEY)
    if (!raw) {
      return DEFAULT_UI_SETTINGS
    }

    return sanitize(JSON.parse(raw) as Partial<UiSettings>)
  } catch {
    return DEFAULT_UI_SETTINGS
  }
}

export function saveUiSettings(settings: UiSettings) {
  if (!isBrowser()) {
    return
  }

  window.localStorage.setItem(
    UI_SETTINGS_STORAGE_KEY,
    JSON.stringify(sanitize(settings))
  )
}

export function applyUiSettings(settings: UiSettings) {
  if (typeof document === "undefined") {
    return
  }

  const normalized = sanitize(settings)
  const selectedFont =
    FONT_OPTIONS.find((item) => item.id === normalized.fontId) ?? FONT_OPTIONS[0]
  const selectedAccent =
    ACCENT_OPTIONS.find((item) => item.id === normalized.accentId) ?? ACCENT_OPTIONS[0]

  const root = document.documentElement
  root.style.setProperty("--app-font-family", selectedFont.family)
  root.style.setProperty("--app-font-scale", `${normalized.fontScale}%`)
  root.style.setProperty("--cabinet-accent-rgb", selectedAccent.rgb)
}
