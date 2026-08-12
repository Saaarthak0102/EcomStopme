"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";

// ── Types ───────────────────────────────────────────────────
type KpiData = {
  total_revenue: number;
  orders_today: number;
  orders_week: number;
  orders_month: number;
  total_orders: number;
  avg_order_value: number;
  conversion_rate: number;
  total_views: number;
  orders_by_status: Record<string, number>;
  revenue_by_day: { date: string; revenue: number }[];
  top_products: { name: string; count: number }[];
  referrers: { code: string; count: number; revenue: number; royalty: number; clicks: number; views: number; conversion_rate: number }[];
};

const STATUS_COLORS: Record<string, string> = {
  pending: "#9CA3AF",
  payment_confirmed: "#60A5FA",
  nfc_pending: "#F59E0B",
  processing: "#A78BFA",
  shipped: "#818CF8",
  delivered: "#34D399",
  cancelled: "#F87171",
};

function formatPrice(paise: number) {
  if (paise >= 100000) return `₹${(paise / 10000000).toFixed(1)}L`;
  if (paise >= 100)    return `₹${(paise / 100).toLocaleString("en-IN")}`;
  return `₹0`;
}

function KpiCard({ label, value, sub, color = "#94492c" }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[#e8ddd7] p-6 flex flex-col gap-2">
      <p className="text-[12px] font-bold uppercase tracking-widest text-[#7A6860]">{label}</p>
      <p className="text-3xl font-bold text-[#1B1C1C]" style={{ color }}>{value}</p>
      {sub && <p className="text-[12px] text-[#7A6860]">{sub}</p>}
    </div>
  );
}

