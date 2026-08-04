"use client";

import { useState, useEffect, useRef } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { BottomSheet } from "../ui/BottomSheet";
import { useRouter, useSearchParams } from "next/navigation";

export function FilterSortBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  useEffect(() => {
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
  }, [searchParams]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");
    
    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    router.push(`?${params.toString()}`);
    setIsFilterOpen(false);
  };

  const applySort = (sortVal: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sortVal) params.set("sort", sortVal);
    else params.delete("sort");
    router.push(`?${params.toString()}`);
    setIsSortOpen(false);
  };

  const currentSort = searchParams.get("sort");
  const sortLabel = currentSort === "price-asc" ? "Price: Low to High" : 
                    currentSort === "price-desc" ? "Price: High to Low" : 
                    currentSort === "name-asc" ? "Name: A to Z" : "Sort";

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
          <div className="relative" ref={sortRef}>
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm font-medium hover:bg-black/5"
            >
              {sortLabel} <ChevronDown className="h-4 w-4" />
            </button>
            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-black/10 rounded-xl shadow-lg z-50 py-2">
                <button onClick={() => applySort("")} className="w-full text-left px-4 py-2 hover:bg-black/5 text-sm text-gray-500">Default (None)</button>
                <button onClick={() => applySort("price-asc")} className="w-full text-left px-4 py-2 hover:bg-black/5 text-sm">Price: Low to High</button>
                <button onClick={() => applySort("price-desc")} className="w-full text-left px-4 py-2 hover:bg-black/5 text-sm">Price: High to Low</button>
                <button onClick={() => applySort("name-asc")} className="w-full text-left px-4 py-2 hover:bg-black/5 text-sm">Name: A to Z</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomSheet isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} title="Filters">
        <div className="space-y-6">
          <div>
            <h4 className="mb-3 font-semibold">Price Range</h4>
            <div className="flex gap-4">
              <input 
                type="number" 
                placeholder="Min" 
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm" 
              />
              <input 
                type="number" 
                placeholder="Max" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm" 
              />
            </div>
          </div>
          <button onClick={applyFilters} className="w-full rounded-xl bg-[var(--color-primary)] py-3 text-sm font-bold text-white">
            Apply Filters
          </button>
        </div>
      </BottomSheet>
    </>
  );
}
