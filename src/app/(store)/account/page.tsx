"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Order } from "@/lib/types";
import { motion } from "framer-motion";
import { Package, LogOut, User, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending:            { label: "Pending",           color: "bg-gray-100 text-gray-600" },
  payment_confirmed:  { label: "Payment Confirmed", color: "bg-blue-100 text-blue-700" },
  nfc_pending:        { label: "Setup NFC Memory",  color: "bg-amber-100 text-amber-700" },
  processing:         { label: "Processing",        color: "bg-purple-100 text-purple-700" },
  shipped:            { label: "Shipped",            color: "bg-indigo-100 text-indigo-700" },
  delivered:          { label: "Delivered",          color: "bg-green-100 text-green-700" },
  cancelled:          { label: "Cancelled",          color: "bg-red-100 text-red-600" },
};

function formatPrice(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

export default function AccountPage() {
  const router = useRouter();
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }
      setEmail(user.email ?? "");

      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_email", user.email)
        .order("created_at", { ascending: false });

      setOrders((data ?? []) as Order[]);
      setLoading(false);
    })();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#FBF7F4]">
      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#94492c] mb-1">My Account</p>
            <h1 className="text-3xl font-bold font-serif text-[#1B1C1C]">Your Orders</h1>
            {email && <p className="text-[#7A6860] text-sm mt-1">{email}</p>}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[13px] text-[#7A6860] hover:text-red-600 transition-colors border border-[#e8ddd7] rounded-xl px-4 py-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Orders */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#94492c] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#e8ddd7] p-16 text-center flex flex-col items-center gap-4">
            <Package className="w-16 h-16 text-[#e8ddd7]" />
            <p className="text-[#7A6860]">No orders yet</p>
            <Link href="/shop" className="bg-[#94492c] text-white px-8 py-3 rounded-full font-semibold">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order, i) => {
              const status = STATUS_LABEL[order.status] ?? STATUS_LABEL.pending;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white rounded-2xl border border-[#e8ddd7] p-5 flex items-center gap-4 hover:border-[#94492c]/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#FBF7F4] flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-[#94492c]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-[14px] text-[#1B1C1C]">{order.order_number}</p>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#7A6860] mt-0.5">
                      {new Date(order.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })} ·{" "}
                      {formatPrice(order.total_amount)}
                    </p>
                    {order.status === "nfc_pending" && (
                      <Link
                        href={`/checkout/success?order_id=${order.id}&order_number=${order.order_number}`}
                        className="text-[12px] text-[#94492c] font-semibold hover:underline mt-1 block"
                      >
                        ⚡ Set up your NFC memory →
                      </Link>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#7A6860] flex-shrink-0" />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
