import { products } from "@/lib/data/products";
import { categories } from "@/lib/data/categories";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CategoryRail } from "@/components/product/CategoryRail";
import { CategoryChips } from "@/components/product/CategoryChips";
import { FilterSortBar } from "@/components/product/FilterSortBar";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const categoryId = resolvedParams.category;
  
  const category = categories.find((c) => c.id === categoryId);
  if (!category) {
    notFound();
  }

  const categoryProducts = products.filter((p) => p.category === categoryId);

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8">
      <h1 className="mb-8 font-serif text-4xl font-bold text-[var(--color-primary)] italic">{category.label}</h1>
      
      <div className="flex flex-col lg:flex-row lg:gap-8">
        <div className="hidden lg:block">
          <CategoryRail activeCategory={categoryId} />
        </div>
        
        <div className="flex-1">
          <CategoryChips activeCategory={categoryId} />
          <FilterSortBar />
          <ProductGrid products={categoryProducts} />
        </div>
      </div>
    </div>
  );
}
