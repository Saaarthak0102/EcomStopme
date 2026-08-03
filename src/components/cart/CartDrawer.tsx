"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/store/cartStore";
import { CartLineItem } from "./CartLineItem";
import { Button } from "../ui/Button";
import { X } from "lucide-react";

export function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer } = useCartStore();

  if (!isDrawerOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity" onClick={closeDrawer} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[var(--color-surface-white)] shadow-2xl flex flex-col animate-in slide-in-from-right">
        <div className="flex items-center justify-between p-6 border-b border-black/5">
          <h2 className="text-xl font-bold font-serif italic text-[var(--color-primary)]">Your Cart</h2>
          <button onClick={closeDrawer} className="text-[var(--color-text-muted)] hover:text-black">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center text-[var(--color-text-muted)] mt-12">
              <p>Your cart is empty.</p>
              <Button variant="outline" className="mt-4" onClick={closeDrawer}>Continue Shopping</Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {items.map(item => <CartLineItem key={item.id} item={item} />)}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-black/5 bg-[var(--color-surface-dim)]">
            <Link href="/checkout" onClick={closeDrawer}>
              <Button size="lg" className="w-full">Proceed to Checkout</Button>
            </Link>
            <Link href="/cart" onClick={closeDrawer} className="block text-center mt-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
