import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 active:scale-95 hover:scale-[1.02]",
          {
            "bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-soft-lift hover:opacity-90": variant === 'primary',
            "bg-[var(--color-secondary)] text-white hover:opacity-90": variant === 'secondary',
            "border border-[var(--color-primary)]/20 bg-transparent hover:bg-[var(--color-primary)]/5 text-[var(--color-primary)]": variant === 'outline',
            "hover:bg-[var(--color-primary)]/5 text-[var(--color-primary)]": variant === 'ghost',
            "glass text-[var(--color-primary)] hover:bg-white/80": variant === 'glass',
            "h-9 px-4 py-2": size === 'sm',
            "h-11 px-6 py-2": size === 'md',
            "h-14 px-8 py-3 text-base": size === 'lg',
            "h-10 w-10": size === 'icon',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
