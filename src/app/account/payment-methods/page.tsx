"use client";

import { useState } from "react";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import { useAccountStore } from "@/lib/store/accountStore";
import { Modal } from "@/components/ui/Modal";
import { PaymentForm } from "@/components/account/PaymentForm";

export default function PaymentMethodsPage() {
  const { paymentMethods, removePaymentMethod } = useAccountStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (id: string) => {
    if (confirm("Remove this payment method?")) {
      removePaymentMethod(id);
    }
  };

  return (
    <div className="mx-auto max-w-[800px] px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl font-bold italic text-[var(--color-primary)]">Payment Methods</h1>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-4 py-2 rounded-full hover:bg-[var(--color-primary)]/20 transition-colors">
          <Plus className="h-4 w-4" /> Add New
        </button>
      </div>
      
      {paymentMethods.length === 0 ? (
        <div className="text-center py-12 text-[var(--color-text-muted)]">No saved payment methods.</div>
      ) : (
        <div className="space-y-4">
          {paymentMethods.map(method => (
            <div key={method.id} className="bg-white p-6 rounded-2xl shadow-soft border border-black/5 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-3 rounded-xl">
                  <CreditCard className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-semibold text-lg">•••• •••• •••• {method.last4}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">Expires {method.expiry}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {method.isDefault && <span className="text-sm font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-3 py-1 rounded-full">Default</span>}
                <button onClick={() => handleDelete(method.id)} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add a Payment Method">
        <PaymentForm 
          onSuccess={() => setIsModalOpen(false)} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}
