"use client";

import Link from "next/link";
import { Grid, ShoppingBag, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/store/cartStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const isDesktop = useMediaQuery("lg");
  const pathname = usePathname();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (isDesktop) return null;

  const tabs = [
    { icon: Grid, label: "Shop", href: "/shop" },
    { icon: ShoppingBag, label: "Cart", href: "/cart", badge: cartCount },
    { icon: User, label: "Account", href: "/account" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-black/5 bg-[var(--color-surface-white)] pb-safe">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || (tab.href !== "/" && pathname.startsWith(tab.href));
        return (
          <Link key={tab.href} href={tab.href} className={cn("flex flex-col items-center justify-center w-full h-full gap-1", isActive ? "text-[var(--color-primary)]" : "text-[var(--color-text-muted)]")}>
            <div className="relative">
              <tab.icon className="h-5 w-5" />
              {tab.badge ? (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] font-bold text-white">
                  {tab.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
