"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Link2, Video, Image as ImageIcon, Music, Type, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const MEMORY_TYPES = [
  { type: "video",  label: "Video",        icon: Video,      hint: "YouTube, Google Drive, or direct video URL" },
  { type: "photo",  label: "Photo / Album", icon: ImageIcon,  hint: "Google Photos, Imgur, or image URL" },
  { type: "audio",  label: "Song / Audio",  icon: Music,      hint: "Spotify link, SoundCloud, or audio URL" },
  { type: "text",   label: "Message",       icon: Type,       hint: "A heartfelt note (we'll host it for you)" },
  { type: "link",   label: "Any Link",      icon: Link2,      hint: "Any URL — Instagram reel, webpage, etc." },
];

function SuccessContent() {
  const params = useSearchParams();
  const orderId     = params.get("order_id");
  const orderNumber = params.get("order_number") ?? "STM-2026-0001";

  const [memoryType,    setMemoryType]    = useState<string | null>(null);
  const [memoryLink,    setMemoryLink]    = useState("");
  const [memoryText,    setMemoryText]    = useState("");
  const [isSubmitting,  setIsSubmitting]  = useState(false);
  const [isSubmitted,   setIsSubmitted]   = useState(false);

  const handleSubmitMemory = async () => {
    if (!memoryType) return;
    const linkValue = memoryType === "text" ? memoryText : memoryLink;
    if (!linkValue.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch("/api/orders/nfc-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, memory_type: memoryType, memory_link: linkValue }),
      });
      setIsSubmitted(true);
    } catch {
      alert("Failed to save your memory link. Please email us at hello@stopme.in");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF7F4] flex flex-col items-center px-4 py-16">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {/* ── Success banner ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl border border-[#e8ddd7] p-8 text-center flex flex-col items-center gap-4"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-11 h-11 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold font-serif text-[#1B1C1C]">Order Confirmed! 🎉</h1>
          <p className="text-[#7A6860]">
            A confirmation email is on its way to your inbox.
          </p>
          <div className="bg-[#FBF7F4] rounded-2xl border border-[#e8ddd7] px-6 py-4 text-center">
            <p className="text-[12px] text-[#7A6860] uppercase font-bold tracking-widest mb-1">Order Number</p>
            <p className="text-2xl font-bold font-mono text-[#94492c]">{orderNumber}</p>
          </div>
        </motion.div>

        {/* ── NFC Memory Setup ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl border border-[#e8ddd7] overflow-hidden"
        >
          <div className="bg-gradient-to-br from-[#94492c] to-[#7a3b22] px-8 py-6">
            <h2 className="text-white text-xl font-bold">📱 Set Up Your Memory</h2>
            <p className="text-[#F5D5C5] text-sm mt-1">
              What should your brother see when he taps the Rakhi?
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div key="form" className="p-6 md:p-8 flex flex-col gap-6">
                {/* Memory type picker */}
                <div>
                  <p className="text-[13px] font-bold text-[#1B1C1C] mb-3">Choose your memory type</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {MEMORY_TYPES.map(({ type, label, icon: Icon }) => (
                      <button
                        key={type}
                        onClick={() => setMemoryType(type)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center ${
                          memoryType === type
                            ? "border-[#94492c] bg-[#94492c]/5"
                            : "border-[#e8ddd7] hover:border-[#94492c]/40"
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${memoryType === type ? "text-[#94492c]" : "text-[#7A6860]"}`} />
                        <span className={`text-[12px] font-semibold ${memoryType === type ? "text-[#94492c]" : "text-[#1B1C1C]"}`}>
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input for link/text */}
                <AnimatePresence>
                  {memoryType && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-3"
                    >
                      <p className="text-[12px] text-[#7A6860]">
                        {MEMORY_TYPES.find((m) => m.type === memoryType)?.hint}
                      </p>
                      {memoryType === "text" ? (
                        <textarea
                          value={memoryText}
                          onChange={(e) => setMemoryText(e.target.value)}
                          placeholder="Write your heartfelt message here… 💕"
                          rows={5}
                          className="w-full border border-[#e8ddd7] rounded-2xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#94492c] focus:ring-1 focus:ring-[#94492c] bg-[#FBF7F4] resize-none"
                        />
                      ) : (
                        <input
                          type="url"
                          value={memoryLink}
                          onChange={(e) => setMemoryLink(e.target.value)}
                          placeholder="https://..."
                          className="w-full border border-[#e8ddd7] rounded-2xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#94492c] focus:ring-1 focus:ring-[#94492c] bg-[#FBF7F4]"
                        />
                      )}

                      <p className="text-[11px] text-[#7A6860]">
                        🔒 This is a one-time setup. Once saved, it cannot be changed.
                      </p>

                      <button
                        onClick={handleSubmitMemory}
                        disabled={isSubmitting || !(memoryType === "text" ? memoryText.trim() : memoryLink.trim())}
                        className="w-full bg-[#94492c] hover:bg-[#7a3b22] disabled:opacity-50 text-white font-bold py-4 rounded-full text-[15px] transition-all flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            Save My Memory <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-9 h-9 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-[#1B1C1C]">Memory Saved! ✨</h3>
                <p className="text-[#7A6860] text-sm max-w-sm">
                  When your brother taps the Rakhi, they'll instantly see your memory. We'll ship within 1-2 business days.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/shop" className="flex-1 text-center bg-white border-2 border-[#94492c] text-[#94492c] font-bold py-3.5 rounded-full text-[15px] hover:bg-[#94492c]/5 transition-all">
            Continue Shopping
          </Link>
          <Link href="/account" className="flex-1 text-center bg-[#94492c] text-white font-bold py-3.5 rounded-full text-[15px] hover:bg-[#7a3b22] transition-all">
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FBF7F4] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#94492c] border-t-transparent rounded-full animate-spin" /></div>}>
      <SuccessContent />
    </Suspense>
  );
}
