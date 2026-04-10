import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import ProtectedRoute from "@/app/guards/protected-route"
import { CabinetLayout } from "@/features/cabinet/layout/cabinet-layout"
import { CabinetRoadmapPage } from "@/features/cabinet/pages/cabinet-roadmap-page"
import { CabinetStatsPage } from "@/features/cabinet/pages/cabinet-stats-page"
import { CabinetOverviewPage } from "@/features/cabinet/pages/cabinet-overview-page"
import { CabinetDataProvider } from "@/features/cabinet/model/cabinet-data-context"
import { LoginPage } from "@/features/auth/pages/login-page"
import { RegisterPage } from "@/features/auth/pages/register-page"
import { LandingPage } from "@/features/landing/landing-page"

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/cabinet"
            element={
              <CabinetDataProvider>
                <CabinetLayout />
              </CabinetDataProvider>
            }
          >
            <Route index element={<CabinetOverviewPage />} />
            <Route path="stats" element={<CabinetStatsPage />} />
            <Route path="roadmap" element={<CabinetRoadmapPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
