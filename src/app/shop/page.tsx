import { products } from "@/lib/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CategoryRail } from "@/components/product/CategoryRail";
import { CategoryChips } from "@/components/product/CategoryChips";
import { FilterSortBar } from "@/components/product/FilterSortBar";
import { SearchBar } from "@/components/product/SearchBar";

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ q?: string; sort?: string; minPrice?: string; maxPrice?: string }> }) {
  const resolvedParams = await searchParams;
  let filteredProducts = [...products];
  
  if (resolvedParams.q) {
    const lowerQ = resolvedParams.q.toLowerCase();
    filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(lowerQ));
  }
  
  if (resolvedParams.minPrice) {
    filteredProducts = filteredProducts.filter(p => p.basePrice >= Number(resolvedParams.minPrice));
  }
  
  if (resolvedParams.maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.basePrice <= Number(resolvedParams.maxPrice));
  }

  if (resolvedParams.sort === "price-asc") {
    filteredProducts.sort((a, b) => a.basePrice - b.basePrice);
  } else if (resolvedParams.sort === "price-desc") {
    filteredProducts.sort((a, b) => b.basePrice - a.basePrice);
  } else if (resolvedParams.sort === "name-asc") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="font-serif text-4xl font-bold text-[var(--color-primary)] italic">Shop All</h1>
        <SearchBar />
      </div>
      
      <div className="flex flex-col lg:flex-row lg:gap-8">
        <div className="hidden lg:block">
          <CategoryRail activeCategory="all" />
        </div>
        
        <div className="flex-1">
          <CategoryChips activeCategory="all" />
          <FilterSortBar />
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  );
}
