"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/store/cartStore";
import { CartItem } from "@/lib/types";
import { QuantityStepper } from "../product/QuantityStepper";
import { Trash2 } from "lucide-react";

export function CartLineItem({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCartStore();

  const displayName = item.productName ?? "Unknown Product";
  const displayImage = item.previewImage ?? "";

  return (
    <div className="flex gap-4 py-4 border-b border-black/5">
      <div className="flex-shrink-0">
        <div className="h-20 w-20 rounded-xl bg-[var(--color-surface-dim)] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={displayImage} alt={displayName} className="h-full w-full object-cover" />
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold text-sm">{displayName}</h4>
            <div className="mt-1 text-xs text-[var(--color-text-muted)] space-y-0.5">
              {item.selectedVariants && Object.entries(item.selectedVariants).map(([k, v]) => (
                <p key={k} className="capitalize">{k}: {v}</p>
              ))}
            </div>
          </div>
          <p className="font-semibold text-sm">₹{((item.unitPrice / 100) * item.quantity).toLocaleString("en-IN")}</p>
        </div>

        <div className="flex justify-between items-center mt-3">
          <QuantityStepper value={item.quantity} onChange={(val) => updateQuantity(item.id, val)} />
          <button onClick={() => removeItem(item.id)} className="text-[var(--color-text-muted)] hover:text-red-500 transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
