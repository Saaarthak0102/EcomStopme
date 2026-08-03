"use client";

import { useState } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { BottomSheet } from "../ui/BottomSheet";

export function FilterSortBar() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-[var(--color-text-muted)]">Showing results</p>
        <div className="flex items-center gap-3">
          <button 
            className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm font-medium hover:bg-black/5"
            onClick={() => setIsFilterOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
          <button className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm font-medium hover:bg-black/5">
            Sort <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      <BottomSheet isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} title="Filters">
        <div className="space-y-6">
          <div>
            <h4 className="mb-3 font-semibold">Price Range</h4>
            <div className="flex gap-4">
              <input type="number" placeholder="Min" className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm" />
              <input type="number" placeholder="Max" className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm" />
            </div>
          </div>
          <button onClick={() => setIsFilterOpen(false)} className="w-full rounded-xl bg-[var(--color-primary)] py-3 text-sm font-bold text-white">
            Apply Filters
          </button>
        </div>
      </BottomSheet>
    </>
  );
}
