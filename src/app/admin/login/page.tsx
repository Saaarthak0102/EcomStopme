"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin/kpis");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1B1C1C] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold italic font-serif text-[#94492c]">
            Stopme
          </Link>
          <h1 className="text-2xl font-bold text-white mt-4 font-serif">Admin Portal</h1>
          <p className="text-white/60 mt-1 text-sm">Enter secret key to authenticate</p>
        </div>

        <div className="bg-[#2D2E2E] rounded-3xl border border-white/10 p-8 flex flex-col gap-6 shadow-xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-[13px] font-semibold text-white/80 mb-1.5 block">
                Admin Secret Key
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secret key…"
                  className="w-full border border-white/10 rounded-xl px-4 py-3 pr-11 text-[14px] focus:outline-none focus:border-[#94492c] bg-[#1B1C1C] text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-3.5 text-white/40 hover:text-white/80"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-[13px] text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#94492c] hover:bg-[#7a3b22] disabled:opacity-60 text-white font-bold py-4 rounded-full text-[15px] transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Authenticate
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <Link href="/" className="text-[13px] text-white/40 hover:text-white/80 transition-colors">
              ← Back to Store
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
