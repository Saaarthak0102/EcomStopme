export type Product = {
  slug: string;
  name: string;
  category: string;
  basePrice: number;
  images: string[];
  requiresPhoto: boolean;
  variants?: Record<string, string[]>;
  maxEngravingLength?: number;
};

export type CartItem = {
  id: string;
  productSlug: string;
  quantity: number;
  selectedVariants: Record<string, string>;
  uploadedImage?: string;
  engravingText?: string;
  previewThumbnail: string;
  // Legacy fields
  name?: string;
  price?: number;
  image?: string;
};

export type Address = {
  id: string;
  label: string;
  fullAddress: string;
  isDefault?: boolean;
};

export type Order = {
  id: string;
  items: CartItem[];
  status: "processing" | "printing" | "shipped" | "delivered";
  placedAt: string;
  estimatedReady: string;
};
