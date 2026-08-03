"use client";

import { cn } from "@/lib/utils";

export function VariantPills({ 
  options, 
  selected, 
  onChange 
}: { 
  options: string[]; 
  selected?: string; 
  onChange: (val: string) => void 
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            "rounded-xl border px-4 py-2 text-sm font-medium transition-colors",
            selected === opt 
              ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]" 
              : "border-black/10 bg-white text-[var(--color-text-muted)] hover:border-black/30"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
