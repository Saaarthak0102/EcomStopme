import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { hoverLift?: boolean }>(
  ({ className, hoverLift, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-[26px] border border-black/5 bg-[var(--color-surface-white)] shadow-soft-lift text-[var(--color-text-primary)] transition-all duration-300",
        hoverLift && "hover:-translate-y-2 hover:shadow-[0_15px_40px_-5px_rgba(148,73,44,0.1)]",
        className
      )}
      {...props}
    />
  )
)
Card.displayName = "Card"

export { Card }
