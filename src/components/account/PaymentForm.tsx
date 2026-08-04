"use client";

import { useState } from "react";
import { useAccountStore } from "@/lib/store/accountStore";
import { CreditCard } from "lucide-react";

interface PaymentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentForm({ onSuccess, onCancel }: PaymentFormProps) {
  const { addPaymentMethod } = useAccountStore();
  
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const last4 = cardNumber.replace(/\s/g, '').slice(-4);
    
    addPaymentMethod({
      id: Date.now().toString(),
      type: "card",
      last4: last4 || "1234",
      expiry: expiry || "12/30",
      isDefault: false
    });
    
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-xl border border-black/5 flex items-center gap-3 mb-6">
        <CreditCard className="h-6 w-6 text-gray-500" />
        <p className="text-sm text-gray-600">Enter your card details. This is a mock form, no real charge will be made.</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Name on Card</label>
        <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border border-black/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Card Number</label>
        <input required type="text" maxLength={19} placeholder="0000 0000 0000 0000" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="w-full p-2 border border-black/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Expiry Date</label>
          <input required type="text" placeholder="MM/YY" maxLength={5} value={expiry} onChange={(e) => setExpiry(e.target.value)} className="w-full p-2 border border-black/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">CVV</label>
          <input required type="password" placeholder="123" maxLength={4} value={cvv} onChange={(e) => setCvv(e.target.value)} className="w-full p-2 border border-black/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <button type="button" onClick={onCancel} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold transition-colors">Cancel</button>
        <button type="submit" className="flex-1 py-3 bg-[var(--color-primary)] hover:bg-[#b0451a] text-white rounded-xl font-bold transition-colors">Save Card</button>
      </div>
    </form>
  );
}
