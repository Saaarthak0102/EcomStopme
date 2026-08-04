"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    router.push(`/shop?${params.toString()}`);
  };

  const handleClear = () => {
    setQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full md:w-72">
      <input 
        type="text" 
        placeholder="Search products..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-10 pr-10 py-2 border border-black/10 rounded-full bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
      />
      <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer">
        <Search className="h-5 w-5 text-gray-400 hover:text-black" />
      </button>
      {query && (
        <button type="button" onClick={handleClear} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
          <X className="h-4 w-4 text-gray-400 hover:text-black" />
        </button>
      )}
    </form>
  );
}
