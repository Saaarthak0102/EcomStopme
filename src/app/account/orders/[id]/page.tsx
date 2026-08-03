import { use } from "react";
import { Card } from "@/components/ui/Card";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="mx-auto max-w-[800px] px-6 py-8">
      <h1 className="mb-8 font-serif text-3xl font-bold italic text-[var(--color-primary)]">Order {id}</h1>
      
      <Card className="p-8 space-y-8">
        <div>
          <h2 className="text-lg font-bold mb-4">Tracking Status</h2>
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-[var(--color-surface-dim-2)] -z-10 -translate-y-1/2 rounded-full" />
            
            {["Processing", "Printing", "Shipped", "Delivered"].map((step, i) => (
              <div key={step} className="flex flex-col items-center gap-2">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-surface-dim-2)] text-[var(--color-text-muted)]"}`}>
                  {i + 1}
                </div>
                <span className={`text-xs font-medium ${i === 0 ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]"}`}>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-black/5">
          <h2 className="text-lg font-bold mb-4">Items</h2>
          <p className="text-[var(--color-text-muted)] text-sm">Order details hidden for mock.</p>
        </div>
      </Card>
    </div>
  );
}
