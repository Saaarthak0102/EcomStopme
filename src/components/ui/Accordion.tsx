"use client";

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export function Accordion({ items, className }: { items: { title: string, content: React.ReactNode }[], className?: string }) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, i) => (
        <div key={i} className="border-b border-black/5 pb-2">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center justify-between py-3 text-left font-medium transition-all hover:text-[var(--color-primary)]"
          >
            {item.title}
            <ChevronDown className={cn("h-4 w-4 transition-transform", openIndex === i && "rotate-180")} />
          </button>
          <div className={cn("overflow-hidden text-sm text-[var(--color-text-muted)] transition-all", openIndex === i ? "max-h-96 pb-3" : "max-h-0")}>
            {item.content}
          </div>
        </div>
      ))}
    </div>
  )
}
