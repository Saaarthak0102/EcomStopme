import { Product } from "../types";

export const products: Product[] = [
  {
    id: "prod-nfc-rakhi-001",
    slug: "nfc-memory-rakhi",
    name: "NFC Memory Rakhi",
    description: "A beautifully crafted 3D printed Rakhi that unlocks your most meaningful moments with just one tap.",
    category: "rakhi",
    base_price: 249900,
    images: ["/shop_rakhi_hero.png"],
    has_nfc: true,
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
