"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { QuantityStepper } from "@/components/product/QuantityStepper";

function formatPrice(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCartStore();

  const subtotal = items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
  const total = subtotal; // free shipping

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FBF7F4] flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-24 h-24 rounded-full bg-[#e8ddd7] flex items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-[#94492c]" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold font-serif text-[#1B1C1C] mb-2">Your cart is empty</h1>
          <p className="text-[#7A6860] text-sm">Add items to get started</p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-[#94492c] hover:bg-[#7a3b22] text-white font-semibold px-8 py-3 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF7F4]">
      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm text-[#7A6860] hover:text-[#94492c] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold font-serif text-[#1B1C1C]">Your Cart</h1>
          <p className="text-[#7A6860] text-sm mt-1">
            {items.reduce((a, i) => a + i.quantity, 0)} item
            {items.reduce((a, i) => a + i.quantity, 0) !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-[#e8ddd7] p-5 flex gap-4 items-center"
              >
                {/* Product Image */}
                <div className="relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden bg-[#FBF7F4] border border-[#e8ddd7]">
                  <Image
                    src={item.previewImage ?? ""}
                    alt={item.productName ?? "Product"}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[15px] text-[#1B1C1C] truncate">
                    {item.productName}
                  </h3>
                  {item.selectedVariants && (
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {Object.entries(item.selectedVariants).map(([k, v]) => (
                        <span
                          key={k}
                          className="text-[11px] text-[#7A6860] bg-[#FBF7F4] border border-[#e8ddd7] rounded-full px-2 py-0.5 capitalize"
                        >
                          {k}: {v}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <QuantityStepper
                      value={item.quantity}
                      onChange={(val) => updateQuantity(item.id, val)}
                    />
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[15px] text-[#1B1C1C]">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#c8b8b0] hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-[#e8ddd7] p-6 sticky top-24">
              <h2 className="font-bold text-[17px] text-[#1B1C1C] mb-5">Order Summary</h2>

              <div className="flex flex-col gap-3 text-[14px]">
                <div className="flex justify-between text-[#7A6860]">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#7A6860]">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between font-bold text-[16px] text-[#1B1C1C] pt-3 border-t border-[#e8ddd7] mt-1">
                  <span>Total</span>
                  <span className="text-[#94492c]">{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-[#94492c] hover:bg-[#7a3b22] text-white font-bold py-4 rounded-full text-[16px] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </Link>

              <p className="text-center text-[11px] text-[#7A6860] mt-3">
                🔒 Secure checkout · Free shipping · Easy returns
              </p>
            </div>
          </div>
        </div>

        {/* Bottom padding for mobile sticky bar */}
        <div className="h-24 lg:hidden" />
      </div>
    </div>
  );
}
