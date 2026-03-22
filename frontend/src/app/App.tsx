import { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { getSessions, startSession, type ProjectResponse, type SessionResponse } from "@/shared/api/momentum";
import { cn } from "@/lib/utils";

import RequireAuth from "@/app/guards/RequireAuth";

import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import CabinetLayout from "@/pages/cabinet/CabinetLayout";
import SessionOverlay from "@/features/session/SessionOverlay";

type AuthStatus = "unknown" | "guest" | "authed";

export default function App() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>("unknown");
  const [activeSession, setActiveSession] = useState<SessionResponse | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const refreshSessions = useCallback(async () => {
    try {
      const sessions = await getSessions();
      const active = sessions.find((s) => s.isActive) ?? null;

      setAuthStatus("authed");
      setActiveSession(active);
    } catch {
      setAuthStatus("guest");
      setActiveSession(null);
    }
  }, []);

  useEffect(() => {
    refreshSessions().catch(() => {});
  }, [refreshSessions]);

  const onAuthSuccess = useCallback(async () => {
    await refreshSessions();
    setRefreshTick((t) => t + 1);
  }, [refreshSessions]);

  const onSessionFinished = useCallback(async () => {
    setRefreshTick((t) => t + 1);
    await refreshSessions();
  }, [refreshSessions]);

  const onStartSession = useCallback(
    async (project: ProjectResponse, title: string, goal: string) => {
      await startSession({ projectId: project.id, title, goal });
      setRefreshTick((t) => t + 1);
      await refreshSessions();
    },
    [refreshSessions],
  );

  return (
    <>
      <div className={cn(activeSession ? "pointer-events-none blur-sm" : "")}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={authStatus === "authed" ? <Navigate to="/app" replace /> : <LandingPage />}
            />
            <Route
              path="/auth/login"
              element={<LoginPage onAuthSuccess={onAuthSuccess} />}
            />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route
              path="/app"
              element={
                <RequireAuth authStatus={authStatus}>
                  <CabinetLayout
                    activeSessionExists={Boolean(activeSession)}
                    onStartSession={onStartSession}
                    refreshTick={refreshTick}
                  />
                </RequireAuth>
              }
            />
            <Route
              path="/app/projects/:projectId"
              element={
                <RequireAuth authStatus={authStatus}>
                  <CabinetLayout
                    activeSessionExists={Boolean(activeSession)}
                    onStartSession={onStartSession}
                    refreshTick={refreshTick}
                  />
                </RequireAuth>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </div>

      {activeSession && (
        <SessionOverlay session={activeSession} onSessionFinished={onSessionFinished} />
      )}
    </>
  );
}
