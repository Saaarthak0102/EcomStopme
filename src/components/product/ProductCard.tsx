import Link from "next/link";
import { Product } from "@/lib/types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card hoverLift className="flex h-full flex-col overflow-hidden">
      <div className="relative aspect-square w-full bg-[var(--color-surface-dim)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 text-sm font-semibold line-clamp-1">{product.name}</h3>
        <p className="mb-4 text-sm text-[var(--color-text-muted)]">
          {product.variants ? `From ₹${product.basePrice}` : `₹${product.basePrice}`}
        </p>
        <div className="mt-auto">
          {product.requiresPhoto || product.variants ? (
            <Link href={`/product/${product.slug}`} className="block w-full">
              <Button variant="primary" size="sm" className="w-full">
                + Customize
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" className="w-full">
              + Add
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
