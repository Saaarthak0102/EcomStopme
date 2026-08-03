"use client";

export function EngravingField({ 
  value, 
  onChange, 
  maxLength 
}: { 
  value: string; 
  onChange: (val: string) => void; 
  maxLength: number 
}) {
  return (
    <div className="space-y-2">
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        placeholder="e.g. Happy Anniversary!"
        className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
      />
      <div className="flex justify-end text-xs text-[var(--color-text-muted)]">
        {value.length} / {maxLength}
      </div>
    </div>
  );
}
