import Link from "next/link";
import { categories } from "@/lib/data/categories";
import { Chip } from "../ui/Chip";

export function CategoryChips({ activeCategory }: { activeCategory: string }) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-4 pt-2 -mx-6 px-6 lg:hidden">
      {categories.map((cat) => (
        <Link key={cat.id} href={cat.id === "all" ? "/shop" : `/shop/${cat.id}`}>
          <Chip active={activeCategory === cat.id} className="whitespace-nowrap">
            {cat.label}
          </Chip>
        </Link>
      ))}
    </div>
  );
}
