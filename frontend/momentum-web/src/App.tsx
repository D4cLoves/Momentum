import { Route, Routes, useLocation } from 'react-router-dom'
import {
  Cursor,
  CursorProvider,
} from '@/components/animate-ui/components/animate/cursor'
import { GravityStarsBackground } from '@/components/animate-ui/components/backgrounds/gravity-stars'
import { ProtectedRoute } from './components/ProtectedRoute'
import { CabinetPage } from './pages/CabinetPage'
import { CabinetCustomPage } from './pages/CabinetCustomPage'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { RecoverCodePage } from './pages/RecoverCodePage'
import { RecoverResetPasswordPage } from './pages/RecoverResetPasswordPage'
import { RecoverCodeVerifyPage } from './pages/RecoverCodeVerifyPage'
import { RegisterPage } from './pages/RegisterPage'
import { StatisticsPage } from './pages/StatisticsPage'

function App() {
  const location = useLocation()
  const isCabinetRoute =
    location.pathname.startsWith('/cabinet') || location.pathname.startsWith('/statistics')

  const appRoutes = (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/recover-code" element={<RecoverCodePage />} />
      <Route path="/recover-code/verify" element={<RecoverCodeVerifyPage />} />
      <Route path="/recover-code/reset" element={<RecoverResetPasswordPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/cabinet"
        element={
          <ProtectedRoute>
            <CabinetPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cabinet-custom"
        element={
          <ProtectedRoute>
            <CabinetCustomPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/statistics"
        element={
          <ProtectedRoute>
            <StatisticsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )

  return (
    <>
      <GravityStarsBackground className="fixed inset-0 h-screen w-screen text-foreground/60 pointer-events-none" />

      <CursorProvider global>
        <Cursor />
      </CursorProvider>

      <div className={isCabinetRoute ? 'cabinet-shell' : 'app-shell'}>
        <div className="content-layer">
          <main className={isCabinetRoute ? 'cabinet-page' : 'page'}>
            {appRoutes}
          </main>
        </div>
      </div>
    </>
  )
}

export default App
