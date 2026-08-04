"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cartStore";
import { useAccountStore } from "@/lib/store/accountStore";
import { CartSummary } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { products } from "@/lib/data/products";
import { Modal } from "@/components/ui/Modal";
import { AddressForm } from "@/components/account/AddressForm";
import { Plus } from "lucide-react";

export default function CheckoutPage() {
  const items = useCartStore(s => s.items);
  const clearCart = useCartStore(s => s.clearCart);
  const { addresses } = useAccountStore();
  const router = useRouter();
  
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [payment, setPayment] = useState("card");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      router.push("/shop");
    }
  }, [items.length, router]);

  // Update selected address when addresses change if none selected
  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      setSelectedAddressId(addresses.find(a => a.isDefault)?.id || addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddressId) {
      alert("Please select a delivery address.");
      return;
    }
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
            <h2 className="text-xl font-bold mb-4">1. Order Items</h2>
            <Card className="p-6">
              <div className="space-y-4">
                {items.map(item => {
                  const product = products.find(p => p.slug === item.productSlug);
                  const displayName = product?.name || item.name || "Unknown Product";
                  const displayPrice = product?.basePrice || item.price || 0;
                  const displayImage = item.previewThumbnail || item.image || product?.images?.[0] || "";

                  return (
                    <div key={item.id} className="flex gap-4 items-center border-b border-black/5 pb-4 last:border-0 last:pb-0">
                      <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={displayImage} alt={displayName} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{displayName}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-sm">₹{displayPrice * item.quantity}</p>
                    </div>
                  );
                })}
              </div>
            </Card>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">2. Delivery Address</h2>
            <Card className="p-6">
              <div className="space-y-4">
                {addresses.length === 0 ? (
                  <p className="text-sm text-[var(--color-text-muted)]">No saved addresses.</p>
                ) : (
                  addresses.map(addr => (
                    <label key={addr.id} className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${selectedAddressId === addr.id ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-black/10 hover:border-black/20'}`}>
                      <input 
                        type="radio" 
                        name="address" 
                        value={addr.id} 
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 accent-[var(--color-primary)]" 
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold">{addr.fullName}</span>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full font-medium">{addr.label}</span>
                        </div>
                        <p className="text-sm text-[var(--color-text-muted)]">{addr.flatHouse}, {addr.areaStreet}</p>
                        <p className="text-sm text-[var(--color-text-muted)]">{addr.city}, {addr.state} {addr.pinCode}</p>
                        <p className="text-sm text-[var(--color-text-muted)] mt-1">Phone: {addr.mobileNumber}</p>
                      </div>
                    </label>
                  ))
                )}
                
                <button 
                  type="button" 
                  onClick={() => setIsAddressModalOpen(true)}
                  className="flex items-center gap-2 text-sm font-bold text-[var(--color-primary)] mt-2 hover:underline"
                >
                  <Plus className="h-4 w-4" /> Add a new address
                </button>
              </div>
            </Card>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">3. Payment Method</h2>
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

      <Modal isOpen={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)} title="Add a new address">
        <AddressForm 
          onSuccess={() => setIsAddressModalOpen(false)} 
          onCancel={() => setIsAddressModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}
