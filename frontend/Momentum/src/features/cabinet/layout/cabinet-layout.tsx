import * as React from "react"
import {
  BadgeCheck,
  Bell,
  BookOpen,
  ChevronsUpDown,
  CreditCard,
  Folder,
  Forward,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  LogOut,
  MoreHorizontal,
  PieChart,
  Plus,
  Route,
  Sparkles,
  SquareTerminal,
  Trash2,
} from "lucide-react"
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"

import { AppStarsBackground } from "@/components/background/app-stars-background"
import { AccountModal } from "@/features/cabinet/components/account-modal"
import { useCabinetData } from "@/features/cabinet/model/cabinet-data-context"
import { useAuth } from "@/features/auth/model/auth-context"
import { useIsMobile } from "@/hooks/use-mobile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuAction,
} from "@/components/animate-ui/components/radix/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/animate-ui/primitives/radix/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/animate-ui/components/radix/dropdown-menu"

const teams = [
  {
    name: "Momentum Core",
    logo: GalleryVerticalEnd,
    plan: "Workspace",
  },
  {
    name: "Momentum Lab",
    logo: SquareTerminal,
    plan: "Sandbox",
  },
]

const navMain = [
  {
    title: "Workspace",
    icon: LayoutDashboard,
    items: [
      { title: "Overview", to: "/cabinet" },
      { title: "Statistics", to: "/cabinet/stats" },
      { title: "Roadmap", to: "/cabinet/roadmap" },
    ],
  },
  {
    title: "Learning",
    icon: BookOpen,
    items: [{ title: "Clean architecture", to: "/cabinet/roadmap" }],
  },
]

function pageTitle(pathname: string) {
  if (pathname.startsWith("/cabinet/stats")) {
    return "Statistics"
  }

  if (pathname.startsWith("/cabinet/roadmap")) {
    return "Roadmap"
  }

  return "Overview"
}

export function CabinetLayout() {
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const location = useLocation()

  const { user, logout } = useAuth()
  const { projects, sessions, error } = useCabinetData()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])
  const [isAccountModalOpen, setIsAccountModalOpen] = React.useState(false)

  React.useEffect(() => {
    if (error?.status === 401) {
      logout()
      navigate("/login", { replace: true })
    }
  }, [error, logout, navigate])

  const activeSessions = sessions.filter((session) => session.isActive).length

  return (
    <>
      <div className="relative min-h-screen overflow-hidden">
        <AppStarsBackground className="opacity-70" />

        <SidebarProvider>
          <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
              <SidebarMenu>
                <SidebarMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                      >
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                          <activeTeam.logo className="size-4" />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">{activeTeam.name}</span>
                          <span className="truncate text-xs">{activeTeam.plan}</span>
                        </div>
                        <ChevronsUpDown className="ml-auto" />
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                      align="start"
                      side={isMobile ? "bottom" : "right"}
                      sideOffset={4}
                    >
                      <DropdownMenuLabel className="text-xs text-muted-foreground">
                        Workspaces
                      </DropdownMenuLabel>
                      {teams.map((team, index) => (
                        <DropdownMenuItem
                          key={team.name}
                          onClick={() => setActiveTeam(team)}
                          className="gap-2 p-2"
                        >
                          <div className="flex size-6 items-center justify-center rounded-sm border">
                            <team.logo className="size-4 shrink-0" />
                          </div>
                          {team.name}
                          <DropdownMenuShortcut>Ctrl+{index + 1}</DropdownMenuShortcut>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2 p-2">
                        <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                          <Plus className="size-4" />
                        </div>
                        <span className="font-medium text-muted-foreground">Add workspace</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Platform</SidebarGroupLabel>
                <SidebarMenu>
                  {navMain.map((item) => {
                    const isOpen = item.items.some((sub) => location.pathname === sub.to)

                    return (
                      <Collapsible key={item.title} asChild defaultOpen={isOpen} className="group/collapsible">
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton tooltip={item.title}>
                              <item.icon />
                              <span>{item.title}</span>
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton asChild isActive={location.pathname === subItem.to}>
                                    <NavLink to={subItem.to}>
                                      <span>{subItem.title}</span>
                                    </NavLink>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroup>

              <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                <SidebarGroupLabel>Projects</SidebarGroupLabel>
                <SidebarMenu>
                  {projects.slice(0, 8).map((project, index) => {
                    const ProjectIcon = index % 2 === 0 ? Frame : PieChart

                    return (
                      <SidebarMenuItem key={project.id}>
                        <SidebarMenuButton asChild>
                          <NavLink to="/cabinet">
                            <ProjectIcon />
                            <span>{project.name}</span>
                          </NavLink>
                        </SidebarMenuButton>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuAction showOnHover>
                              <MoreHorizontal />
                              <span className="sr-only">More</span>
                            </SidebarMenuAction>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className="w-48 rounded-lg"
                            side={isMobile ? "bottom" : "right"}
                            align={isMobile ? "end" : "start"}
                          >
                            <DropdownMenuItem onClick={() => navigate("/cabinet")}>
                              <Folder className="text-muted-foreground" />
                              <span>Open Project</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Forward className="text-muted-foreground" />
                              <span>Share</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem disabled>
                              <Trash2 className="text-muted-foreground" />
                              <span>Delete (from panel)</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </SidebarMenuItem>
                    )
                  })}

                  {projects.length === 0 && (
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <Route />
                        <span>No projects yet</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                      >
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage src="" alt={user?.name || "User"} />
                          <AvatarFallback className="rounded-lg">
                            {(user?.name || "MU").slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">{user?.name || "Momentum User"}</span>
                          <span className="truncate text-xs">{user?.email || "user@momentum.local"}</span>
                        </div>
                        <ChevronsUpDown className="ml-auto size-4" />
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                      side={isMobile ? "bottom" : "right"}
                      align="end"
                      sideOffset={4}
                    >
                      <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                          <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src="" alt={user?.name || "User"} />
                            <AvatarFallback className="rounded-lg">
                              {(user?.name || "MU").slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{user?.name || "Momentum User"}</span>
                            <span className="truncate text-xs">{user?.email || "user@momentum.local"}</span>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => setIsAccountModalOpen(true)}>
                          <BadgeCheck />
                          Account
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CreditCard />
                          Billing
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Bell />
                          Notifications
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Sparkles />
                          Upgrade
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          logout()
                          navigate("/login")
                        }}
                      >
                        <LogOut />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
          </Sidebar>

          <SidebarInset className="bg-transparent">
            <header className="flex h-14 shrink-0 items-center gap-2 px-2 transition-[width,height] ease-linear">
              <div className="panel-soft flex items-center gap-2 px-3 py-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">Momentum Workspace</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{pageTitle(location.pathname)}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              <div className="ml-auto hidden rounded-lg border border-border/70 bg-background/65 px-3 py-1.5 text-xs text-muted-foreground sm:block">
                {projects.length} projects | {activeSessions} active sessions
              </div>
            </header>

            <div className="flex flex-1 flex-col gap-4 p-2 pt-0 sm:p-3 sm:pt-0">
              <Outlet />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>

      <AccountModal
        open={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        user={user}
      />
    </>
  )
}