export default function KpiPage() {
  const [data, setData] = useState<KpiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<"7d" | "30d" | "all">("30d");

  // States for Referral Link Generator
  const [productsList, setProductsList] = useState<{ name: string; slug: string }[]>([]);
  const [influencerCode, setInfluencerCode] = useState("");
  const [selectedProductSlug, setSelectedProductSlug] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!influencerCode.trim()) {
      setGeneratedLink("");
      return;
    }
    const base = typeof window !== "undefined" ? window.location.origin : "https://stopme.in";
    const cleanCode = encodeURIComponent(influencerCode.trim());
    let path = `${base}/shop?ref=${cleanCode}`;
    if (selectedProductSlug) {
      path = `${base}/shop?product=${selectedProductSlug}&ref=${cleanCode}`;
    }
    setGeneratedLink(path);
  }, [influencerCode, selectedProductSlug]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const supabase = createClient();
      const now = new Date();
      const dayAgo = new Date(now.getTime() - 86400000).toISOString();
      const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();
      const monthAgo = new Date(now.getTime() - 30 * 86400000).toISOString();

      const [
        { data: allOrders },
        { data: views },
        { data: productsData },
        { data: clicksData }
      ] = await Promise.all([
        supabase.from("orders").select("id, total_amount, status, created_at, items, referrer"),
        supabase.from("product_views").select("id, viewed_at, referrer, product_id"),
        supabase.from("products").select("name, slug").eq("is_active", true),
        supabase.from("referral_clicks").select("referrer, session_id")
      ]);

      setProductsList(productsData || []);

      const orders = allOrders ?? [];
      const paidOrders = orders.filter((o) => o.status !== "pending" && o.status !== "cancelled");

      const totalRevenue = paidOrders.reduce((s: number, o) => s + o.total_amount, 0);
      const ordersToday  = orders.filter((o) => o.created_at > dayAgo).length;
      const ordersWeek   = orders.filter((o) => o.created_at > weekAgo).length;
      const ordersMonth  = orders.filter((o) => o.created_at > monthAgo).length;
      const avgOV        = paidOrders.length ? totalRevenue / paidOrders.length : 0;
      const totalViews   = (views ?? []).length;
      const cvr          = totalViews ? (paidOrders.length / totalViews) * 100 : 0;

      // Orders by status
      const byStatus: Record<string, number> = {};
      orders.forEach((o) => { byStatus[o.status] = (byStatus[o.status] ?? 0) + 1; });

      // Revenue by day (last 14 days)
      const revenueMap: Record<string, number> = {};
      for (let i = 13; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        revenueMap[d.toISOString().slice(0, 10)] = 0;
      }
      paidOrders.forEach((o) => {
        const day = o.created_at.slice(0, 10);
        if (revenueMap[day] !== undefined) revenueMap[day] += o.total_amount;
      });
      const revenueByDay = Object.entries(revenueMap).map(([date, revenue]) => ({
        date: new Date(date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        revenue: revenue / 100,
      }));

      // Top products (from order items)
      const productCounts: Record<string, number> = {};
      orders.forEach((o) => {
        (o.items as Array<{ product_name: string; quantity: number }>).forEach((item) => {
          productCounts[item.product_name] = (productCounts[item.product_name] ?? 0) + item.quantity;
        });
      });
      const topProducts = Object.entries(productCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Count unique clicks by referrer
      const clickCounts: Record<string, number> = {};
      (clicksData || []).forEach((c) => {
        const ref = c.referrer || "Direct / Organic";
        clickCounts[ref] = (clickCounts[ref] || 0) + 1;
      });

      // Count unique views by referrer
      const viewCounts: Record<string, number> = {};
      (views || []).forEach((v) => {
        const ref = v.referrer || "Direct / Organic";
        viewCounts[ref] = (viewCounts[ref] || 0) + 1;
      });

      // Referrers tracking (aggregate paid orders by referrer)
      const referrerStats: Record<string, { count: number; revenue: number }> = {};
      paidOrders.forEach((o) => {
        const ref = o.referrer || "Direct / Organic";
        if (!referrerStats[ref]) {
          referrerStats[ref] = { count: 0, revenue: 0 };
        }
        referrerStats[ref].count += 1;
        referrerStats[ref].revenue += o.total_amount;
      });

      // Get all unique referrers from orders, clicks, and views
      const allReferrerCodes = new Set([
        ...paidOrders.map(o => o.referrer || "Direct / Organic"),
        ...(clicksData || []).map(c => c.referrer || "Direct / Organic"),
        ...(views || []).map(v => v.referrer || "Direct / Organic")
      ]);

      const referrers = Array.from(allReferrerCodes)
        .map((code) => {
          const stats = referrerStats[code] || { count: 0, revenue: 0 };
          const clicks = clickCounts[code] || 0;
          const prodViews = viewCounts[code] || 0;
          const convRate = clicks ? (stats.count / clicks) * 100 : 0;
          return {
            code,
            count: stats.count,
            revenue: stats.revenue,
            royalty: stats.revenue * 0.10, // 10% royalty
            clicks,
            views: prodViews,
            conversion_rate: convRate
          };
        })
        .sort((a, b) => b.revenue - a.revenue || b.clicks - a.clicks);

      setData({
        total_revenue: totalRevenue,
        orders_today: ordersToday,
        orders_week: ordersWeek,
        orders_month: ordersMonth,
        total_orders: orders.length,
        avg_order_value: avgOV,
        conversion_rate: cvr,
        total_views: totalViews,
        orders_by_status: byStatus,
        revenue_by_day: revenueByDay,
        top_products: topProducts,
        referrers: referrers,
      });
      setLoading(false);
    })();
  }, [range]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-[#94492c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const d = data!;
  const statusPieData = Object.entries(d.orders_by_status).map(([name, value]) => ({ name, value }));

  return (
    <div className="p-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B1C1C]">KPI Dashboard</h1>
          <p className="text-[#7A6860] text-sm mt-1">Live data from Supabase</p>
        </div>
        <div className="flex gap-2">
          {(["7d", "30d", "all"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${
                range === r ? "bg-[#94492c] text-white" : "bg-white text-[#7A6860] border border-[#e8ddd7] hover:border-[#94492c]/30"
              }`}
            >
              {r === "7d" ? "7 days" : r === "30d" ? "30 days" : "All time"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Revenue"    value={formatPrice(d.total_revenue)}                color="#94492c" />
        <KpiCard label="Total Orders"     value={d.total_orders.toString()}                    sub={`${d.orders_today} today`} />
        <KpiCard label="Avg. Order Value" value={formatPrice(d.avg_order_value)}               color="#7A3B22" />
        <KpiCard label="Conversion Rate"  value={`${d.conversion_rate.toFixed(2)}%`}           sub={`${d.total_views} page views`} />
        <KpiCard label="Orders This Week"  value={d.orders_week.toString()}                    color="#4F46E5" />
        <KpiCard label="Orders This Month" value={d.orders_month.toString()}                   color="#7C3AED" />
        <KpiCard label="Processing"        value={(d.orders_by_status["processing"] ?? 0).toString()} color="#8B5CF6" />
        <KpiCard label="NFC Pending"       value={(d.orders_by_status["nfc_pending"] ?? 0).toString()} color="#F59E0B" sub="Awaiting memory link" />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl border border-[#e8ddd7] p-6">
        <h2 className="font-bold text-[#1B1C1C] mb-6">Revenue — Last 14 Days (₹)</h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={d.revenue_by_day}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94492c" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#94492c" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0eded" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#7A6860" }} />
            <YAxis tick={{ fontSize: 11, fill: "#7A6860" }} tickFormatter={(v) => `₹${v}`} />
            <Tooltip formatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`} />
            <Area type="monotone" dataKey="revenue" stroke="#94492c" strokeWidth={2} fill="url(#revGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row: Orders by Status + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Status Pie */}
        <div className="bg-white rounded-2xl border border-[#e8ddd7] p-6">
          <h2 className="font-bold text-[#1B1C1C] mb-4">Orders by Status</h2>
          {statusPieData.length === 0 ? (
            <p className="text-[#7A6860] text-sm text-center py-12">No orders yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label>
                  {statusPieData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? "#9CA3AF"} />
                  ))}
                </Pie>
                <Legend formatter={(v) => v.replace(/_/g, " ")} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Products Bar */}
        <div className="bg-white rounded-2xl border border-[#e8ddd7] p-6">
          <h2 className="font-bold text-[#1B1C1C] mb-4">Top Products (by units sold)</h2>
          {d.top_products.length === 0 ? (
            <p className="text-[#7A6860] text-sm text-center py-12">No sales data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={d.top_products} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0eded" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#7A6860" }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#7A6860" }} width={120} />
                <Tooltip />
                <Bar dataKey="count" fill="#94492c" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Referral Link Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Referral Link Generator */}
        <div className="bg-white rounded-2xl border border-[#e8ddd7] p-6 flex flex-col gap-4">
          <div>
            <h2 className="font-bold text-lg text-[#1B1C1C]">Create Referral Link</h2>
            <p className="text-xs text-[#7A6860] mt-1">Generate a custom tracked URL for an influencer</p>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[#7A6860] uppercase tracking-wider">Influencer Code / Name</label>
            <input
              type="text"
              placeholder="e.g. sharma_ji"
              value={influencerCode}
              onChange={(e) => setInfluencerCode(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-[#e8ddd7] bg-[#FBF7F4]/50 focus:outline-none focus:border-[#94492c] text-sm text-[#1B1C1C]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[#7A6860] uppercase tracking-wider">Target Product (Optional)</label>
            <select
              value={selectedProductSlug}
              onChange={(e) => setSelectedProductSlug(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-[#e8ddd7] bg-[#FBF7F4]/50 focus:outline-none focus:border-[#94492c] text-sm text-[#1B1C1C]"
            >
              <option value="">All Products (Shop Home)</option>
              {productsList.map((p) => (
                <option key={p.slug} value={p.slug}>{p.name}</option>
              ))}
            </select>
          </div>

          {generatedLink && (
            <div className="mt-2 p-4 bg-[#FBF7F4] border border-[#e8ddd7] rounded-xl flex flex-col gap-2">
              <span className="text-[11px] font-bold text-[#7A6860] uppercase tracking-wider">Generated Link</span>
              <p className="text-xs font-mono break-all text-[#1B1C1C] bg-white border border-[#e8ddd7] p-2 rounded-lg">{generatedLink}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedLink);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className={`py-2 rounded-lg text-xs font-bold transition-all text-white ${
                  copied ? "bg-green-600" : "bg-[#94492c] hover:bg-[#7a3b22]"
                }`}
              >
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          )}
        </div>

        {/* Influencer Referrals & Royalty Tracker Table */}
        <div className="bg-white rounded-2xl border border-[#e8ddd7] p-6 lg:col-span-2">
          <div className="flex flex-col gap-1 mb-6">
            <h2 className="font-bold text-lg text-[#1B1C1C]">Influencer Referrals & Royalty Tracker</h2>
            <p className="text-xs text-[#7A6860]">Order referrers tracked from custom links (10% estimated royalty)</p>
          </div>
          {d.referrers.length === 0 ? (
            <p className="text-[#7A6860] text-sm text-center py-10">No referral sales recorded yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#e8ddd7] text-[#7A6860] font-bold">
                    <th className="pb-3 pr-4">Influencer / Code</th>
                    <th className="pb-3 px-4 text-center">Clicks</th>
                    <th className="pb-3 px-4 text-center">Prod Views</th>
                    <th className="pb-3 px-4 text-center">Orders</th>
                    <th className="pb-3 px-4 text-center">Conv. Rate</th>
                    <th className="pb-3 px-4 text-right">Total Revenue</th>
                    <th className="pb-3 pl-4 text-right text-[#94492c]">Est. Royalty (10%)</th>
                  </tr>
                </thead>
                <tbody>
                  {d.referrers.map((ref) => (
                    <tr key={ref.code} className="border-b border-[#f5eded] last:border-0 hover:bg-[#FBF7F4]/50 transition-colors">
                      <td className="py-3 pr-4 font-semibold text-[#1B1C1C]">{ref.code}</td>
                      <td className="py-3 px-4 text-center text-[#7A6860]">{ref.clicks}</td>
                      <td className="py-3 px-4 text-center text-[#7A6860]">{ref.views}</td>
                      <td className="py-3 px-4 text-center text-[#7A6860]">{ref.count}</td>
                      <td className="py-3 px-4 text-center text-[#7A6860]">{ref.conversion_rate.toFixed(1)}%</td>
                      <td className="py-3 px-4 text-right font-medium text-[#1B1C1C]">{formatPrice(ref.revenue)}</td>
                      <td className="py-3 pl-4 text-right font-bold text-[#94492c]">{formatPrice(ref.royalty)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
