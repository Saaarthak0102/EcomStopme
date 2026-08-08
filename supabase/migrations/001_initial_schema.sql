-- ============================================================
-- Stopme E-Commerce — Initial Database Schema
-- Run this in Supabase SQL Editor or via: supabase db push
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          text NOT NULL,
  slug          text UNIQUE NOT NULL,
  description   text,
  base_price    integer NOT NULL,        -- in paise (₹2499 = 249900)
  images        text[] DEFAULT '{}',     -- Supabase Storage URLs
  has_nfc       boolean DEFAULT false,   -- admin toggles
  is_active     boolean DEFAULT true,
  display_order integer DEFAULT 0,
  category      text DEFAULT 'rakhi',
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- ============================================================
-- PRODUCT VARIANTS (head designs, thread colors, etc.)
-- ============================================================
CREATE TABLE IF NOT EXISTS product_variants (
  id               uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id       uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  type             text NOT NULL,         -- 'head_design' | 'thread_color' | 'size'
  name             text NOT NULL,         -- 'Lotus' | 'Geometric' | 'Mandala'
  price_delta      integer DEFAULT 0,     -- extra paise above base_price
  image_url        text,
  is_active        boolean DEFAULT true,
  display_order    integer DEFAULT 0,
  created_at       timestamptz DEFAULT now()
);

-- ============================================================
-- CUSTOMERS (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         text UNIQUE NOT NULL,
  full_name     text,
  phone         text,
  phone_verified boolean DEFAULT false,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- ============================================================
-- ADDRESSES
-- ============================================================
CREATE TABLE IF NOT EXISTS addresses (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id   uuid REFERENCES customers(id) ON DELETE CASCADE,
  label         text DEFAULT 'Home',
  full_name     text NOT NULL,
  phone         text NOT NULL,
  pincode       text NOT NULL,
  street_address text NOT NULL,
  city          text NOT NULL,
  state         text NOT NULL,
  is_default    boolean DEFAULT false,
  created_at    timestamptz DEFAULT now()
);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id                    uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number          text UNIQUE NOT NULL,
  customer_id           uuid REFERENCES customers(id),
  customer_email        text NOT NULL,
  customer_phone        text NOT NULL,

  -- Contents
  items                 jsonb NOT NULL DEFAULT '[]',
  subtotal              integer NOT NULL,
  shipping_charge       integer DEFAULT 0,
  total_amount          integer NOT NULL,

  -- Shipping (snapshot at time of order)
  shipping_address      jsonb NOT NULL,

  -- Status
  status                text DEFAULT 'pending',
  -- pending | payment_confirmed | nfc_pending | processing | shipped | delivered | cancelled

  -- Razorpay
  razorpay_order_id     text,
  razorpay_payment_id   text,
  razorpay_signature    text,
  paid_at               timestamptz,

  -- Timestamps
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

-- ============================================================
-- NFC MEMORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS nfc_memories (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id          uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  order_item_index  integer DEFAULT 0,
  unique_nfc_id     text UNIQUE NOT NULL,   -- e.g. STM-NFC-8f3a2b
  memory_link       text,                   -- URL submitted by customer
  memory_type       text,                   -- 'video'|'photo'|'audio'|'text'|'link'
  is_active         boolean DEFAULT true,
  submitted_at      timestamptz,
  created_at        timestamptz DEFAULT now()
);

-- ============================================================
-- PRODUCT VIEWS (for KPI tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS product_views (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  uuid REFERENCES products(id) ON DELETE CASCADE,
  session_id  text,
  source      text,                          -- 'shop' | 'landing' | 'direct'
  viewed_at   timestamptz DEFAULT now()
);

-- ============================================================
-- ADMIN USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id      uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email   text UNIQUE NOT NULL,
  role    text DEFAULT 'admin'
);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Products: public read, admin write
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_products" ON products FOR ALL USING (
  auth.uid() IN (SELECT id FROM admin_users)
);

-- Product Variants: public read
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_variants" ON product_variants FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_variants" ON product_variants FOR ALL USING (
  auth.uid() IN (SELECT id FROM admin_users)
);

-- Customers: own data only
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "customers_own_data" ON customers FOR ALL USING (auth.uid() = id);

-- Addresses: own data only
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "addresses_own_data" ON addresses FOR ALL USING (auth.uid() = customer_id);

-- Orders: own orders only
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_own_data" ON orders FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "admin_all_orders" ON orders FOR ALL USING (
  auth.uid() IN (SELECT id FROM admin_users)
);

-- NFC Memories: own data only + one-time insert
ALTER TABLE nfc_memories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "nfc_own_read" ON nfc_memories FOR SELECT USING (
  order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid())
);
CREATE POLICY "nfc_submit_link" ON nfc_memories FOR UPDATE USING (
  order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid()) AND memory_link IS NULL
);

-- Product Views: insert for all
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone_insert_views" ON product_views FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_read_views" ON product_views FOR SELECT USING (
  auth.uid() IN (SELECT id FROM admin_users)
);

-- ============================================================
-- SEED: Insert a sample hero product
-- ============================================================
INSERT INTO products (name, slug, description, base_price, has_nfc, is_active, display_order)
VALUES (
  'NFC Memory Rakhi',
  'nfc-memory-rakhi',
  'A beautifully crafted 3D printed Rakhi that unlocks your most meaningful moments with just one tap.',
  249900,
  true,
  true,
  1
) ON CONFLICT (slug) DO NOTHING;
