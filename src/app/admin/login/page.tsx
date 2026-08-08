"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Check url search params for middleware-redirected unauthorized error
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "unauthorized") {
      setErrorMsg("Access Denied: You do not have admin privileges.");
    }
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserEmail(user.email ?? null);
        
        // Query admin_users to see if user is registered as admin
        const { data: adminUser } = await supabase
          .from("admin_users")
          .select("id")
          .eq("id", user.id)
          .single();

        if (adminUser) {
          setIsAdmin(true);
          router.push("/admin/kpis");
          router.refresh();
        } else {
          setIsAdmin(false);
          setErrorMsg("Access Denied: You do not have admin privileges.");
        }
      } else {
        setUserEmail(null);
        setIsAdmin(false);
      }
    } catch (err) {
      console.error("Error checking user:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/admin/kpis`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to initiate login");
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      setUserEmail(null);
      setIsAdmin(false);
      setErrorMsg(null);
      // Remove error search param if present
      router.replace("/admin/login");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to sign out");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF7F4] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold italic font-serif text-[#94492c]">
            Stopme
          </Link>
          <h1 className="text-2xl font-bold text-[#1B1C1C] mt-4 font-serif">Admin Portal</h1>
          <p className="text-[#7A6860] mt-1 text-sm">
            {userEmail ? "Verify your privileges" : "Sign in with your Google account"}
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[#e8ddd7] p-8 flex flex-col gap-6 shadow-sm">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="w-8 h-8 border-2 border-[#94492c] border-t-transparent rounded-full animate-spin" />
              <p className="text-[13px] text-[#7A6860]">Checking authentication...</p>
            </div>
          ) : userEmail && !isAdmin ? (
            <div className="flex flex-col gap-5 text-center">
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-[13px] text-red-600 font-medium">
                  {errorMsg}
                </div>
              )}
              <p className="text-[14px] text-[#7A6860]">
                Signed in as: <strong className="text-[#1B1C1C]">{userEmail}</strong>
              </p>
              <button
                onClick={handleSignOut}
                className="w-full bg-[#94492c] hover:bg-[#7a3b22] text-white font-bold py-4 rounded-full text-[15px] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-[13px] text-red-600 font-medium">
                  {errorMsg}
                </div>
              )}

              <button
                onClick={handleGoogleLogin}
                className="w-full border border-[#e8ddd7] hover:border-[#1B1C1C] text-[#1B1C1C] font-semibold py-4 rounded-full text-[15px] transition-all flex items-center justify-center gap-3 bg-white hover:bg-gray-50/50 shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.745 1.082 14.99 0 12 0 7.354 0 3.382 2.673 1.405 6.573L5.266 9.765z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.275c0-.825-.075-1.62-.21-2.385H12v4.56h6.48a5.54 5.54 0 0 1-2.4 3.63v3.015h3.87c2.265-2.085 3.54-5.145 3.54-8.82z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.266 14.235A7.077 7.077 0 0 1 4.909 12c0-.795.135-1.56.357-2.235L1.405 6.573A11.968 11.968 0 0 0 0 12c0 1.92.45 3.735 1.26 5.355l4.006-3.12z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.955-1.08 7.935-2.91l-3.87-3.015c-1.08.72-2.46 1.16-4.065 1.16-3.135 0-5.78-2.115-6.734-4.965L1.39 17.385A11.963 11.963 0 0 0 12 24z"
                  />
                </svg>
                Sign in with Google
              </button>
            </div>
          )}

          <div className="text-center mt-2">
            <Link href="/" className="text-[13px] text-[#7A6860] hover:text-[#1B1C1C] transition-colors font-medium">
              ← Back to Store
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
