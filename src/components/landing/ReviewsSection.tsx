"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const reviews = [
  {
    name: "Rasha",
    rating: 5,
    text: "My brother cried after tapping it. Best gift I've ever given. The video I recorded played perfectly — it was like magic!",
    tag: "Verified Purchase",
  },
  {
    name: "Santanu",
    rating: 5,
    text: "Best Rakhi gift I've ever bought. My sister was completely stunned when it opened my childhood photo album.",
    tag: "Verified Purchase",
  },
  {
    name: "Priya",
    rating: 5,
    text: "I gifted this to my brother who's abroad. He tapped it and got our family video. He called me crying. 10/10.",
    tag: "Verified Purchase",
  },
  {
    name: "Arjun",
    rating: 5,
    text: "The quality is premium, the packaging is beautiful, and the NFC works flawlessly. This is the future of Rakhi.",
    tag: "Verified Purchase",
  },
];

function ReviewCard({ review, index }: { review: typeof reviews[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white border border-[#e8ddd7] rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200"
    >
      {/* Stars */}
      <div className="flex gap-0.5">
        {Array.from({ length: review.rating }).map((_, i) => (
          <span key={i} className="text-amber-400 text-sm">★</span>
        ))}
      </div>

      {/* Review text */}
      <p className="text-[14px] text-[#54433d] leading-relaxed italic">
        &ldquo;{review.text}&rdquo;
      </p>

      {/* Reviewer */}
      <div className="flex items-center gap-3 pt-2 border-t border-[#f0eded]">
        <div className="w-8 h-8 rounded-full bg-[#F5E0D0] flex items-center justify-center text-sm font-bold text-[#94492c]">
          {review.name[0]}
        </div>
        <div>
          <p className="text-[13px] font-bold text-[#1B1C1C]">{review.name}</p>
          <p className="text-[11px] text-[#94492c]">{review.tag}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function ReviewsSection() {
  return (
    <section id="reviews" className="py-24 bg-[#FBF7F4]">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#94492c] mb-3">
            What People Say
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold font-serif text-[#1B1C1C]">
            REVIEWS
          </h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="flex gap-0.5">
              {"★★★★★".split("").map((s, i) => (
                <span key={i} className="text-amber-400 text-xl">{s}</span>
              ))}
            </div>
            <span className="text-[#7A6860] text-sm">4.9 out of 5 · 2,147 reviews</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reviews.map((review, i) => (
            <ReviewCard key={i} review={review} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
