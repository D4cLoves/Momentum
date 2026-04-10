import * as React from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ModalShellProps = {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}

export function ModalShell({
  open,
  onClose,
  title,
  subtitle,
  children,
  className,
}: ModalShellProps) {
  React.useEffect(() => {
    if (!open) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open, onClose])

  if (!open) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 px-4 py-6 backdrop-blur-md"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "panel-surface w-full max-w-2xl border-border/75 p-6 shadow-[0_28px_90px_rgba(2,9,17,0.58)]",
          className
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.23em] text-muted-foreground">
              Momentum
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-foreground">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          <Button variant="ghost" size="icon-sm" aria-label="Close" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        {children}
      </div>
    </div>
  )
}
