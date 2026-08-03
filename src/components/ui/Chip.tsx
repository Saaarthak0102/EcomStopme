import * as React from "react"
import { cn } from "@/lib/utils"

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ className, active, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer",
        active 
          ? "bg-[var(--color-primary)] text-[var(--color-on-primary)]" 
          : "bg-[var(--color-surface-dim)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-dim-2)] hover:text-[var(--color-text-primary)]",
        className
      )}
      {...props}
    />
  )
)
Chip.displayName = "Chip"

export { Chip }
