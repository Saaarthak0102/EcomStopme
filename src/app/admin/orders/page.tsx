"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Order, OrderStatus, OrderItem } from "@/lib/types";
import { motion } from "framer-motion";
import Link from "next/link";

const ALL_STATUSES: OrderStatus[] = [
  "pending", "payment_confirmed", "nfc_pending", "processing", "shipped", "delivered", "cancelled"
];

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending:           { label: "Pending",           color: "bg-gray-100 text-gray-600" },
  payment_confirmed: { label: "Payment Confirmed", color: "bg-blue-100 text-blue-700" },
  nfc_pending:       { label: "NFC Pending",       color: "bg-amber-100 text-amber-700" },
  processing:        { label: "Processing",        color: "bg-purple-100 text-purple-700" },
  shipped:           { label: "Shipped",           color: "bg-indigo-100 text-indigo-700" },
  delivered:         { label: "Delivered",         color: "bg-green-100 text-green-700" },
  cancelled:         { label: "Cancelled",         color: "bg-red-100 text-red-600" },
};

function formatPrice(paise: number) {
  return `Rs.${(paise / 100).toLocaleString("en-IN")}`;
}

function CustomizationBadge({ items }: { items: OrderItem[] }) {
  const nameItems  = items.filter((i: any) => i.rakhi_type === "name");
  const photoItems = items.filter((i: any) => i.rakhi_type === "photo");

  if (!nameItems.length && !photoItems.length) {
    return <span className="text-[12px] text-[#b0a09a]">-</span>;
  }

  return (
    <div className="flex flex-col gap-1.5">
      {nameItems.map((item: any, i: number) => (
        <div key={`n-${i}`} className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wide text-[#5B4FCF]">Name: {item.product_name}</span>
          {item.name_inputs?.length ? (
            item.name_inputs.map((name: string, j: number) => (
              <span key={j} className="text-[11px] text-[#1B1C1C] font-medium ml-2">- {name}</span>
            ))
          ) : (
            <span className="text-[11px] text-amber-600 ml-2 italic">Awaiting names</span>
          )}
        </div>
      ))}
      {photoItems.map((item: any, i: number) => (
        <div key={`p-${i}`} className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wide text-[#94492c]">Photo: {item.product_name}</span>
          {item.photo_urls?.length ? (
            <div className="flex gap-1 flex-wrap ml-2">
              {item.photo_urls.map((url: string, j: number) => (
                <a key={j} href={url} target="_blank" rel="noreferrer">
                  <img src={url} alt={`Photo ${j + 1}`} className="w-10 h-10 rounded-lg object-cover border border-[#e8ddd7] hover:opacity-80 transition-opacity" />
                </a>
              ))}
            </div>
          ) : (
            <span className="text-[11px] text-amber-600 ml-2 italic">Awaiting photos</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    setOrders((data ?? []) as Order[]);
    setFiltered((data ?? []) as Order[]);
    setLoading(false);
  };

  useEffect(() => {
    let list = [...orders];
    if (filterStatus !== "all") list = list.filter((o) => o.status === filterStatus);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.order_number.toLowerCase().includes(q) ||
          o.customer_email.toLowerCase().includes(q) ||
          o.customer_phone.includes(q)
      );
    }
    setFiltered(list);
  }, [filterStatus, search, orders]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    const supabase = createClient();
    await supabase.from("orders").update({ status }).eq("id", orderId);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  return (
    <div className="p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1B1C1C]">Orders</h1>
        <p className="text-[#7A6860] text-sm">{filtered.length} orders</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search order #, email, phone..."
          className="border border-[#e8ddd7] rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#94492c] bg-white min-w-[220px]"
        />
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-full text-[12px] font-semibold transition-all border ${
              filterStatus === "all" ? "bg-[#94492c] text-white border-[#94492c]" : "bg-white text-[#7A6860] border-[#e8ddd7]"
            }`}
          >
            All
          </button>
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-full text-[12px] font-semibold transition-all border ${
                filterStatus === s ? "bg-[#94492c] text-white border-[#94492c]" : "bg-white text-[#7A6860] border-[#e8ddd7]"
              }`}
            >
              {STATUS_LABEL[s].label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#94492c] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e8ddd7] p-16 text-center text-[#7A6860]">
          No orders found
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#e8ddd7] overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[960px]">
            <thead className="border-b border-[#e8ddd7] bg-[#FBF7F4]">
              <tr>
                {["Order #", "Customer", "Amount", "Status", "Customization", "Date", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[12px] font-bold uppercase tracking-wide text-[#7A6860]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, i) => {
                const status = STATUS_LABEL[order.status];
                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-[#e8ddd7]/50 hover:bg-[#FBF7F4] transition-colors"
                  >
                    <td className="px-5 py-4 text-[13px] font-mono font-bold text-[#94492c]">
                      {order.order_number}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[13px] font-semibold text-[#1B1C1C]">{order.customer_email}</p>
                      <p className="text-[11px] text-[#7A6860]">{order.customer_phone}</p>
                    </td>
                    <td className="px-5 py-4 text-[13px] font-bold text-[#1B1C1C]">
                      {formatPrice(order.total_amount)}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#94492c] ${status.color}`}
                      >
                        {ALL_STATUSES.map((s) => (
                          <option key={s} value={s}>{STATUS_LABEL[s].label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 max-w-[200px]">
                      <CustomizationBadge items={(order.items as OrderItem[]) ?? []} />
                    </td>
                    <td className="px-5 py-4 text-[12px] text-[#7A6860]">
                      {new Date(order.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-[12px] font-semibold text-[#94492c] hover:underline"
                      >
                        View &rarr;
                      </Link>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
