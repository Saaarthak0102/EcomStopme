"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, Package, ShoppingBag, LogOut } from "lucide-react";

const NAV = [
  { href: "/admin/kpis",     label: "KPI Dashboard", icon: BarChart2 },
  { href: "/admin/orders",   label: "Orders",         icon: Package },
  { href: "/admin/products", label: "Products",       icon: ShoppingBag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const isLoginPage = path === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#F5F0EC]">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-[#1B1C1C] text-white flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <p className="text-2xl font-bold italic font-serif text-[#94492c]">Stopme</p>
          <p className="text-xs text-white/40 mt-1 uppercase tracking-widest">Admin Panel</p>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = path.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-all ${
                  active
                    ? "bg-[#94492c] text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-6">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] text-white/40 hover:text-white/80 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
