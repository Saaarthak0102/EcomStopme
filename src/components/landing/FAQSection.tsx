"use client";

import { useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How does NFC work?",
    answer:
      "NFC (Near Field Communication) is the same technology used in contactless payments. The Rakhi contains a tiny NFC chip inside. When your sibling holds their NFC-enabled smartphone close to the Rakhi (within 2-3 cm), it automatically opens the memory you've stored — no app required.",
  },
  {
    question: "Does it need charging?",
    answer:
      "No! The NFC chip is completely passive and draws power from your phone's NFC reader. This means the Rakhi works forever without any battery or charging. It will outlast any electronic device.",
  },
  {
    question: "Is the Rakhi waterproof?",
    answer:
      "Yes. The 3D printed resin casing is water-resistant and durable. The NFC chip inside is sealed within the design. You can wear it during everyday activities without worry.",
  },
  {
    question: "Can I change the memory later?",
    answer:
      "Absolutely! You can update the memory (video, photo album, song, or letter) at any time through our web portal. The Rakhi's link stays the same — only the content changes.",
  },
  {
    question: "Which phones are compatible?",
    answer:
      "Almost all modern smartphones support NFC — this includes iPhone 7 and newer (iOS), and most Android phones from the last 6-7 years. Simply ensure NFC is enabled in your phone settings.",
  },
  {
    question: "What is the delivery timeline?",
    answer:
      "We ship within 2-3 business days. Standard delivery takes 5-7 days across India. Expedited shipping is available for Rakshabandhan orders — please order at least 1 week before the date.",
  },
];

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="border-b border-[#e8ddd7] last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <span className="font-semibold text-[#1B1C1C] text-[15px] group-hover:text-[#94492c] transition-colors">
          {faq.question}
        </span>
        <div className="w-8 h-8 rounded-full bg-[#F5E0D0] flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:bg-[#94492c] group-hover:text-white">
          {open ? (
            <Minus className="w-3.5 h-3.5 text-[#94492c] group-hover:text-white" />
          ) : (
            <Plus className="w-3.5 h-3.5 text-[#94492c] group-hover:text-white" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-[#7A6860] text-[14px] leading-relaxed pb-5">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headingRef, { once: true });

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="mx-auto max-w-2xl px-6">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#94492c] mb-3">
            Got Questions?
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold font-serif text-[#1B1C1C]">
            FAQ
          </h2>
        </motion.div>

        <div className="bg-[#FBF7F4] rounded-3xl p-6 md:p-8">
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} />
          ))}
        </div>

        {/* Contact CTA */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-[14px] text-[#7A6860] mt-8"
        >
          Still have questions?{" "}
          <a
            href="mailto:hello@stopme.in"
            className="text-[#94492c] font-semibold hover:underline"
          >
            Email us at hello@stopme.in
          </a>
        </motion.p>
      </div>
    </section>
  );
}
