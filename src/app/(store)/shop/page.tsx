import ShopClient from "./ShopClient";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

type Props = {
  searchParams: Promise<{ product?: string }>;
};

// Generate dynamic metadata for social sharing (Open Graph/WhatsApp/etc.)
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { product: productSlug } = await searchParams;

  if (!productSlug) {
    return {
      title: "Shop Catalog | Stopme",
      description: "Explore our collection of premium custom Rakhis.",
      openGraph: {
        title: "Shop Catalog | Stopme",
        description: "Explore our collection of premium custom Rakhis.",
        images: ["/shop_rakhi_hero.png"],
      },
    };
  }

  try {
    const supabase = await createClient();
    const { data: product } = await supabase
      .from("products")
      .select("name, description, images")
      .eq("slug", productSlug)
      .single();

    if (product) {
      return {
        title: `${product.name} | Stopme`,
        description: product.description || "A premium custom Rakhi designed by you.",
        openGraph: {
          title: `${product.name} | Stopme`,
          description: product.description || "A premium custom Rakhi designed by you.",
          images: product.images && product.images.length > 0 ? [product.images[0]] : ["/shop_rakhi_hero.png"],
        },
      };
    }
  } catch (e) {
    console.error("Error generating metadata:", e);
  }

  return {
    title: "Shop Catalog | Stopme",
    description: "Explore our collection of premium custom Rakhis.",
    openGraph: {
      title: "Shop Catalog | Stopme",
      description: "Explore our collection of premium custom Rakhis.",
      images: ["/shop_rakhi_hero.png"],
    },
  };
}

export default async function ShopPage() {
  return <ShopClient />;
}
