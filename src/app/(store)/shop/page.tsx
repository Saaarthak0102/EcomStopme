"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, ChevronLeft, ChevronRight, Star, Check } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";

// ── Mock data (replaces with Supabase fetch once keys are added) ──────────────
const PRODUCT = {
  id: "prod-nfc-rakhi-001",
  name: "NFC Memory Rakhi",
  slug: "nfc-memory-rakhi",
  category: "Limited Edition",
  description:
    "A beautifully crafted 3D printed Rakhi that unlocks your most meaningful moments with just one tap. No app. No charging. Just love, encoded in clay.",
  base_price: 249900, // paise → ₹2,499
  images: ["/shop_rakhi_hero.png", "/rakhi_closeup1.png", "/rakhi_hand.png", "/rakhi_wrist.png"],
  has_nfc: true,
  rating: 4.9,
  review_count: 2147,
  head_designs: [
    { id: "hd-lotus",    name: "Lotus",     price_delta: 0,     image: "/rakhi_hero.png",     color: "#94492c" },
    { id: "hd-mandala",  name: "Mandala",   price_delta: 30000, image: "/rakhi_closeup1.png", color: "#7A5440" },
    { id: "hd-geo",      name: "Geometric", price_delta: 50000, image: "/rakhi_hand.png",     color: "#C8784A" },
    { id: "hd-floral",   name: "Floral",    price_delta: 50000, image: "/rakhi_wrist.png",    color: "#5A3E34" },
  ],
  thread_colors: [
    { id: "tc-red",    name: "Classic Red",  hex: "#C0392B" },
    { id: "tc-gold",   name: "Royal Gold",   hex: "#D4A017" },
    { id: "tc-white",  name: "Pearl White",  hex: "#F5F0E8" },
  ],
};

const MORE_RAKHIS = [
  { id: "more-1", name: "Pearl Lotus Rakhi",    price: 279900, image: "/rakhi_closeup1.png", badge: "Bestseller" },
  { id: "more-2", name: "Golden Mandala Rakhi", price: 299900, image: "/rakhi_hand.png",     badge: "New" },
  { id: "more-3", name: "Silver Geometric",     price: 249900, image: "/rakhi_wrist.png",    badge: null },
  { id: "more-4", name: "Floral Bliss Rakhi",   price: 299900, image: "/rakhi_packaging.png",badge: "Limited" },
];

