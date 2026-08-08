"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#FBF7F4]"
    >
      {/* Decorative radial glow */}
      <div className="absolute top-1/2 right-1/3 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#F5C5A3]/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-[#FFDEC8]/10 blur-[80px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-24 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left — Text */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-[#94492c]/10 text-[#94492c] text-xs font-semibold px-4 py-1.5 rounded-full w-fit border border-[#94492c]/20"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#94492c] animate-pulse" />
            NFC-Powered Memory Rakhi
          </motion.div>

          <h1 className="text-5xl lg:text-6xl font-bold font-serif text-[#1B1C1C] leading-tight">
            Not Just a Rakhi.
            <br />
            A{" "}
            <span className="text-[#94492c] italic">Memory</span>
            <br />
            They Can Keep
            <br />
            Forever.
          </h1>

          <p className="text-[#7A6860] text-[17px] leading-relaxed max-w-md">
            A beautifully crafted 3D printed Rakhi that unlocks your most
            meaningful moments with just one tap.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#94492c] hover:bg-[#7a3b22] text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1 text-[15px]"
            >
              Order Yours
            </Link>
            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2.5 bg-white border border-[#e8ddd7] hover:border-[#94492c]/40 text-[#54433d] hover:text-[#94492c] font-semibold px-7 py-3.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-md text-[15px]"
            >
              <span className="w-7 h-7 rounded-full bg-[#94492c]/10 flex items-center justify-center">
                <Play className="w-3 h-3 text-[#94492c] fill-[#94492c]" />
              </span>
              Watch Demo
            </a>
          </div>

          {/* Trust signals */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-[#1B1C1C]">2,000+</span>
              <span className="text-xs text-[#7A6860]">Happy families</span>
            </div>
            <div className="w-px h-10 bg-[#e8ddd7]" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-[#1B1C1C]">4.9★</span>
              <span className="text-xs text-[#7A6860]">Average rating</span>
            </div>
            <div className="w-px h-10 bg-[#e8ddd7]" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-[#1B1C1C]">Forever</span>
              <span className="text-xs text-[#7A6860]">No charging needed</span>
            </div>
          </div>
        </motion.div>

        {/* Right — Product Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="relative flex items-center justify-center"
        >
          {/* Background circle */}
          <div className="absolute w-[480px] h-[480px] rounded-full bg-gradient-to-br from-[#F5E0D0] to-[#FBF0E8] opacity-60" />

          {/* Main rakhi image — floating */}
          <motion.div
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10"
          >
            <Image
              src="/rakhi_hero.png"
              alt="3D Printed NFC Memory Rakhi"
              width={420}
              height={420}
              className="object-contain drop-shadow-2xl"
              priority
            />
          </motion.div>

          {/* Phone mockup floating card */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: 30 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="absolute bottom-4 -right-4 lg:bottom-8 lg:-right-2 bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 w-56 border border-[#e8ddd7]"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#94492c] to-[#C8784A] flex items-center justify-center flex-shrink-0">
              <Play className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1B1C1C]">Memory Unlocked!</p>
              <p className="text-[10px] text-[#7A6860] mt-0.5">Birthday Video • 2:34</p>
              <div className="mt-1.5 h-1 bg-[#e8ddd7] rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-[#94492c] rounded-full" />
              </div>
            </div>
          </motion.div>

          {/* NFC tap card */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute top-8 -left-4 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2.5 border border-[#e8ddd7]"
          >
            <div className="w-9 h-9 rounded-full bg-[#94492c]/10 flex items-center justify-center text-lg">
              📱
            </div>
            <div>
              <p className="text-xs font-bold text-[#1B1C1C]">One Tap</p>
              <p className="text-[10px] text-[#7A6860]">Infinite memories</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" className="w-full fill-white opacity-60">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  );
}
