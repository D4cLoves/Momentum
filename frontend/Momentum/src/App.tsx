import { AppRoutes } from "@/app/routes"
import { AuthProvider } from "@/features/auth/model/auth-context"

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}