function formatPrice(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

export default function ShopPage() {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedDesign, setSelectedDesign] = useState(PRODUCT.head_designs[0]);
  const [selectedThread, setSelectedThread] = useState(PRODUCT.thread_colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);

  const totalPrice = PRODUCT.base_price + selectedDesign.price_delta;

  const handleAddToCart = () => {
    addItem({
      id: `${PRODUCT.id}-${selectedDesign.id}-${selectedThread.id}`,
      productId: PRODUCT.id,
      productSlug: PRODUCT.slug,
      productName: PRODUCT.name,
      quantity,
      unitPrice: totalPrice,
      selectedVariants: { head_design: selectedDesign.name, thread_color: selectedThread.name },
      selectedVariantIds: { head_design: selectedDesign.id, thread_color: selectedThread.id },
      previewImage: PRODUCT.images[activeImage],
      hasNfc: PRODUCT.has_nfc,
    });
    setAdded(true);
    openDrawer();
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FBF7F4]">
      {/* ── HERO SECTION ─────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 pt-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

          {/* LEFT — Image gallery */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-24">
            {/* Main image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-[#e8ddd7] shadow-sm group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0"
                >
                  {/* Floating animation on the hero image */}
                  <motion.div
                    animate={{ y: [0, -14, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={PRODUCT.images[activeImage]}
                      alt={PRODUCT.name}
                      fill
                      className="object-contain p-8"
                      priority
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Prev / Next arrows */}
              <button
                onClick={() => setActiveImage((p) => (p - 1 + PRODUCT.images.length) % PRODUCT.images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5 text-[#54433d]" />
              </button>
              <button
                onClick={() => setActiveImage((p) => (p + 1) % PRODUCT.images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-5 h-5 text-[#54433d]" />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {PRODUCT.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === i ? "border-[#94492c] shadow-md scale-105" : "border-[#e8ddd7] hover:border-[#94492c]/40"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT — Product details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-7"
          >
            {/* Category + name */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#94492c] mb-2">
                {PRODUCT.category}
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold font-serif text-[#1B1C1C] leading-tight">
                {PRODUCT.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm text-[#7A6860]">
                  {PRODUCT.rating} ({PRODUCT.review_count.toLocaleString("en-IN")} reviews)
                </span>
              </div>

              <p className="text-[15px] text-[#7A6860] mt-4 leading-relaxed max-w-md">
                {PRODUCT.description}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-[#94492c]">{formatPrice(totalPrice)}</span>
              {selectedDesign.price_delta > 0 && (
                <span className="text-lg text-[#7A6860] line-through">{formatPrice(PRODUCT.base_price)}</span>
              )}
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                Free Delivery
              </span>
            </div>

            {/* HEAD DESIGN PICKER */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[14px] font-bold text-[#1B1C1C]">Head Design</p>
                <p className="text-[13px] text-[#94492c] font-semibold">{selectedDesign.name}</p>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {PRODUCT.head_designs.map((design) => (
                  <button
                    key={design.id}
                    onClick={() => {
                      setSelectedDesign(design);
                      setActiveImage(PRODUCT.head_designs.indexOf(design) % PRODUCT.images.length);
                    }}
                    className={`relative flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 ${
                      selectedDesign.id === design.id
                        ? "border-[#94492c] bg-[#94492c]/5 shadow-md"
                        : "border-[#e8ddd7] hover:border-[#94492c]/40 bg-white"
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden">
                      <Image src={design.image} alt={design.name} fill className="object-cover" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#1B1C1C] text-center leading-tight">
                      {design.name}
                    </span>
                    {design.price_delta > 0 && (
                      <span className="text-[10px] text-[#94492c]">+{formatPrice(design.price_delta)}</span>
                    )}
                    {selectedDesign.id === design.id && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#94492c] rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* THREAD COLOR */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[14px] font-bold text-[#1B1C1C]">Thread Color</p>
                <p className="text-[13px] text-[#94492c] font-semibold">{selectedThread.name}</p>
              </div>
              <div className="flex gap-3">
                {PRODUCT.thread_colors.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThread(thread)}
                    title={thread.name}
                    className={`w-9 h-9 rounded-full border-4 transition-all duration-200 ${
                      selectedThread.id === thread.id
                        ? "border-[#94492c] scale-110 shadow-lg"
                        : "border-white shadow-md hover:scale-105"
                    }`}
                    style={{ backgroundColor: thread.hex }}
                  />
                ))}
              </div>
            </div>

            {/* QUANTITY + ADD TO CART */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-[#e8ddd7] rounded-full overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-11 h-11 text-xl font-bold text-[#54433d] hover:bg-[#F5E0D0] transition-colors"
                  >−</button>
                  <span className="w-10 text-center text-[16px] font-bold text-[#1B1C1C]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-11 h-11 text-xl font-bold text-[#54433d] hover:bg-[#F5E0D0] transition-colors"
                  >+</button>
                </div>
                <p className="text-sm text-[#7A6860]">
                  Total: <span className="font-bold text-[#1B1C1C]">{formatPrice(totalPrice * quantity)}</span>
                </p>
              </div>

              <motion.button
                onClick={handleAddToCart}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center justify-center gap-3 w-full py-4 rounded-full font-bold text-[16px] transition-all duration-300 shadow-lg ${
                  added
                    ? "bg-green-600 text-white"
                    : "bg-[#94492c] hover:bg-[#7a3b22] text-white hover:shadow-xl hover:-translate-y-0.5"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    Add to Cart — {formatPrice(totalPrice * quantity)}
                  </>
                )}
              </motion.button>

              <Link
                href="/checkout"
                className="flex items-center justify-center w-full py-4 rounded-full font-bold text-[16px] border-2 border-[#94492c] text-[#94492c] hover:bg-[#94492c]/5 transition-all"
              >
                Buy Now
              </Link>
            </div>

            {/* PERKS */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-white rounded-2xl border border-[#e8ddd7]">
              {[
                { icon: "📦", label: "Free Delivery", sub: "Pan India" },
                { icon: "🔒", label: "Secure Payment", sub: "Razorpay" },
                { icon: "📱", label: "NFC Enabled", sub: "Tap to unlock" },
                { icon: "♾️", label: "Works Forever", sub: "No battery needed" },
              ].map((p) => (
                <div key={p.label} className="flex items-center gap-3">
                  <span className="text-2xl">{p.icon}</span>
                  <div>
                    <p className="text-[13px] font-bold text-[#1B1C1C]">{p.label}</p>
                    <p className="text-[11px] text-[#7A6860]">{p.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── MORE RAKHIS ───────────────────────────────────────── */}
      <div className="bg-white py-14 border-t border-[#e8ddd7]">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#94492c] mb-1">Collection</p>
              <h2 className="text-2xl font-bold font-serif text-[#1B1C1C]">More Rakhis</h2>
            </div>
            <Link href="/shop" className="text-[13px] font-semibold text-[#94492c] hover:underline">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {MORE_RAKHIS.map((rakhi, i) => (
              <motion.div
                key={rakhi.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="group bg-[#FBF7F4] border border-[#e8ddd7] rounded-2xl overflow-hidden cursor-pointer"
              >
                <div className="relative aspect-square">
                  <Image
                    src={rakhi.image}
                    alt={rakhi.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {rakhi.badge && (
                    <div className="absolute top-3 left-3 bg-[#94492c] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {rakhi.badge}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[14px] text-[#1B1C1C] group-hover:text-[#94492c] transition-colors">
                    {rakhi.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-[#94492c]">{formatPrice(rakhi.price)}</span>
                    <button className="w-8 h-8 bg-[#94492c] rounded-full flex items-center justify-center text-white hover:bg-[#7a3b22] transition-colors">
                      <span className="text-lg leading-none">+</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
