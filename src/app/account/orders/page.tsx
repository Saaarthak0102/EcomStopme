import Link from "next/link";
import { Card } from "@/components/ui/Card";

export default function OrdersPage() {
  const mockOrders = [
    { id: "ORD-10294", date: "Oct 12, 2026", status: "processing", total: 1299 },
    { id: "ORD-09211", date: "Sep 05, 2026", status: "delivered", total: 899 },
  ];

  return (
    <div className="mx-auto max-w-[800px] px-6 py-8">
      <h1 className="mb-8 font-serif text-3xl font-bold italic text-[var(--color-primary)]">My Orders</h1>
      
      <div className="space-y-4">
        {mockOrders.map(order => (
          <Link key={order.id} href={`/account/orders/${order.id}`} className="block">
            <Card hoverLift className="flex justify-between items-center p-6 cursor-pointer">
              <div>
                <p className="font-bold text-lg mb-1">{order.id}</p>
                <p className="text-sm text-[var(--color-text-muted)]">{order.date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg mb-1">₹{order.total}</p>
                <span className="capitalize text-sm font-medium px-2 py-1 bg-[var(--color-surface-dim-2)] rounded-full text-[var(--color-text-muted)]">
                  {order.status}
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
