"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Play, Music, Image as ImageIcon, Heart, Mail } from "lucide-react";

const memoryTypes = [
  {
    icon: Play,
    label: "Birthday Video",
    color: "#94492c",
    bg: "#F5E0D0",
    description: "Record a heartfelt birthday message",
  },
  {
    icon: ImageIcon,
    label: "Childhood Photos",
    color: "#C8784A",
    bg: "#FDF0E6",
    description: "Relive your favorite memories together",
  },
  {
    icon: Music,
    label: "Favorite Song",
    color: "#7A5440",
    bg: "#F0E6E0",
    description: "The song that always reminds you of them",
  },
  {
    icon: Mail,
    label: "Secret Letter",
    color: "#5A3E34",
    bg: "#EDE0DB",
    description: "Words you could never say in person",
  },
];

export function LiveDemoSection() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const activeMemory = memoryTypes[active];
  const Icon = activeMemory.icon;

  return (
    <section id="live-demo" className="py-24 bg-white">
      <div className="mx-auto max-w-5xl px-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-[#94492c] text-white text-xs font-bold px-5 py-2 rounded-full mb-4 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Live Demo
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold font-serif text-[#1B1C1C]">
            See it in action
          </h2>
          <p className="text-[#7A6860] mt-3 text-[15px] max-w-sm mx-auto">
            Choose a memory type to preview how it looks when your sibling taps the Rakhi.
          </p>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Phone frame */}
              <div className="w-[260px] h-[520px] bg-[#1B1C1C] rounded-[40px] p-3 shadow-2xl border-4 border-[#2A2B2B]">
                {/* Screen */}
                <div
                  className="w-full h-full rounded-[30px] overflow-hidden flex flex-col transition-all duration-500"
                  style={{ backgroundColor: activeMemory.bg }}
                >
                  {/* Status bar */}
                  <div className="flex justify-between px-5 py-2 text-[10px] text-[#7A6860]">
                    <span>9:41</span>
                    <div className="w-20 h-4 bg-[#1B1C1C] rounded-full mx-auto -mt-1" />
                    <span>●●●</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col items-center justify-center gap-4 px-5 pb-8">
                    <motion.div
                      key={active}
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4, type: "spring" }}
                      className="w-28 h-28 rounded-full flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: activeMemory.color }}
                    >
                      <Icon className="w-12 h-12 text-white" />
                    </motion.div>

                    <motion.div
                      key={`text-${active}`}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="text-center"
                    >
                      <p className="font-bold text-[#1B1C1C] text-lg font-serif">
                        {activeMemory.label}
                      </p>
                      <p className="text-[12px] text-[#7A6860] mt-1">
                        {activeMemory.description}
                      </p>
                    </motion.div>

                    {/* Play bar */}
                    <div className="w-full">
                      <div className="h-1.5 bg-[#1B1C1C]/10 rounded-full overflow-hidden">
                        <motion.div
                          key={`bar-${active}`}
                          initial={{ width: "0%" }}
                          animate={{ width: "60%" }}
                          transition={{ duration: 2, ease: "easeInOut" }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: activeMemory.color }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-[#7A6860] mt-1">
                        <span>1:12</span>
                        <span>2:34</span>
                      </div>
                    </div>

                    {/* NFC indicator */}
                    <div className="flex items-center gap-2 bg-white/60 rounded-full px-4 py-2">
                      <span className="text-lg">📱</span>
                      <span className="text-[11px] font-semibold text-[#1B1C1C]">
                        Tap to open
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Glow */}
              <div
                className="absolute inset-0 rounded-[44px] blur-3xl opacity-20 -z-10 transition-all duration-500"
                style={{ backgroundColor: activeMemory.color }}
              />
            </div>
          </motion.div>

          {/* Right — Memory type cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            <p className="text-[13px] font-semibold text-[#7A6860] uppercase tracking-wider mb-2">
              Choose a memory type
            </p>
            {memoryTypes.map((memory, i) => {
              const MemIcon = memory.icon;
              return (
                <motion.button
                  key={i}
                  onClick={() => setActive(i)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                    active === i
                      ? "border-[#94492c] bg-[#94492c]/5 shadow-md"
                      : "border-[#e8ddd7] bg-white hover:border-[#94492c]/30"
                  }`}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
                    style={{
                      backgroundColor: active === i ? memory.color : memory.bg,
                    }}
                  >
                    <MemIcon
                      className="w-5 h-5 transition-colors duration-200"
                      style={{ color: active === i ? "white" : memory.color }}
                    />
                  </div>
                  <div>
                    <p className="font-bold text-[#1B1C1C] text-[14px]">{memory.label}</p>
                    <p className="text-[12px] text-[#7A6860] mt-0.5">{memory.description}</p>
                  </div>
                  {active === i && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-[#94492c] flex-shrink-0" />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
