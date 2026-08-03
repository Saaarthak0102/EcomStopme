"use client";

import { Minus, Plus } from "lucide-react";

export function QuantityStepper({ value, onChange }: { value: number; onChange: (val: number) => void }) {
  return (
    <div className="flex h-10 w-28 items-center justify-between rounded-xl border border-black/10 bg-white px-2">
      <button 
        onClick={() => onChange(Math.max(1, value - 1))}
        className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-black/5 text-[var(--color-text-primary)]"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="text-sm font-semibold">{value}</span>
      <button 
        onClick={() => onChange(value + 1)}
        className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-black/5 text-[var(--color-text-primary)]"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
