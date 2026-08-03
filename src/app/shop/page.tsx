import { products } from "@/lib/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CategoryRail } from "@/components/product/CategoryRail";
import { CategoryChips } from "@/components/product/CategoryChips";
import { FilterSortBar } from "@/components/product/FilterSortBar";

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8">
      <h1 className="mb-8 font-serif text-4xl font-bold text-[var(--color-primary)] italic">Shop All</h1>
      
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
