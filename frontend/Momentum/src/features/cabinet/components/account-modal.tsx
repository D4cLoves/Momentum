import { Bell, Lock, ShieldCheck, Sparkles, UserRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { AuthUser } from "@/features/auth/model/auth-types"
import { ModalShell } from "@/features/cabinet/components/modal-shell"

type AccountModalProps = {
  open: boolean
  onClose: () => void
  user: AuthUser | null
}

const securityChecks = [
  { label: "Password rotation", status: "Backend pending" },
  { label: "2FA switch", status: "Backend pending" },
  { label: "Session policy", status: "Ready in UI" },
]

export function AccountModal({ open, onClose, user }: AccountModalProps) {
  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Account Command Panel"
      subtitle="Luxury UI stub for your future backend hooks."
      className="max-w-3xl overflow-hidden p-0"
    >
      <div className="relative border-b border-border/65 bg-[radial-gradient(circle_at_14%_20%,rgba(0,178,169,0.22),transparent_40%),radial-gradient(circle_at_88%_10%,rgba(255,182,98,0.16),transparent_44%)] px-6 py-6 sm:px-7">
        <div className="pointer-events-none absolute inset-0 opacity-80" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/35 bg-background/55 text-primary">
              <UserRound className="size-6" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{user?.name || "Momentum User"}</p>
              <p className="text-sm text-muted-foreground">{user?.email || "user@momentum.local"}</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <Sparkles className="size-3.5" />
            Premium shell
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-6 sm:p-7 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Display name
            </span>
            <Input value={user?.name || "Momentum User"} disabled />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Email
            </span>
            <Input value={user?.email || "user@momentum.local"} disabled />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Bio
            </span>
            <Textarea
              disabled
              value="Backend stub mode: this field is visual-only now and ready to be connected later."
            />
          </label>
        </div>

        <div className="space-y-4">
          <article className="panel-soft rounded-2xl p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Security state
            </p>
            <ul className="space-y-2.5">
              {securityChecks.map((item) => (
                <li key={item.label} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-sm text-foreground">
                    <ShieldCheck className="size-4 text-primary" />
                    {item.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.status}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="panel-soft rounded-2xl p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Planned actions
            </p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2" disabled>
                <Lock className="size-4" />
                Change password (stub)
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" disabled>
                <Bell className="size-4" />
                Notification rules (stub)
              </Button>
            </div>
          </article>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-border/65 px-6 py-4 sm:px-7">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button disabled>Save (backend soon)</Button>
      </div>
    </ModalShell>
  )
}
