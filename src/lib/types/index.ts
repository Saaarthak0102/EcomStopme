// ============================================================
// PRODUCT
// ============================================================
export type RakhiType = "none" | "name" | "photo";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  base_price: number;          // in paise
  images: string[];
  has_nfc: boolean;
  rakhi_type: RakhiType;       // "none" | "name" | "photo"
  is_active: boolean;
  display_order: number;
  category: string;
  created_at: string;
  updated_at: string;
  variants?: ProductVariant[];
};

export type ProductVariant = {
  id: string;
  product_id: string;
  type: "head_design" | "thread_color" | "size";
  name: string;
  price_delta: number;         // extra paise above base_price
  image_url: string | null;
  is_active: boolean;
  display_order: number;
};

// ============================================================
// CART
// ============================================================
export type CartItem = {
  id: string;                  // unique per customization
  productId: string;
  productSlug: string;
  productName: string;
  quantity: number;
  unitPrice: number;           // base + variant delta, in paise
  selectedVariants: Record<string, string>;   // { head_design: 'Lotus', thread_color: 'Red' }
  selectedVariantIds: Record<string, string>; // { head_design: uuid }
  previewImage: string;
  hasNfc: boolean;
  rakhiType: RakhiType;        // "none" | "name" | "photo"
};

// ============================================================
// ADDRESS
// ============================================================
export type Address = {
  id: string;
  customer_id?: string;
  label: string;
  full_name: string;
  phone: string;
  pincode: string;
  street_address: string;
  city: string;
  state: string;
  is_default?: boolean;
};

// ============================================================
// ORDER
// ============================================================
export type OrderStatus =
  | "pending"
  | "payment_confirmed"
  | "nfc_pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  order_number: string;
  customer_id: string | null;
  customer_email: string;
  customer_phone: string;
  items: OrderItem[];
  subtotal: number;
  shipping_charge: number;
  total_amount: number;
  shipping_address: Address;
  status: OrderStatus;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  product_id: string;
  product_name: string;
  variant_id: string | null;
  variant_name: string | null;
  quantity: number;
  unit_price: number;
  has_nfc: boolean;
  rakhi_type?: RakhiType;      // "none" | "name" | "photo"
  name_inputs?: string[];      // one per piece (length === quantity)
  photo_urls?: string[];       // one per piece (length === quantity)
};

// ============================================================
// NFC MEMORY
// ============================================================
export type NfcMemory = {
  id: string;
  order_id: string;
  order_item_index: number;
  unique_nfc_id: string;
  memory_link: string | null;
  memory_type: "video" | "photo" | "audio" | "text" | "link" | null;
  is_active: boolean;
  submitted_at: string | null;
  created_at: string;
};

// ============================================================
// CUSTOMER
// ============================================================
export type Customer = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  phone_verified: boolean;
  created_at: string;
};

// ============================================================
// LEGACY (kept for backward compat with existing components)
// ============================================================
export type PaymentMethod = {
  id: string;
  type: "card" | "upi";
  last4?: string;
  expiry?: string;
  upiId?: string;
  isDefault?: boolean;
};

