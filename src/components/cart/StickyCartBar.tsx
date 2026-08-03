"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/store/cartStore";
import { products } from "@/lib/data/products";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function StickyCartBar() {
  const items = useCartStore(s => s.items);
  const isDesktop = useMediaQuery("lg");
  
  if (isDesktop || items.length === 0) return null;

  const total = items.reduce((acc, item) => {
    const p = products.find(prod => prod.slug === item.productSlug);
    return acc + (p?.basePrice || 0) * item.quantity;
  }, 0);

  return (
    <div className="fixed bottom-16 left-0 right-0 z-30 bg-white p-3 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] border-t border-black/5 animate-in slide-in-from-bottom-5">
      <div className="flex items-center justify-between rounded-xl bg-[var(--color-primary)] px-4 py-3 text-[var(--color-on-primary)] shadow-soft-lift">
        <div className="flex flex-col">
          <span className="text-xs opacity-80">{items.length} item{items.length > 1 ? 's' : ''}</span>
          <span className="font-bold">₹{total}</span>
        </div>
        <Link href="/cart" className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
          View Cart <span className="text-lg">→</span>
        </Link>
      </div>
    </div>
  );
}
