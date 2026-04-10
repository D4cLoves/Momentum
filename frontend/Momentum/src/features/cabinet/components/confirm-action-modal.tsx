import { Button } from "@/components/ui/button"
import { ModalShell } from "@/features/cabinet/components/modal-shell"

type ConfirmActionModalProps = {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  busy?: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmActionModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  busy = false,
  onCancel,
  onConfirm,
}: ConfirmActionModalProps) {
  return (
    <ModalShell
      open={open}
      onClose={onCancel}
      title={title}
      subtitle="This action changes backend data."
      className="max-w-lg"
    >
      <div className="space-y-5">
        <div className="rounded-xl border border-border/65 bg-background/55 px-4 py-4 text-sm text-muted-foreground">
          {description}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" disabled={busy} onClick={onConfirm}>
            {busy ? "Processing..." : confirmLabel}
          </Button>
        </div>
      </div>
    </ModalShell>
  )
}
