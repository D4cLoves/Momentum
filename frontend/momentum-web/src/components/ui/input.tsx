import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-2xl border border-input/75 bg-background/82 px-4 py-2 text-base font-medium tracking-[0.01em] text-foreground shadow-[inset_0_1px_0_hsl(var(--background)/0.8),0_10px_24px_hsl(var(--foreground)/0.08)] transition-[border-color,box-shadow,background-color,transform] duration-200 outline-none caret-primary selection:bg-primary/25 file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[0.95rem] placeholder:font-normal placeholder:text-muted-foreground/85 placeholder:tracking-normal focus-visible:-translate-y-px focus-visible:border-primary/60 focus-visible:bg-background/92 focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:shadow-[inset_0_1px_0_hsl(var(--background)/0.88),0_0_0_1px_hsl(var(--primary)/0.28),0_18px_38px_hsl(var(--primary)/0.2)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/45 disabled:opacity-55 aria-invalid:border-destructive/70 aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:bg-input/35 dark:shadow-[inset_0_1px_0_hsl(var(--background)/0.35),0_10px_24px_hsl(var(--background)/0.62)] dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/60 dark:aria-invalid:ring-destructive/35",
        className
      )}
      {...props}
    />
  )
}

export { Input }
