"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    image: "/how_it_works_step1.png",
    alt: "Gift the Rakhi",
    number: "1.",
    text: "Gift the Rakhi.",
  },
  {
    image: "/how_it_works_step2.png",
    alt: "Your sibling taps it",
    number: "2.",
    text: "Your sibling taps it.",
  },
  {
    image: "/how_it_works_step3.png",
    alt: "Your surprise video instantly opens",
    number: "3.",
    text: "Your surprise video instantly opens.",
  },
];

export function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-60px" });

  return (
    <section id="how-it-works" className="py-20 bg-[#FBF7F4]">
      <div className="mx-auto max-w-5xl px-6" ref={containerRef}>
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-wider uppercase font-sans text-[#1B1C1C]">
            ONE TAP. INFINITE MEMORIES.
          </h2>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-center">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center w-full">
              {/* Step Item */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="flex flex-col items-center text-center w-full"
              >
                {/* Illustration Frame */}
                <div className="relative w-48 h-44 md:w-52 md:h-48 flex items-center justify-center mb-4">
                  <Image
                    src={step.image}
                    alt={step.alt}
                    fill
                    className="object-contain mix-blend-multiply"
                    sizes="(max-width: 768px) 192px, 208px"
                  />
                </div>

                {/* Step Text */}
                <p className="text-[15px] md:text-[16px] font-semibold text-[#1B1C1C] leading-snug">
                  <span className="mr-1">{step.number}</span>
                  {step.text}
                </p>
              </motion.div>

              {/* Arrow Connector (between steps 1-2 and 2-3 on desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex items-center justify-center px-2 text-[#54433d]/50">
                  <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
