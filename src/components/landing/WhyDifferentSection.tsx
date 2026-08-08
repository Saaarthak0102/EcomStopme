"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Check } from "lucide-react";

const bullets = [
  "Stores memories forever",
  "Personalized for one person",
  "Premium 3D printed design",
  "Waterproof & durable",
  "Works with modern smartphones",
  "No app required",
  "Can be updated anytime",
];

export function WhyDifferentSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="why-different" className="py-24 bg-white">
      <div className="mx-auto max-w-5xl px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#94492c] mb-3">
            The Difference
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold font-serif text-[#1B1C1C]">
            WHY IT&apos;S DIFFERENT
          </h2>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left — Lifestyle image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
              <Image
                src="/lifestyle_siblings.png"
                alt="Siblings sharing a meaningful Rakhi moment"
                fill
                className="object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#94492c]/20 to-transparent" />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-[#F5E0D0] -z-10" />
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-[#FFDEC8]/60 -z-10" />
          </motion.div>

          {/* Right — Comparison */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <div>
              <p className="text-[13px] font-semibold text-[#7A6860] uppercase tracking-wider mb-2">
                Unlike ordinary Rakhis...
              </p>
              <h3 className="text-2xl font-bold font-serif text-[#1B1C1C]">
                This one carries your voice, your face, your love.
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              {bullets.map((bullet, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-[#94492c]/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-[#94492c]" strokeWidth={3} />
                  </div>
                  <span className="text-[15px] text-[#1B1C1C] font-medium">{bullet}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#94492c] hover:bg-[#7a3b22] text-white font-semibold px-7 py-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg w-fit mt-2 text-[14px]"
            >
              Get Yours — ₹2,499
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
