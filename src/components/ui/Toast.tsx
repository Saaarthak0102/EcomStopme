"use client";

import * as React from "react"
import { cn } from "@/lib/utils"

export function Toast({ message, action, visible }: { message: string, action?: React.ReactNode, visible: boolean }) {
  if (!visible) return null;
  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:bottom-4 md:left-auto md:w-80 md:right-4 animate-in slide-in-from-bottom-5">
      <div className="flex items-center justify-between rounded-xl bg-[var(--color-text-primary)] px-4 py-3 text-sm text-[var(--color-on-primary)] shadow-lg">
        <span>{message}</span>
        {action && <div>{action}</div>}
      </div>
    </div>
  )
}
