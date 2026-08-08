import Link from "next/link";
import { Mail } from "lucide-react";

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-[#FBF7F4] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#e8ddd7] p-10 text-center flex flex-col items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-[#94492c]/10 flex items-center justify-center">
          <Mail className="w-10 h-10 text-[#94492c]" />
        </div>
        <h1 className="text-2xl font-bold font-serif text-[#1B1C1C]">Check your inbox</h1>
        <p className="text-[#7A6860] text-[14px] leading-relaxed max-w-xs">
          We&apos;ve sent a verification link to your email address. Please click it to activate your account.
        </p>
        <div className="bg-[#FBF7F4] rounded-2xl border border-[#e8ddd7] px-5 py-4 text-[13px] text-[#7A6860] w-full">
          Didn&apos;t receive it? Check your spam folder or{" "}
          <Link href="/auth/signup" className="text-[#94492c] font-semibold hover:underline">
            try again
          </Link>
        </div>
        <Link
          href="/"
          className="text-[13px] text-[#7A6860] hover:text-[#94492c] transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
