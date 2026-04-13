import {
  CustomSidebarProvider,
  CustomSidebar,
  CustomSidebarHeader,
  CustomSidebarContent,
  CustomSidebarFooter,
  CustomSidebarInset,
  CustomSidebarTrigger,
  CustomGroup,
  CustomMenu,
  CustomMenuItem,
  CustomMenuButton,
  CustomCollapsibleItem,
} from "@/components/custom-sidebar"
import {
  SquareTerminal,
  Bot,
  BookOpen,
  Settings2,
  Frame,
  PieChart,
  Map,
} from "lucide-react"

const NAV = [
  {
    title: "Playground",
    icon: <SquareTerminal className="size-4" />,
    active: true,
    items: [{ title: "History" }, { title: "Starred" }, { title: "Settings" }],
  },
  {
    title: "Models",
    icon: <Bot className="size-4" />,
    items: [{ title: "Genesis" }, { title: "Explorer" }, { title: "Quantum" }],
  },
  {
    title: "Documentation",
    icon: <BookOpen className="size-4" />,
    items: [
      { title: "Introduction" },
      { title: "Get Started" },
      { title: "Tutorials" },
      { title: "Changelog" },
    ],
  },
  {
    title: "Settings",
    icon: <Settings2 className="size-4" />,
    items: [{ title: "General" }, { title: "Team" }, { title: "Billing" }, { title: "Limits" }],
  },
]

const PROJECTS = [
  { name: "Design Engineering", icon: <Frame className="size-4" /> },
  { name: "Sales & Marketing", icon: <PieChart className="size-4" /> },
  { name: "Travel", icon: <Map className="size-4" /> },
]

export function CabinetCustomPage() {
  return (
    <CustomSidebarProvider>
      <CustomSidebar collapsible="icon">
        <CustomSidebarHeader>
          <CustomMenu>
            <CustomMenuItem>
              <CustomMenuButton isActive>Acme Inc</CustomMenuButton>
            </CustomMenuItem>
          </CustomMenu>
        </CustomSidebarHeader>

        <CustomSidebarContent>
          <CustomGroup label="Platform">
            <CustomMenu>
              {NAV.map((item) => (
                <CustomMenuItem key={item.title}>
                  <CustomCollapsibleItem icon={item.icon} title={item.title} defaultOpen={item.active}>
                    {item.items.map((sub) => (
                      <li key={sub.title}>
                        <button className="flex h-7 w-full items-center gap-2 rounded-md px-2 text-left text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                          <span className="truncate">{sub.title}</span>
                        </button>
                      </li>
                    ))}
                  </CustomCollapsibleItem>
                </CustomMenuItem>
              ))}
            </CustomMenu>
          </CustomGroup>

          <CustomGroup label="Projects">
            <CustomMenu>
              {PROJECTS.map((p) => (
                <CustomMenuItem key={p.name}>
                  <CustomMenuButton icon={p.icon}>{p.name}</CustomMenuButton>
                </CustomMenuItem>
              ))}
            </CustomMenu>
          </CustomGroup>
        </CustomSidebarContent>

        <CustomSidebarFooter>
          <CustomMenu>
            <CustomMenuItem>
              <CustomMenuButton>Username</CustomMenuButton>
            </CustomMenuItem>
          </CustomMenu>
        </CustomSidebarFooter>
      </CustomSidebar>

      <CustomSidebarInset>
        <header className="flex h-14 items-center px-3">
          <CustomSidebarTrigger />
        </header>
      </CustomSidebarInset>
    </CustomSidebarProvider>
  )
}

