"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/lib/types";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit2, Eye, EyeOff, Trash2 } from "lucide-react";

function formatPrice(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("products")
      .select("*, product_variants(*)")
      .order("display_order", { ascending: true });
    setProducts((data ?? []) as Product[]);
    setLoading(false);
  };

  const toggleActive = async (id: string, current: boolean) => {
    const supabase = createClient();
    await supabase.from("products").update({ is_active: !current }).eq("id", id);
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, is_active: !current } : p)));
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"? This action cannot be undone and will delete all associated variants.`)) {
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert(`Failed to delete product: ${error.message}`);
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1B1C1C]">Products</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-[#94492c] text-white font-semibold px-5 py-2.5 rounded-full text-[13px] hover:bg-[#7a3b22] transition-all"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#94492c] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-[#e8ddd7] overflow-hidden flex"
            >
              <div className="relative w-28 flex-shrink-0 bg-[#FBF7F4]">
                {product.images?.[0] ? (
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#e8ddd7]">
                    <span className="text-4xl">📿</span>
                  </div>
                )}
              </div>
              <div className="flex-1 p-5 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-[14px] text-[#1B1C1C]">{product.name}</h2>
                    {product.has_nfc && (
                      <span className="text-[10px] font-bold bg-[#94492c]/10 text-[#94492c] px-2 py-0.5 rounded-full">
                        NFC
                      </span>
                    )}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      product.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {product.is_active ? "Active" : "Hidden"}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#7A6860] mt-1">
                    {formatPrice(product.base_price)} · {product.variants?.length ?? 0} variants
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="flex items-center gap-1.5 text-[12px] font-semibold text-[#94492c] border border-[#94492c]/30 px-3 py-1.5 rounded-lg hover:bg-[#94492c]/5 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </Link>
                  <button
                    onClick={() => toggleActive(product.id, product.is_active)}
                    className="flex items-center gap-1.5 text-[12px] font-semibold text-[#7A6860] border border-[#e8ddd7] px-3 py-1.5 rounded-lg hover:border-[#7A6860] transition-colors"
                  >
                    {product.is_active ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {product.is_active ? "Hide" : "Show"}
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id, product.name)}
                    className="flex items-center gap-1.5 text-[12px] font-semibold text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 hover:border-red-500 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
