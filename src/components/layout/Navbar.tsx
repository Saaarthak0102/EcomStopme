"use client";

import Link from "next/link";
import { Search, ShoppingBag, User } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function Navbar() {
  const isDesktop = useMediaQuery("lg");
  const cartItems = useCartStore((state) => state.items);
  const openDrawer = useCartStore((state) => state.openDrawer);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (!isDesktop) return null;

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--color-surface)]/80 backdrop-blur-md border-b border-black/5">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <Link href="/" className="text-3xl font-bold italic font-serif text-[var(--color-primary)]">
          Stopme
        </Link>

        <nav className="hidden lg:flex gap-8">
          <Link href="/" className="nav-underline text-[15px] font-medium text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors relative">
            Home
          </Link>
          <Link href="/shop" className="nav-underline text-[15px] font-medium text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors relative">
            Shop
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="h-5 w-5 text-[var(--color-text-primary)] cursor-pointer" />
          </div>
          <Link href="/account" className="text-[var(--color-text-primary)] hover:text-[var(--color-primary)]">
            <User className="h-5 w-5" />
          </Link>
          <button onClick={openDrawer} className="relative text-[var(--color-text-primary)] hover:text-[var(--color-primary)]">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .nav-underline::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -4px;
          left: 0;
          background-color: var(--color-primary);
          transition: width 0.2s ease;
        }
        .nav-underline:hover::after {
          width: 100%;
        }
      `}} />
    </header>
  );
}
