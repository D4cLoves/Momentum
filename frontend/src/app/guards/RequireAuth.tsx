import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type AuthStatus = "unknown" | "guest" | "authed";

export default function RequireAuth({
  authStatus,
  children,
}: {
  authStatus: AuthStatus;
  children: ReactNode;
}) {
  if (authStatus === "unknown") {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (authStatus === "guest") {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}

