"use client";

import { useCartStore } from "@/lib/store/cartStore";

export function CartSummary() {
  const items = useCartStore(s => s.items);
  
  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const shipping = 0; // free shipping
  const total = subtotal + shipping;

  return (
    <div className="rounded-[26px] bg-[var(--color-surface-dim)] p-6">
      <h3 className="font-bold text-lg mb-4">Order Summary</h3>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-[var(--color-text-muted)]">Subtotal</span>
          <span className="font-medium">₹{subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--color-text-muted)]">Shipping</span>
          <span className="font-medium">{shipping === 0 ? "Free" : `₹${shipping}`}</span>
        </div>
        <div className="border-t border-black/5 pt-3 flex justify-between font-bold text-lg mt-2">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>
    </div>
  );
}
