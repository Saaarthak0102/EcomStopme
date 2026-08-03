import Link from "next/link";
import { Package, MapPin, CreditCard, LogOut } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default function AccountPage() {
  const menu = [
    { icon: Package, label: "Orders", href: "/account/orders" },
    { icon: MapPin, label: "Addresses", href: "/account/addresses" },
    { icon: CreditCard, label: "Payment Methods", href: "/account" },
    { icon: LogOut, label: "Log Out", href: "/" },
  ];

  return (
    <div className="mx-auto max-w-[800px] px-6 py-8">
      <h1 className="mb-8 font-serif text-3xl font-bold italic text-[var(--color-primary)]">My Account</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {menu.map((item) => (
          <Link key={item.label} href={item.href}>
            <Card className="flex items-center gap-4 p-6 hover:bg-black/5 transition-colors cursor-pointer">
              <div className="bg-[var(--color-primary)]/10 p-3 rounded-full text-[var(--color-primary)]">
                <item.icon className="h-6 w-6" />
              </div>
              <span className="font-semibold text-lg">{item.label}</span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
