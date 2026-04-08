import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export function CabinetPage() {
  return (
    <SidebarProvider className="h-full min-h-0">
      <AppSidebar />

      <SidebarInset className="bg-transparent">
        <header className="flex h-14 items-center px-3">
          <SidebarTrigger />
        </header>
      </SidebarInset>
    </SidebarProvider>
  )
}
