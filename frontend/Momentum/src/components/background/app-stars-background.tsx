import { StarsBackground } from "@/components/animate-ui/components/backgrounds/stars"
import { cn } from "@/lib/utils"

type AppStarsBackgroundProps = {
  className?: string
}

export function AppStarsBackground({ className }: AppStarsBackgroundProps) {
  return (
    <StarsBackground
      pointerEvents={false}
      starColor="#FFFFFF"
      className={cn(
        "absolute inset-0 -z-10",
        "bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)]",
        className
      )}
    />
  )
}
