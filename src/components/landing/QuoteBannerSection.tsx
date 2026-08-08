"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export function QuoteBannerSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative h-[420px] overflow-hidden">
      {/* Background image */}
      <Image
        src="/quote_banner_bg.png"
        alt="Warm atmospheric background"
        fill
        className="object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1B1C1C]/80 via-[#2D1A12]/70 to-[#1B1C1C]/80" />

      {/* Content */}
      <div ref={ref} className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#F5C5A3] mb-6">
            A Timeless Bond
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold font-serif text-white leading-tight max-w-2xl mx-auto">
            The thread may fade...
            <br />
            <span className="text-[#F5C5A3] italic">The memories never will.</span>
          </h2>
          <p className="text-white/60 mt-6 text-[15px] max-w-md mx-auto">
            Every Rakhi carries something ordinary. This one carries something irreplaceable.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-8"
          >
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-200 text-[14px]"
            >
              Create Your Memory Rakhi →
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
