/* eslint-disable react-refresh/only-export-components */
import * as React from "react"

import { getAreas, getProjects, getSessions } from "@/features/cabinet/api/cabinet-api"
import type {
  AreaDto,
  ProjectDto,
  SessionDto,
} from "@/features/cabinet/model/cabinet-types"
import { ApiError } from "@/shared/api/http-client"

type CabinetDataContextValue = {
  areas: AreaDto[]
  projects: ProjectDto[]
  sessions: SessionDto[]
  isLoading: boolean
  isRefreshing: boolean
  error: ApiError | null
  refresh: () => Promise<void>
}

const CabinetDataContext = React.createContext<CabinetDataContextValue | undefined>(
  undefined
)

export function CabinetDataProvider({ children }: { children: React.ReactNode }) {
  const [areas, setAreas] = React.useState<AreaDto[]>([])
  const [projects, setProjects] = React.useState<ProjectDto[]>([])
  const [sessions, setSessions] = React.useState<SessionDto[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [error, setError] = React.useState<ApiError | null>(null)

  const loadData = React.useCallback(async (isInitialLoad: boolean) => {
    if (isInitialLoad) {
      setIsLoading(true)
    } else {
      setIsRefreshing(true)
    }

    try {
      const [nextAreas, nextProjects, nextSessions] = await Promise.all([
        getAreas(),
        getProjects(),
        getSessions(),
      ])

      setAreas(nextAreas)
      setProjects(nextProjects)
      setSessions(nextSessions)
      setError(null)
    } catch (fetchError) {
      if (fetchError instanceof ApiError) {
        setError(fetchError)
      } else {
        setError(new ApiError("Unable to load cabinet data.", 500))
      }
    } finally {
      if (isInitialLoad) {
        setIsLoading(false)
      } else {
        setIsRefreshing(false)
      }
    }
  }, [])

  React.useEffect(() => {
    void loadData(true)
  }, [loadData])

  const refresh = React.useCallback(async () => {
    await loadData(false)
  }, [loadData])

  const value = React.useMemo(
    () => ({
      areas,
      projects,
      sessions,
      isLoading,
      isRefreshing,
      error,
      refresh,
    }),
    [areas, projects, sessions, isLoading, isRefreshing, error, refresh]
  )

  return <CabinetDataContext.Provider value={value}>{children}</CabinetDataContext.Provider>
}

export function useCabinetData() {
  const context = React.useContext(CabinetDataContext)
  if (!context) {
    throw new Error("useCabinetData must be used within CabinetDataProvider")
  }

  return context
}
