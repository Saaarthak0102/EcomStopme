"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Link2, Video, Image as ImageIcon, Music, Type, ArrowRight, Upload, User } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { OrderItem } from "@/lib/types";

const MEMORY_TYPES = [
  { type: "video",  label: "Video",        icon: Video,      hint: "YouTube, Google Drive, or direct video URL" },
  { type: "photo",  label: "Photo / Album", icon: ImageIcon,  hint: "Google Photos, Imgur, or image URL" },
  { type: "audio",  label: "Song / Audio",  icon: Music,      hint: "Spotify link, SoundCloud, or audio URL" },
  { type: "text",   label: "Message",       icon: Type,       hint: "A heartfelt note (we will host it for you)" },
  { type: "link",   label: "Any Link",      icon: Link2,      hint: "Any URL - Instagram reel, webpage, etc." },
];

function NameSection({ orderId, items }: { orderId: string; items: Array<{ item: OrderItem; itemIndex: number }> }) {
  const slots = items.flatMap(({ item, itemIndex }) =>
    Array.from({ length: item.quantity }, (_, pieceIndex) => ({
      itemIndex,
      pieceIndex,
      label: item.quantity > 1 ? `${item.product_name} - Piece ${pieceIndex + 1}` : item.product_name,
    }))
  );
  const [names, setNames] = useState<string[]>(slots.map(() => ""));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (names.some((n) => !n.trim())) return;
    setSaving(true);
    try {
      const customizations: Record<number, string[]> = {};
      slots.forEach(({ itemIndex }, i) => {
        if (!customizations[itemIndex]) customizations[itemIndex] = [];
        customizations[itemIndex].push(names[i].trim());
      });
      await fetch("/api/orders/customization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          customizations: Object.entries(customizations).map(([idx, name_inputs]) => ({
            item_index: parseInt(idx),
            name_inputs,
          })),
        }),
      });
      setSaved(true);
    } catch {
      alert("Failed to save names. Please email us at hello@stopme.in");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white rounded-3xl border border-[#e8ddd7] overflow-hidden">
      <div className="bg-gradient-to-br from-[#5B4FCF] to-[#3d35a8] px-8 py-6">
        <h2 className="text-white text-xl font-bold flex items-center gap-2"><User className="w-5 h-5" /> Personalize Your Rakhis</h2>
        <p className="text-[#C9C4FF] text-sm mt-1">Enter the name to be engraved / printed on each rakhi</p>
      </div>
      <AnimatePresence mode="wait">
        {!saved ? (
          <motion.div key="form" className="p-6 md:p-8 flex flex-col gap-5">
            {slots.map((slot, i) => (
              <div key={i}>
                <label className="text-[13px] font-semibold text-[#1B1C1C] mb-1.5 block">{slot.label}</label>
                <input type="text" value={names[i]} onChange={(e) => { const next = [...names]; next[i] = e.target.value; setNames(next); }} placeholder="e.g. Rahul" maxLength={30} className="w-full border border-[#e8ddd7] rounded-2xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#5B4FCF] focus:ring-1 focus:ring-[#5B4FCF] bg-[#FBF7F4]" />
              </div>
            ))}
            <p className="text-[11px] text-[#7A6860]">Names are locked after saving.</p>
            <button onClick={handleSave} disabled={saving || names.some((n) => !n.trim())} className="w-full bg-[#5B4FCF] hover:bg-[#3d35a8] disabled:opacity-50 text-white font-bold py-4 rounded-full text-[15px] transition-all flex items-center justify-center gap-2">
              {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Save Names <ArrowRight className="w-4 h-4" /></>}
            </button>
          </motion.div>
        ) : (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-8 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle className="w-9 h-9 text-green-600" /></div>
            <h3 className="text-xl font-bold text-[#1B1C1C]">Names Saved!</h3>
            <p className="text-[#7A6860] text-sm max-w-sm">We will engrave/print the names and ship within 1-2 business days.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function PhotoSection({ orderId, items }: { orderId: string; items: Array<{ item: OrderItem; itemIndex: number }> }) {
  const slots = items.flatMap(({ item, itemIndex }) =>
    Array.from({ length: item.quantity }, (_, pieceIndex) => ({
      itemIndex,
      pieceIndex,
      label: item.quantity > 1 ? `${item.product_name} - Piece ${pieceIndex + 1}` : item.product_name,
    }))
  );
  const [previews, setPreviews] = useState<(string | null)[]>(slots.map(() => null));
  const [files, setFiles] = useState<(File | null)[]>(slots.map(() => null));
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleFileChange = (i: number, file: File) => {
    const next = [...files]; next[i] = file; setFiles(next);
    const reader = new FileReader();
    reader.onload = (e) => { const p = [...previews]; p[i] = e.target?.result as string; setPreviews(p); };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (files.some((f) => !f)) return;
    setUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < slots.length; i++) {
        const formData = new FormData();
        formData.append("order_id", orderId);
        formData.append("item_index", String(slots[i].itemIndex));
        formData.append("piece_index", String(slots[i].pieceIndex));
        formData.append("photo", files[i]!);
        const res = await fetch("/api/orders/upload-photo", { method: "POST", body: formData });
        const { url } = await res.json();
        uploadedUrls.push(url);
      }
      const customizations: Record<number, string[]> = {};
      slots.forEach(({ itemIndex }, i) => {
        if (!customizations[itemIndex]) customizations[itemIndex] = [];
        customizations[itemIndex].push(uploadedUrls[i]);
      });
      await fetch("/api/orders/customization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          customizations: Object.entries(customizations).map(([idx, photo_urls]) => ({
            item_index: parseInt(idx),
            photo_urls,
          })),
        }),
      });
      setSaved(true);
    } catch {
      alert("Failed to upload photos. Please email us at hello@stopme.in");
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl border border-[#e8ddd7] overflow-hidden">
      <div className="bg-gradient-to-br from-[#c8540e] to-[#94492c] px-8 py-6">
        <h2 className="text-white text-xl font-bold flex items-center gap-2"><Upload className="w-5 h-5" /> Upload Your Photos</h2>
        <p className="text-[#FFD4B8] text-sm mt-1">Upload 1 photo for each rakhi - we will print it on the design</p>
      </div>
      <AnimatePresence mode="wait">
        {!saved ? (
          <motion.div key="form" className="p-6 md:p-8 flex flex-col gap-5">
            {slots.map((slot, i) => (
              <div key={i}>
                <label className="text-[13px] font-semibold text-[#1B1C1C] mb-2 block">{slot.label}</label>
                <div onClick={() => fileRefs.current[i]?.click()} className={`relative flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all ${previews[i] ? "border-[#94492c] bg-[#94492c]/5" : "border-[#e8ddd7] hover:border-[#94492c]/50"}`}>
                  {previews[i] ? (
                    <img src={previews[i]!} alt="Preview" className="h-32 object-contain rounded-xl" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-[#7A6860]" />
                      <p className="text-[13px] text-[#7A6860] text-center">Click to upload photo<br /><span className="text-[11px]">JPEG, PNG, WebP</span></p>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" ref={(el) => { fileRefs.current[i] = el; }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileChange(i, f); }} />
                </div>
                {previews[i] && <button type="button" onClick={() => fileRefs.current[i]?.click()} className="mt-1 text-[12px] text-[#94492c] font-semibold hover:underline">Change photo</button>}
              </div>
            ))}
            <p className="text-[11px] text-[#7A6860]">Photos are locked after saving.</p>
            <button onClick={handleSave} disabled={uploading || files.some((f) => !f)} className="w-full bg-[#94492c] hover:bg-[#7a3b22] disabled:opacity-50 text-white font-bold py-4 rounded-full text-[15px] transition-all flex items-center justify-center gap-2">
              {uploading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Save Photos <ArrowRight className="w-4 h-4" /></>}
            </button>
          </motion.div>
        ) : (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-8 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle className="w-9 h-9 text-green-600" /></div>
            <h3 className="text-xl font-bold text-[#1B1C1C]">Photos Saved!</h3>
            <p className="text-[#7A6860] text-sm max-w-sm">We will print your photos and ship within 1-2 business days.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function NfcSection({ orderId }: { orderId: string }) {
  const [memoryType, setMemoryType] = useState<string | null>(null);
  const [memoryLink, setMemoryLink] = useState("");
  const [memoryText, setMemoryText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-white rounded-3xl border border-[#e8ddd7] overflow-hidden">
      <div className="bg-gradient-to-br from-[#94492c] to-[#7a3b22] px-8 py-6">
        <h2 className="text-white text-xl font-bold">Set Up Your Memory</h2>
        <p className="text-[#F5D5C5] text-sm mt-1">What should your brother see when he taps the Rakhi?</p>
      </div>
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div key="form" className="p-6 md:p-8 flex flex-col gap-6">
            <div>
              <p className="text-[13px] font-bold text-[#1B1C1C] mb-3">Choose your memory type</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {MEMORY_TYPES.map(({ type, label, icon: Icon }) => (
                  <button key={type} onClick={() => setMemoryType(type)} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center ${memoryType === type ? "border-[#94492c] bg-[#94492c]/5" : "border-[#e8ddd7] hover:border-[#94492c]/40"}`}>
                    <Icon className={`w-6 h-6 ${memoryType === type ? "text-[#94492c]" : "text-[#7A6860]"}`} />
                    <span className={`text-[12px] font-semibold ${memoryType === type ? "text-[#94492c]" : "text-[#1B1C1C]"}`}>{label}</span>
                  </button>
                ))}
              </div>
            </div>
            <AnimatePresence>
              {memoryType && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
                  <p className="text-[12px] text-[#7A6860]">{MEMORY_TYPES.find((m) => m.type === memoryType)?.hint}</p>
                  {memoryType === "text" ? (
                    <textarea value={memoryText} onChange={(e) => setMemoryText(e.target.value)} placeholder="Write your heartfelt message here..." rows={5} className="w-full border border-[#e8ddd7] rounded-2xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#94492c] focus:ring-1 focus:ring-[#94492c] bg-[#FBF7F4] resize-none" />
                  ) : (
                    <input type="url" value={memoryLink} onChange={(e) => setMemoryLink(e.target.value)} placeholder="https://..." className="w-full border border-[#e8ddd7] rounded-2xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#94492c] focus:ring-1 focus:ring-[#94492c] bg-[#FBF7F4]" />
                  )}
                  <p className="text-[11px] text-[#7A6860]">This is a one-time setup. Once saved, it cannot be changed.</p>
                  <button onClick={handleSubmitMemory} disabled={isSubmitting || !(memoryType === "text" ? memoryText.trim() : memoryLink.trim())} className="w-full bg-[#94492c] hover:bg-[#7a3b22] disabled:opacity-50 text-white font-bold py-4 rounded-full text-[15px] transition-all flex items-center justify-center gap-2">
                    {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Save My Memory <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-8 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle className="w-9 h-9 text-green-600" /></div>
            <h3 className="text-xl font-bold text-[#1B1C1C]">Memory Saved!</h3>
            <p className="text-[#7A6860] text-sm max-w-sm">When your brother taps the Rakhi, they will instantly see your memory. We will ship within 1-2 business days.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SuccessContent() {
  const params = useSearchParams();
  const orderId     = params.get("order_id") ?? "";
  const orderNumber = params.get("order_number") ?? "STM-2026-0001";
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    if (!orderId) { setLoadingItems(false); return; }
    const supabase = createClient();
    supabase.from("orders").select("items").eq("id", orderId).single().then(({ data }) => {
      setOrderItems((data?.items as OrderItem[]) ?? []);
      setLoadingItems(false);
    });
  }, [orderId]);

  const nameItems  = orderItems.map((item, i) => ({ item, itemIndex: i })).filter(({ item }) => (item as any).rakhi_type === "name");
  const photoItems = orderItems.map((item, i) => ({ item, itemIndex: i })).filter(({ item }) => (item as any).rakhi_type === "photo");
  const hasNfc     = orderItems.some((item) => item.has_nfc);

  return (
    <div className="min-h-screen bg-[#FBF7F4] flex flex-col items-center px-4 py-16">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl border border-[#e8ddd7] p-8 text-center flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle className="w-11 h-11 text-green-600" /></div>
          <h1 className="text-3xl font-bold font-serif text-[#1B1C1C]">Order Confirmed!</h1>
          <p className="text-[#7A6860]">A confirmation email is on its way to your inbox.</p>
          <div className="bg-[#FBF7F4] rounded-2xl border border-[#e8ddd7] px-6 py-4 text-center">
            <p className="text-[12px] text-[#7A6860] uppercase font-bold tracking-widest mb-1">Order Number</p>
            <p className="text-2xl font-bold font-mono text-[#94492c]">{orderNumber}</p>
          </div>
        </motion.div>

        {loadingItems ? (
          <div className="flex justify-center py-8"><div className="w-7 h-7 border-2 border-[#94492c] border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <>
            {nameItems.length  > 0 && <NameSection  orderId={orderId} items={nameItems}  />}
            {photoItems.length > 0 && <PhotoSection orderId={orderId} items={photoItems} />}
            {hasNfc            && <NfcSection   orderId={orderId} />}
          </>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/shop" className="flex-1 text-center bg-white border-2 border-[#94492c] text-[#94492c] font-bold py-3.5 rounded-full text-[15px] hover:bg-[#94492c]/5 transition-all">Continue Shopping</Link>
          <Link href="/account" className="flex-1 text-center bg-[#94492c] text-white font-bold py-3.5 rounded-full text-[15px] hover:bg-[#7a3b22] transition-all">View My Orders</Link>
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
