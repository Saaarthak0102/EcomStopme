import { products } from "@/lib/data/products";
import { categories } from "@/lib/data/categories";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CategoryRail } from "@/components/product/CategoryRail";
import { CategoryChips } from "@/components/product/CategoryChips";
import { FilterSortBar } from "@/components/product/FilterSortBar";
import { notFound } from "next/navigation";
import { SearchBar } from "@/components/product/SearchBar";

export default async function CategoryPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ category: string }>;
  searchParams: Promise<{ q?: string; sort?: string; minPrice?: string; maxPrice?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const categoryId = resolvedParams.category;
  
  const category = categories.find((c) => c.id === categoryId);
  if (!category) {
    notFound();
  }

  let filteredProducts = products.filter((p) => p.category === categoryId);

  if (resolvedSearchParams.q) {
    const lowerQ = resolvedSearchParams.q.toLowerCase();
    filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(lowerQ));
  }
  
  if (resolvedSearchParams.minPrice) {
    filteredProducts = filteredProducts.filter(p => p.basePrice >= Number(resolvedSearchParams.minPrice));
  }
  
  if (resolvedSearchParams.maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.basePrice <= Number(resolvedSearchParams.maxPrice));
  }

  if (resolvedSearchParams.sort === "price-asc") {
    filteredProducts.sort((a, b) => a.basePrice - b.basePrice);
  } else if (resolvedSearchParams.sort === "price-desc") {
    filteredProducts.sort((a, b) => b.basePrice - a.basePrice);
  } else if (resolvedSearchParams.sort === "name-asc") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="font-serif text-4xl font-bold text-[var(--color-primary)] italic">{category.label}</h1>
        <SearchBar />
      </div>
      
      <div className="flex flex-col lg:flex-row lg:gap-8">
        <div className="hidden lg:block">
          <CategoryRail activeCategory={categoryId} />
        </div>
        
        <div className="flex-1">
          <CategoryChips activeCategory={categoryId} />
          <FilterSortBar />
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  );
}
