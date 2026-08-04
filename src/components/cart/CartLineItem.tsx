"use client";

import Link from "next/link";
import { products } from "@/lib/data/products";
import { useCartStore } from "@/lib/store/cartStore";
import { useStudioStore } from "@/lib/store/studioStore";
import { CartItem } from "@/lib/types";
import { QuantityStepper } from "../product/QuantityStepper";
import { Trash2 } from "lucide-react";

export function CartLineItem({ item }: { item: CartItem }) {
  const product = products.find(p => p.slug === item.productSlug);
  const { updateQuantity, removeItem } = useCartStore();
  const setField = useStudioStore(s => s.setField);

  const displayName = product?.name || item.name || "Unknown Product";
  const displayPrice = product?.basePrice || item.price || 0;
  const displayImage = item.previewThumbnail || item.image || product?.images?.[0] || "";

  if (!product && !item.name) return null;

  const handleEditClick = () => {
    if (!product) return;
    setField(product.slug, "uploadedImage", item.uploadedImage);
    setField(product.slug, "engravingText", item.engravingText);
    if (item.selectedVariants) {
      Object.entries(item.selectedVariants).forEach(([k, v]) => {
        useStudioStore.getState().setVariant(product.slug, k, v);
      });
    }
  };

  return (
    <div className="flex gap-4 py-4 border-b border-black/5">
      <Link href={product ? `/product/${product.slug}` : "#"} onClick={handleEditClick} className="flex-shrink-0">
        <div className="h-20 w-20 rounded-xl bg-[var(--color-surface-dim)] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={displayImage} alt={displayName} className="h-full w-full object-cover" />
        </div>
      </Link>
      
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <Link href={product ? `/product/${product.slug}` : "#"} onClick={handleEditClick}>
              <h4 className="font-semibold text-sm hover:text-[var(--color-primary)]">{displayName}</h4>
            </Link>
            <div className="mt-1 text-xs text-[var(--color-text-muted)] space-y-0.5">
              {item.selectedVariants && Object.entries(item.selectedVariants).map(([k, v]) => (
                <p key={k} className="capitalize">{k}: {v}</p>
              ))}
              {item.engravingText && <p>Engraving: &quot;{item.engravingText}&quot;</p>}
            </div>
          </div>
          <p className="font-semibold text-sm">₹{displayPrice * item.quantity}</p>
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
