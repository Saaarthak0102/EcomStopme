"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/store/cartStore";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const items = useCartStore(s => s.items);

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8">
      <h1 className="mb-8 font-serif text-4xl font-bold text-[var(--color-primary)] italic">Shopping Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-[var(--color-text-muted)] mb-8">Looks like you haven&apos;t added any personalized goodies yet.</p>
          <Link href="/shop">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="flex-1">
            <div className="border-t border-black/5">
              {items.map(item => <CartLineItem key={item.id} item={item} />)}
            </div>
          </div>
          <div className="lg:w-[400px]">
            <CartSummary />
            <Link href="/checkout" className="block mt-6">
              <Button size="lg" className="w-full">Proceed to Checkout</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
