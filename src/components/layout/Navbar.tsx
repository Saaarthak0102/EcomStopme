"use client";

import Link from "next/link";
import { ShoppingBag, User, Package, MapPin, CreditCard, LogOut } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useState, useRef, useEffect } from "react";

export function Navbar() {
  const isDesktop = useMediaQuery("lg");
  const cartItems = useCartStore((state) => state.items);
  const openDrawer = useCartStore((state) => state.openDrawer);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isDesktop) return null;

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--color-surface)]/80 backdrop-blur-md border-b border-black/5">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <Link href="/" className="text-3xl font-bold italic font-serif text-[var(--color-primary)]">
          Stopme
        </Link>

        <nav className="hidden lg:flex gap-8">
          <Link href="/shop" className="nav-underline text-[15px] font-medium text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors relative">
            Shop
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="text-[var(--color-text-primary)] hover:text-[var(--color-primary)] flex items-center justify-center"
            >
              <User className="h-5 w-5" />
            </button>
            
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-black/5 py-2 z-50">
                <Link href="/account" className="flex items-center gap-3 px-4 py-2 hover:bg-black/5 text-sm" onClick={() => setIsProfileOpen(false)}>
                  <User className="h-4 w-4" /> Account Details
                </Link>
                <Link href="/account/addresses" className="flex items-center gap-3 px-4 py-2 hover:bg-black/5 text-sm" onClick={() => setIsProfileOpen(false)}>
                  <MapPin className="h-4 w-4" /> Addresses
                </Link>
                <Link href="/account/payment-methods" className="flex items-center gap-3 px-4 py-2 hover:bg-black/5 text-sm" onClick={() => setIsProfileOpen(false)}>
                  <CreditCard className="h-4 w-4" /> Payment Methods
                </Link>
                <Link href="/account/orders" className="flex items-center gap-3 px-4 py-2 hover:bg-black/5 text-sm" onClick={() => setIsProfileOpen(false)}>
                  <Package className="h-4 w-4" /> Orders
                </Link>
                <div className="h-[1px] bg-black/5 my-1" />
                <Link href="/" className="flex items-center gap-3 px-4 py-2 hover:bg-black/5 text-sm text-red-600" onClick={() => setIsProfileOpen(false)}>
                  <LogOut className="h-4 w-4" /> Log Out
                </Link>
              </div>
            )}
          </div>
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
