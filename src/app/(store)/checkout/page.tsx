"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Check, ChevronDown, ChevronUp, MapPin, CreditCard, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";

// ── Validation schema ─────────────────────────────────────────
const addressSchema = z.object({
  full_name:      z.string().min(2, "Name is required"),
  phone:          z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email:          z.string().email("Enter a valid email"),
  pincode:        z.string().regex(/^\d{6}$/, "Enter a 6-digit pincode"),
  street_address: z.string().min(3, "Address is required"),
  city:           z.string().min(1, "City is required"),
  state:          z.string().min(1, "State is required"),
});

type AddressForm = z.infer<typeof addressSchema>;

const INDIA_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand",
  "West Bengal","Delhi","Jammu & Kashmir","Ladakh","Puducherry","Chandigarh",
];

function formatPrice(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const [step, setStep] = useState<"address" | "payment">("address");
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);

  const subtotal = items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
  const shipping = 0; // free shipping
  const total = subtotal + shipping;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddressForm>({ resolver: zodResolver(addressSchema) });

  // Pincode auto-fill city/state
  const handlePincodeBlur = async (pincode: string) => {
    if (pincode.length !== 6) return;
    setPincodeLoading(true);
    try {
      const res = await fetch(`/api/pincode?pin=${pincode}`);
      const data = await res.json();
      if (data.city) setValue("city", data.city);
      if (data.state) setValue("state", data.state);
    } catch {
      // ignore
    } finally {
      setPincodeLoading(false);
    }
  };

  const onAddressSubmit = (_data: AddressForm) => {
    setStep("payment");
  };

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      // 1. Create Razorpay order via API
      const createRes = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          total_amount: total,
          customer_email: watch("email"),
          customer_phone: watch("phone"),
          shipping_address: {
            full_name: watch("full_name"),
            phone: watch("phone"),
            pincode: watch("pincode"),
            street_address: watch("street_address"),
            city: watch("city"),
            state: watch("state"),
          },
        }),
      });

      const { razorpay_order_id, order_id, order_number } = await createRes.json();

      // 2. Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: total,
        currency: "INR",
        name: "Stopme",
        description: "NFC Memory Rakhi",
        order_id: razorpay_order_id,
        prefill: {
          name: watch("full_name"),
          email: watch("email"),
          contact: watch("phone"),
        },
        theme: { color: "#94492c" },
        method: { emi: false, wallet: false },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          // 3. Verify payment
          await fetch("/api/orders/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          clearCart();
          router.push(`/checkout/success?order_id=${order_id}&order_number=${order_number}`);
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (e) {
      console.error(e);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FBF7F4] flex flex-col items-center justify-center gap-4">
        <ShoppingBag className="w-16 h-16 text-[#e8ddd7]" />
        <p className="text-[#7A6860] text-lg">Your cart is empty</p>
        <a href="/shop" className="bg-[#94492c] text-white px-8 py-3 rounded-full font-semibold">
          Shop Now
        </a>
      </div>
    );
  }

  return (
    <>
      {/* Load Razorpay SDK */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div className="min-h-screen bg-[#FBF7F4]">
        <div className="mx-auto max-w-5xl px-4 py-10">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-serif text-[#1B1C1C]">Checkout</h1>
            {/* Step indicator */}
            <div className="flex items-center gap-2 mt-4">
              {["address", "payment"].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step === s || (s === "address" && step === "payment")
                      ? "bg-[#94492c] text-white"
                      : "bg-[#e8ddd7] text-[#7A6860]"
                  }`}>
                    {step === "payment" && s === "address" ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-sm font-semibold capitalize ${step === s ? "text-[#94492c]" : "text-[#7A6860]"}`}>
                    {s}
                  </span>
                  {i < 1 && <div className="w-12 h-px bg-[#e8ddd7]" />}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT — Form */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {step === "address" && (
                  <motion.div
                    key="address"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white rounded-3xl border border-[#e8ddd7] p-6 md:p-8"
                  >
                    <div className="flex items-center gap-2 mb-6">
                      <MapPin className="w-5 h-5 text-[#94492c]" />
                      <h2 className="text-xl font-bold text-[#1B1C1C]">Delivery Address</h2>
                    </div>

                    <form onSubmit={handleSubmit(onAddressSubmit)} className="flex flex-col gap-5">
                      {/* Name + Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[13px] font-semibold text-[#1B1C1C] mb-1.5 block">Full Name *</label>
                          <input
                            {...register("full_name")}
                            placeholder="Arjun Kumar"
                            className="w-full border border-[#e8ddd7] rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#94492c] focus:ring-1 focus:ring-[#94492c] bg-[#FBF7F4]"
                          />
                          {errors.full_name && <p className="text-red-500 text-[11px] mt-1">{errors.full_name.message}</p>}
                        </div>
                        <div>
                          <label className="text-[13px] font-semibold text-[#1B1C1C] mb-1.5 block">Mobile Number *</label>
                          <input
                            {...register("phone")}
                            placeholder="9876543210"
                            maxLength={10}
                            className="w-full border border-[#e8ddd7] rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#94492c] focus:ring-1 focus:ring-[#94492c] bg-[#FBF7F4]"
                          />
                          {errors.phone && <p className="text-red-500 text-[11px] mt-1">{errors.phone.message}</p>}
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="text-[13px] font-semibold text-[#1B1C1C] mb-1.5 block">Email Address *</label>
                        <input
                          {...register("email")}
                          type="email"
                          placeholder="arjun@email.com"
                          className="w-full border border-[#e8ddd7] rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#94492c] focus:ring-1 focus:ring-[#94492c] bg-[#FBF7F4]"
                        />
                        {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email.message}</p>}
                        <p className="text-[11px] text-[#7A6860] mt-1">Order confirmation will be sent here</p>
                      </div>

                      {/* Pincode + City + State */}
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-[13px] font-semibold text-[#1B1C1C] mb-1.5 block">Pincode *</label>
                          <div className="relative">
                            <input
                              {...register("pincode")}
                              placeholder="110001"
                              maxLength={6}
                              onBlur={(e) => handlePincodeBlur(e.target.value)}
                              className="w-full border border-[#e8ddd7] rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#94492c] bg-[#FBF7F4]"
                            />
                            {pincodeLoading && (
                              <div className="absolute right-3 top-3.5 w-4 h-4 border-2 border-[#94492c] border-t-transparent rounded-full animate-spin" />
                            )}
                          </div>
                          {errors.pincode && <p className="text-red-500 text-[11px] mt-1">{errors.pincode.message}</p>}
                        </div>
                        <div>
                          <label className="text-[13px] font-semibold text-[#1B1C1C] mb-1.5 block">City *</label>
                          <input
                            {...register("city")}
                            placeholder="New Delhi"
                            className="w-full border border-[#e8ddd7] rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#94492c] bg-[#FBF7F4]"
                          />
                          {errors.city && <p className="text-red-500 text-[11px] mt-1">{errors.city.message}</p>}
                        </div>
                        <div>
                          <label className="text-[13px] font-semibold text-[#1B1C1C] mb-1.5 block">State *</label>
                          <select
                            {...register("state")}
                            className="w-full border border-[#e8ddd7] rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#94492c] bg-[#FBF7F4]"
                          >
                            <option value="">Select</option>
                            {INDIA_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                          {errors.state && <p className="text-red-500 text-[11px] mt-1">{errors.state.message}</p>}
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <label className="text-[13px] font-semibold text-[#1B1C1C] mb-1.5 block">Flat / House No. / Building / Street / Area / Landmark *</label>
                        <input
                          {...register("street_address")}
                          placeholder="dhanalaxmi colony, 8-5-1/14, Mahabubnagar, Near Metro Station"
                          className="w-full border border-[#e8ddd7] rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#94492c] bg-[#FBF7F4]"
                        />
                        {errors.street_address && <p className="text-red-500 text-[11px] mt-1">{errors.street_address.message}</p>}
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#94492c] hover:bg-[#7a3b22] text-white font-bold py-4 rounded-full text-[16px] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 mt-2"
                      >
                        Continue to Payment →
                      </button>
                    </form>
                  </motion.div>
                )}

                {step === "payment" && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-4"
                  >
                    {/* Address summary */}
                    <div className="bg-white rounded-2xl border border-[#e8ddd7] p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#94492c]" />
                          <span className="font-semibold text-[14px] text-[#1B1C1C]">Delivering to</span>
                        </div>
                        <button onClick={() => setStep("address")} className="text-[13px] text-[#94492c] font-semibold hover:underline">
                          Change
                        </button>
                      </div>
                      <p className="text-[13px] text-[#7A6860] mt-2 ml-6">
                        {watch("full_name")} · {watch("phone")}<br />
                        {watch("street_address")}<br />
                        {watch("city")}, {watch("state")} — {watch("pincode")}
                      </p>
                    </div>

                    {/* Payment box */}
                    <div className="bg-white rounded-3xl border border-[#e8ddd7] p-6 md:p-8">
                      <div className="flex items-center gap-2 mb-6">
                        <CreditCard className="w-5 h-5 text-[#94492c]" />
                        <h2 className="text-xl font-bold text-[#1B1C1C]">Payment</h2>
                      </div>

                      <div className="bg-[#FBF7F4] rounded-2xl p-5 mb-6 border border-[#e8ddd7]">
                        <div className="flex gap-4 items-center flex-wrap">
                          {["🇮🇳 UPI", "G Pay", "PhonePe", "💳 Debit"].map((m) => (
                            <div key={m} className="flex items-center gap-1.5 bg-white rounded-lg px-3 py-2 text-[13px] font-semibold text-[#1B1C1C] border border-[#e8ddd7]">
                              {m}
                            </div>
                          ))}
                        </div>
                        <p className="text-[12px] text-[#7A6860] mt-3">
                          Powered by Razorpay · No COD · Secure & encrypted payment
                        </p>
                      </div>

                      <button
                        onClick={handlePayment}
                        disabled={isLoading}
                        className="w-full bg-[#94492c] hover:bg-[#7a3b22] disabled:opacity-60 text-white font-bold py-4 rounded-full text-[16px] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <CreditCard className="w-5 h-5" />
                            Pay {formatPrice(total)} Securely
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* RIGHT — Order summary (always expanded) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl border border-[#e8ddd7] overflow-hidden sticky top-24">
                <button
                  onClick={() => setSummaryOpen((v) => !v)}
                  className="flex items-center justify-between w-full px-6 py-4 border-b border-[#e8ddd7]"
                >
                  <span className="font-bold text-[15px] text-[#1B1C1C]">
                    Order Summary ({items.reduce((a, i) => a + i.quantity, 0)} item{items.length > 1 ? "s" : ""})
                  </span>
                  {summaryOpen ? <ChevronUp className="w-4 h-4 text-[#7A6860]" /> : <ChevronDown className="w-4 h-4 text-[#7A6860]" />}
                </button>

                <AnimatePresence>
                  {summaryOpen && (
                    <motion.div
                      initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-4 flex flex-col gap-4">
                        {items.map((item) => (
                          <div key={item.id} className="flex gap-3 items-center">
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#FBF7F4] border border-[#e8ddd7]">
                              <Image src={item.previewImage} alt={item.productName} fill className="object-cover" />
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#94492c] rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                                {item.quantity}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-[13px] text-[#1B1C1C] truncate">{item.productName}</p>
                              <p className="text-[11px] text-[#7A6860]">
                                {Object.entries(item.selectedVariants).map(([k, v]) => `${v}`).join(" · ")}
                              </p>
                            </div>
                            <span className="font-bold text-[13px] text-[#1B1C1C] flex-shrink-0">
                              {formatPrice(item.unitPrice * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="px-6 pb-6 flex flex-col gap-3 border-t border-[#e8ddd7] pt-4">
                  <div className="flex justify-between text-[13px] text-[#7A6860]">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[13px] text-[#7A6860]">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between text-[16px] font-bold text-[#1B1C1C] pt-2 border-t border-[#e8ddd7]">
                    <span>Total</span>
                    <span className="text-[#94492c]">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
