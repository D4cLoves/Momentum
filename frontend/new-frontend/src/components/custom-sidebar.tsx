import * as React from "react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  ChevronRight,
  ChevronsUpDown,
  MoreHorizontal,
} from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/animate-ui/primitives/radix/collapsible"

type CustomSidebarContext = {
  open: boolean
  setOpen: (v: boolean | ((v: boolean) => boolean)) => void
  openMobile: boolean
  setOpenMobile: (v: boolean | ((v: boolean) => boolean)) => void
  isMobile: boolean
}

const Ctx = React.createContext<CustomSidebarContext | null>(null)
export function useCustomSidebar() {
  const ctx = React.useContext(Ctx)
  if (!ctx) throw new Error("useCustomSidebar must be used within CustomSidebarProvider")
  return ctx
}

export function CustomSidebarProvider({
  defaultOpen = true,
  children,
  style,
  className,
}: {
  defaultOpen?: boolean
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
}) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(defaultOpen)
  const [openMobile, setOpenMobile] = React.useState(false)

  return (
    <Ctx.Provider value={{ open, setOpen, openMobile, setOpenMobile, isMobile }}>
      <div
        style={
          {
            "--custom-sidebar-width": "16rem",
            "--custom-sidebar-icon": "3rem",
            ...style,
          } as React.CSSProperties
        }
        className={cn("group/custom-sidebar flex min-h-svh w-full", className)}
      >
        {children}
      </div>
    </Ctx.Provider>
  )
}

export function CustomSidebarTrigger({ className }: { className?: string }) {
  const { isMobile, setOpenMobile, setOpen } = useCustomSidebar()
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={cn(className)}
      onClick={() => (isMobile ? setOpenMobile((v) => !v) : setOpen((v) => !v))}
    >
      <ChevronsUpDown className="size-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

export function CustomSidebarInset({
  className,
  children,
}: React.ComponentProps<"main">) {
  return (
    <main className={cn("relative flex w-full flex-1 flex-col bg-background", className)}>
      {children}
    </main>
  )
}

export function CustomSidebar({
  className,
  children,
  side = "left",
  collapsible = "icon",
}: {
  className?: string
  children: React.ReactNode
  side?: "left" | "right"
  collapsible?: "offcanvas" | "icon" | "none"
}) {
  const { isMobile, open, openMobile, setOpenMobile } = useCustomSidebar()

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          side={side}
          className="w-[--custom-sidebar-width] p-0 [&>button]:hidden"
        >
          <div className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground">
            {children}
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      data-state={open ? "expanded" : "collapsed"}
      data-collapsible={collapsible}
      data-side={side}
      className={cn("peer hidden md:block", className)}
    >
      <div
        className={cn(
          "relative bg-transparent transition-[width] duration-200 ease-linear",
          "w-[--custom-sidebar-width]",
          "data-[collapsible=icon]:data-[state=collapsed]:w-[--custom-sidebar-icon]"
        )}
      />
      <div
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh transition-[left,right,width] duration-200 ease-linear md:flex",
          "w-[--custom-sidebar-width]",
          "data-[side=left]:left-0 data-[side=right]:right-0",
          "data-[collapsible=offcanvas]:data-[state=collapsed]:data-[side=left]:-left-[--custom-sidebar-width]",
          "data-[collapsible=offcanvas]:data-[state=collapsed]:data-[side=right]:-right-[--custom-sidebar-width]",
          "data-[collapsible=icon]:data-[state=collapsed]:w-[--custom-sidebar-icon]"
        )}
      >
        <div className="flex size-full flex-col bg-sidebar text-sidebar-foreground">
          {children}
        </div>
      </div>
    </div>
  )
}

export function CustomSidebarHeader({ children }: React.ComponentProps<"div">) {
  return <div className="flex flex-col gap-2 p-2">{children}</div>
}

export function CustomSidebarFooter({ children }: React.ComponentProps<"div">) {
  return <div className="flex flex-col gap-2 p-2 mt-auto">{children}</div>
}

export function CustomSidebarContent({ children }: React.ComponentProps<"div">) {
  return (
    <div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-1 overflow-auto">
      {children}
    </div>
  )
}

export function CustomGroup({
  label,
  children,
  action,
  className,
}: {
  label?: React.ReactNode
  action?: React.ReactNode
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("relative flex w-full min-w-0 flex-col p-2", className)}>
      {label && (
        <div className="flex h-8 items-center px-2 text-xs text-sidebar-foreground/70">
          {label}
          {action && <div className="ml-auto">{action}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

export function CustomMenu({ children }: React.ComponentProps<"ul">) {
  return <ul className="flex w-full min-w-0 flex-col gap-1">{children}</ul>
}

export function CustomMenuItem({ children }: React.ComponentProps<"li">) {
  return <li className="group relative">{children}</li>
}

export function CustomMenuButton({
  icon,
  children,
  right,
  isActive,
  onClick,
}: {
  icon?: React.ReactNode
  children?: React.ReactNode
  right?: React.ReactNode
  isActive?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}) {
  return (
    <button
      onClick={onClick}
      data-active={isActive}
      className={cn(
        "flex w-full items-center gap-2 rounded-md p-2 text-left text-sm transition-colors",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
      )}
    >
      {icon}
      <span className="truncate">{children}</span>
      {right && <span className="ml-auto">{right}</span>}
    </button>
  )
}

export function CustomCollapsibleItem({
  icon,
  title,
  children,
  defaultOpen,
}: {
  icon?: React.ReactNode
  title: React.ReactNode
  children?: React.ReactNode
  defaultOpen?: boolean
}) {
  return (
    <Collapsible defaultOpen={defaultOpen} className="group/collapsible">
      <CollapsibleTrigger asChild>
        <CustomMenuButton
          icon={icon}
          right={
            <ChevronRight className="size-4 transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
          }
        >
          {title}
        </CustomMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul className="mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5">
          {children}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function CustomMenuAction({ children }: React.ComponentProps<"button">) {
  return (
    <button className="absolute top-1.5 right-1 z-[1] flex aspect-square w-5 items-center justify-center rounded-md text-sidebar-foreground transition-opacity hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:opacity-0 group-hover:opacity-100">
      {children ?? <MoreHorizontal className="size-4" />}
    </button>
  )
}

