import { products } from "@/lib/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CategoryRail } from "@/components/product/CategoryRail";
import { CategoryChips } from "@/components/product/CategoryChips";
import { FilterSortBar } from "@/components/product/FilterSortBar";
import { Search } from "lucide-react";

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="font-serif text-4xl font-bold text-[var(--color-primary)] italic">Shop All</h1>
        <div className="relative w-full md:w-72">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-10 pr-4 py-2 border border-black/10 rounded-full bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row lg:gap-8">
        <div className="hidden lg:block">
          <CategoryRail activeCategory="all" />
        </div>
        
        <div className="flex-1">
          <CategoryChips activeCategory="all" />
          <FilterSortBar />
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}
