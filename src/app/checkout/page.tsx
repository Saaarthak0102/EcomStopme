"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cartStore";
import { CartSummary } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function CheckoutPage() {
  const items = useCartStore(s => s.items);
  const clearCart = useCartStore(s => s.clearCart);
  const router = useRouter();
  
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("card");

  useEffect(() => {
    if (items.length === 0) {
      router.push("/shop");
    }
  }, [items.length, router]);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    clearCart();
    router.push("/checkout/success");
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8">
      <h1 className="mb-8 font-serif text-3xl font-bold italic text-[var(--color-primary)]">Checkout</h1>
      
      <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="flex-1 space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-4">1. Delivery Address</h2>
            <Card className="p-6">
              <textarea 
                required
                className="w-full rounded-xl border border-black/10 p-3 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                rows={3}
                placeholder="Enter full address..."
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </Card>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">2. Payment Method</h2>
            <Card className="p-6 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="payment" value="card" checked={payment === "card"} onChange={() => setPayment("card")} className="accent-[var(--color-primary)]" />
                <span className="font-medium">Credit / Debit Card</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="payment" value="upi" checked={payment === "upi"} onChange={() => setPayment("upi")} className="accent-[var(--color-primary)]" />
                <span className="font-medium">UPI</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="payment" value="cod" checked={payment === "cod"} onChange={() => setPayment("cod")} className="accent-[var(--color-primary)]" />
                <span className="font-medium">Cash on Delivery</span>
              </label>
            </Card>
          </section>
        </div>

        <div className="lg:w-[400px]">
          <div className="sticky top-24">
            <CartSummary />
            <Button size="lg" type="submit" className="w-full mt-6">Place Order</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
