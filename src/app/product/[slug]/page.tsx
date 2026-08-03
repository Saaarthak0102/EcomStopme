"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { products } from "@/lib/data/products";
import { PreviewCanvas } from "@/components/studio/PreviewCanvas";
import { UploadZone } from "@/components/studio/UploadZone";
import { VariantPills } from "@/components/studio/VariantPills";
import { EngravingField } from "@/components/studio/EngravingField";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import { Button } from "@/components/ui/Button";
import { useStudioStore } from "@/lib/store/studioStore";
import { useCartStore } from "@/lib/store/cartStore";

export default function ProductStudioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = products.find(p => p.slug === slug);
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore(s => s.addItem);
  const openCart = useCartStore(s => s.openDrawer);

  const session = useStudioStore(state => state.sessions[slug]);
  const setField = useStudioStore(state => state.setField);
  const setVariant = useStudioStore(state => state.setVariant);

  if (!product) return notFound();

  // Initialize variants if missing
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (product.variants && (!session || !session.selectedVariants)) {
      Object.entries(product.variants).forEach(([k, v]) => {
        if (!session?.selectedVariants?.[k] && v.length > 0) {
          setVariant(slug, k, v[0]);
        }
      });
    }
  }, [product, slug, session, setVariant]);

  const isUploadRequired = product.requiresPhoto && !session?.uploadedImage;

  const handleAddToCart = () => {
    if (isUploadRequired) return;
    
    addToCart({
      id: `${product.slug}-${Date.now()}`,
      productSlug: product.slug,
      quantity,
      selectedVariants: session?.selectedVariants || {},
      uploadedImage: session?.uploadedImage,
      engravingText: session?.engravingText,
      previewThumbnail: session?.uploadedImage || product.images[0]
    });
    openCart();
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8">
      <div className="flex flex-col lg:flex-row lg:gap-12">
        {/* Left: Preview */}
        <div className="lg:w-1/2 lg:sticky lg:top-24 lg:self-start mb-8 lg:mb-0">
          <PreviewCanvas 
            baseImage={product.images[0]} 
            userImage={session?.uploadedImage}
            engravingText={session?.engravingText}
          />
        </div>

        {/* Right: Studio Controls */}
        <div className="lg:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold font-serif italic text-[var(--color-primary)] mb-2">{product.name}</h1>
          <p className="text-2xl mb-8">₹{product.basePrice}</p>

          <div className="space-y-8 flex-1">
            {product.requiresPhoto && (
              <section>
                <h3 className="font-semibold mb-3">1. Add Your Photo</h3>
                {session?.uploadedImage ? (
                  <div className="flex gap-4 items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={session.uploadedImage} className="w-16 h-16 object-cover rounded-xl border border-black/10" alt="Uploaded" />
                    <Button variant="outline" size="sm" onClick={() => setField(slug, 'uploadedImage', undefined)}>Replace</Button>
                  </div>
                ) : (
                  <UploadZone onUpload={(url) => setField(slug, 'uploadedImage', url)} />
                )}
              </section>
            )}

            {product.variants && Object.entries(product.variants).map(([variantKey, options]) => (
              <section key={variantKey}>
                <h3 className="font-semibold mb-3 capitalize">Select {variantKey.replace(/([A-Z])/g, ' $1').trim()}</h3>
                <VariantPills 
                  options={options} 
                  selected={session?.selectedVariants?.[variantKey]} 
                  onChange={(val) => setVariant(slug, variantKey, val)}
                />
              </section>
            ))}

            {product.maxEngravingLength && (
              <section>
                <h3 className="font-semibold mb-3">Add Custom Text (Optional)</h3>
                <EngravingField 
                  value={session?.engravingText || ""} 
                  onChange={(val) => setField(slug, 'engravingText', val)} 
                  maxLength={product.maxEngravingLength}
                />
              </section>
            )}

            <section className="flex items-center gap-6 pb-20 lg:pb-0 pt-4 border-t border-black/5 mt-8">
              <QuantityStepper value={quantity} onChange={setQuantity} />
              <div className="flex-1">
                <Button 
                  className="w-full" 
                  size="lg" 
                  disabled={isUploadRequired}
                  onClick={handleAddToCart}
                >
                  {isUploadRequired ? "Upload a photo to continue" : "Add to Cart"}
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
