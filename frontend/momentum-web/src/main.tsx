import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'next-themes'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthSessionProvider } from './auth/auth-session.tsx'
import { applyUiSettings, loadUiSettings } from './lib/ui-settings.ts'

applyUiSettings(loadUiSettings())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrowserRouter>
        <AuthSessionProvider>
          <App />
        </AuthSessionProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
