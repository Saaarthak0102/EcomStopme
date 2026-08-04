import { CreditCard, Plus } from "lucide-react";

export default function PaymentMethodsPage() {
  return (
    <div className="mx-auto max-w-[800px] px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl font-bold italic text-[var(--color-primary)]">Payment Methods</h1>
        <button className="flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-4 py-2 rounded-full">
          <Plus className="h-4 w-4" /> Add New
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-black/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 p-3 rounded-xl">
              <CreditCard className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="font-semibold text-lg">•••• •••• •••• 4242</p>
              <p className="text-sm text-[var(--color-text-muted)]">Expires 12/28</p>
            </div>
          </div>
          <span className="text-sm font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-3 py-1 rounded-full">Default</span>
        </div>
      </div>
    </div>
  );
}
