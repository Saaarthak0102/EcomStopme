"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag } from "lucide-react";

const galleryImages = [
  { src: "/rakhi_hero.png", alt: "NFC Memory Rakhi front view" },
  { src: "/rakhi_closeup1.png", alt: "Rakhi intricate lattice detail" },
  { src: "/rakhi_hand.png", alt: "Holding the Rakhi" },
  { src: "/rakhi_wrist.png", alt: "Rakhi worn on wrist" },
  { src: "/rakhi_packaging.png", alt: "Gift packaging" },
  { src: "/lifestyle_siblings.png", alt: "Siblings with Rakhi" },
];

const colorOptions = [
  { name: "Terracotta", hex: "#94492c" },
  { name: "Sand", hex: "#C8A882" },
  { name: "Mocha", hex: "#7A5440" },
];

export function ProductShowcaseSection() {
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="product" className="py-24 bg-[#FBF7F4]">
      <div className="mx-auto max-w-5xl px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#94492c] mb-3">
            The Product
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold font-serif text-[#1B1C1C]">
            PRODUCT SHOWCASE
          </h2>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left — Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-3"
          >
            {/* Main image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-[#e8ddd7] shadow-sm">
              <Image
                src={galleryImages[activeImage].src}
                alt={galleryImages[activeImage].alt}
                fill
                className="object-cover transition-all duration-500"
              />
            </div>

            {/* Thumbnail grid */}
            <div className="grid grid-cols-5 gap-2">
              {galleryImages.slice(0, 5).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    activeImage === i
                      ? "border-[#94492c] shadow-md"
                      : "border-transparent hover:border-[#94492c]/30"
                  }`}
                >
                  <Image src={img.src} alt={img.alt} fill className="object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right — Product info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col gap-6 lg:sticky lg:top-24"
          >
            <div>
              <p className="text-xs text-[#94492c] font-semibold uppercase tracking-wider mb-1">
                Limited Rakshabandhan Edition
              </p>
              <h3 className="text-2xl font-bold font-serif text-[#1B1C1C]">
                NFC Memory Rakhi
              </h3>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-3xl font-bold text-[#94492c]">₹2,499</span>
                <span className="text-[#7A6860] line-through text-lg">₹3,499</span>
                <span className="bg-[#94492c]/10 text-[#94492c] text-xs font-bold px-2.5 py-1 rounded-full">
                  Save ₹1,000
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                {"★★★★★".split("").map((s, i) => (
                  <span key={i} className="text-amber-400 text-sm">{s}</span>
                ))}
                <span className="text-[#7A6860] text-sm ml-1">4.9 (2,147 reviews)</span>
              </div>
            </div>

            {/* Color picker */}
            <div>
              <p className="text-[13px] font-semibold text-[#1B1C1C] mb-3">
                Color: <span className="text-[#94492c]">{colorOptions[selectedColor].name}</span>
              </p>
              <div className="flex gap-3">
                {colorOptions.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    title={color.name}
                    className={`w-8 h-8 rounded-full transition-all duration-200 ${
                      selectedColor === i
                        ? "ring-2 ring-offset-2 ring-[#94492c] scale-110"
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="text-[13px] font-semibold text-[#1B1C1C] mb-3">Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#e8ddd7] rounded-full overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center hover:bg-[#F5E0D0] transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5 text-[#54433d]" />
                  </button>
                  <span className="w-8 text-center text-[15px] font-semibold text-[#1B1C1C]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center hover:bg-[#F5E0D0] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#54433d]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Buy buttons */}
            <div className="flex flex-col gap-3">
              <Link
                href="/shop"
                className="flex items-center justify-center gap-2.5 bg-[#94492c] hover:bg-[#7a3b22] text-white font-bold py-4 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1 text-[16px]"
              >
                <ShoppingBag className="w-5 h-5" />
                Buy Now
              </Link>
              <Link
                href="/shop"
                className="flex items-center justify-center gap-2 border-2 border-[#94492c] text-[#94492c] hover:bg-[#94492c]/5 font-semibold py-3.5 rounded-full transition-all duration-200 text-[14px]"
              >
                Add to Cart
              </Link>
            </div>

            {/* Perks */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#e8ddd7]">
              {[
                { icon: "🚚", text: "Free delivery" },
                { icon: "🔒", text: "Secure payment" },
                { icon: "↩️", text: "7-day returns" },
                { icon: "🎁", text: "Gift wrapping" },
              ].map((perk, i) => (
                <div key={i} className="flex items-center gap-2 text-[12px] text-[#7A6860]">
                  <span>{perk.icon}</span>
                  <span>{perk.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
