import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import {
  Cursor,
  CursorProvider,
} from '@/components/animate-ui/components/animate/cursor'
import { GravityStarsBackground } from '@/components/animate-ui/components/backgrounds/gravity-stars'
import { ThemeTogglerButton } from '@/components/animate-ui/components/buttons/theme-toggler'
import { ProtectedRoute } from './components/ProtectedRoute'
import { CabinetPage } from './pages/CabinetPage'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'

function App() {
  const location = useLocation()
  const isCabinetRoute = location.pathname.startsWith('/cabinet')

  const appRoutes = (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/cabinet"
        element={
          <ProtectedRoute>
            <CabinetPage />
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
          <header className="header">
            <p className="brand">Momentum Frontend</p>
            <nav className="top-nav">
              <NavLink to="/">Main</NavLink>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
              <NavLink to="/cabinet">Cabinet</NavLink>
            </nav>
            <ThemeTogglerButton
              variant="outline"
              size="sm"
              direction="ltr"
              modes={['light', 'dark']}
              aria-label="Toggle theme"
            />
          </header>

          <main className={isCabinetRoute ? 'cabinet-page' : 'page'}>
            {appRoutes}
          </main>
        </div>
      </div>
    </>
  )
}

export default App
