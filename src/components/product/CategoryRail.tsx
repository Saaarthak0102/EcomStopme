import Link from "next/link";
import { categories } from "@/lib/data/categories";

export function CategoryRail({ activeCategory }: { activeCategory: string }) {
  return (
    <div className="w-[220px] flex-shrink-0">
      <div className="sticky top-24 rounded-2xl bg-[var(--color-surface-white)] p-4 shadow-soft-lift">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Categories</h3>
        <ul className="space-y-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <li key={cat.id}>
                <Link
                  href={cat.id === "all" ? "/shop" : `/shop/${cat.id}`}
                  className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive 
                      ? "border-l-2 border-[var(--color-primary)] bg-[var(--color-primary)]/5 font-semibold text-[var(--color-primary)]" 
                      : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-dim)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  {cat.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
