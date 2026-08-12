"use client";

import Link from "next/link";
import { Product } from "@/lib/types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { useCartStore } from "@/lib/store/cartStore";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const openDrawer = useCartStore((state) => state.openDrawer);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: Date.now().toString(),
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      quantity: 1,
      unitPrice: product.base_price,
      selectedVariants: {},
      selectedVariantIds: {},
      previewImage: product.images[0] ?? "",
      hasNfc: product.has_nfc,
      rakhiType: product.rakhi_type ?? "none",
    });
    openDrawer();
  };

  return (
    <Card hoverLift className="flex h-full flex-col overflow-hidden">
      <div className="relative aspect-square w-full bg-[var(--color-surface-dim)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 text-sm font-semibold line-clamp-1">{product.name}</h3>
        <p className="mb-4 text-sm text-[var(--color-text-muted)]">
          {product.variants?.length ? `From ₹${(product.base_price / 100).toLocaleString("en-IN")}` : `₹${(product.base_price / 100).toLocaleString("en-IN")}`}
        </p>
        <div className="mt-auto">
          {product.variants?.length ? (
            <Link href={`/shop`} className="block w-full">
              <Button variant="primary" size="sm" className="w-full">
                + Customize
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" className="w-full" onClick={handleAdd}>
              + Add
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
