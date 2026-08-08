"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    icon: "🎬",
    title: "Store a Video",
    description: "Hide a heartfelt message inside your Rakhi.",
  },
  {
    icon: "📸",
    title: "Memory Album",
    description: "Open your favorite photos instantly.",
  },
  {
    icon: "🎵",
    title: "Playlist",
    description: "Share songs that remind you of each other.",
  },
  {
    icon: "✉️",
    title: "Digital Letter",
    description: "Write something they'll never lose.",
  },
  {
    icon: "🔗",
    title: "Custom Link",
    description: "Connect it to literally anything online.",
  },
  {
    icon: "♾️",
    title: "Works Forever",
    description: "No batteries. No charging. Just tap.",
  },
  {
    icon: "💧",
    title: "Waterproof",
    description: "Crafted to last through every season.",
  },
  {
    icon: "🔄",
    title: "Update Anytime",
    description: "Change the memory at any time, forever.",
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08, ease: "easeOut" }}
      whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(148,73,44,0.12)" }}
      className="group bg-white border border-[#e8ddd7] rounded-2xl p-5 flex flex-col gap-3 cursor-default transition-all duration-200"
    >
      <div className="w-11 h-11 rounded-xl bg-[#F5E0D0] flex items-center justify-center text-2xl transition-transform duration-200 group-hover:scale-110">
        {feature.icon}
      </div>
      <div>
        <h3 className="font-bold text-[#1B1C1C] text-[15px]">{feature.title}</h3>
        <p className="text-[13px] text-[#7A6860] mt-1 leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

export function FeaturesSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true });

  return (
    <section id="features" className="py-24 bg-[#FBF7F4]">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#94492c] mb-3">
            Packed With Love
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold font-serif text-[#1B1C1C]">
            FEATURES
          </h2>
          <p className="text-[#7A6860] mt-3 text-[15px] max-w-md mx-auto">
            Everything you need to make this the most memorable gift they&apos;ll ever receive.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
