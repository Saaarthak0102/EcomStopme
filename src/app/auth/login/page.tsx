"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({
  email:    z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ email, password }: FormData) => {
    setLoading(true); setError(null);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    router.push("/account");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#FBF7F4] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold italic font-serif text-[#94492c]">Stopme</Link>
          <h1 className="text-2xl font-bold text-[#1B1C1C] mt-4">Welcome back</h1>
          <p className="text-[#7A6860] mt-1 text-sm">Sign in to track your orders</p>
        </div>

        <div className="bg-white rounded-3xl border border-[#e8ddd7] p-8 flex flex-col gap-5">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label className="text-[13px] font-semibold text-[#1B1C1C] mb-1.5 block">Email Address</label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@email.com"
                className="w-full border border-[#e8ddd7] rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#94492c] focus:ring-1 focus:ring-[#94492c] bg-[#FBF7F4]"
              />
              {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-[13px] font-semibold text-[#1B1C1C] mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full border border-[#e8ddd7] rounded-xl px-4 py-3 pr-11 text-[14px] focus:outline-none focus:border-[#94492c] focus:ring-1 focus:ring-[#94492c] bg-[#FBF7F4]"
                />
                <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-3.5 text-[#7A6860]">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-[11px] mt-1">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-[13px] text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#94492c] hover:bg-[#7a3b22] disabled:opacity-60 text-white font-bold py-4 rounded-full text-[15px] transition-all flex items-center justify-center"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Sign In"}
            </button>
          </form>

          <div className="text-center text-[13px] text-[#7A6860]">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-[#94492c] font-semibold hover:underline">
              Create one
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
