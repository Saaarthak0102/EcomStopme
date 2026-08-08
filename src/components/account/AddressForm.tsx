"use client";

import { useState, useEffect } from "react";
import { Address } from "@/lib/types";
import { useAccountStore } from "@/lib/store/accountStore";

interface AddressFormProps {
  existingAddress?: Address;
  onSuccess: () => void;
  onCancel: () => void;
}

const EMPTY_ADDRESS: Address = {
  id: "",
  label: "Home",
  full_name: "",
  phone: "",
  pincode: "",
  street_address: "",
  city: "",
  state: "",
  is_default: false,
};

export function AddressForm({ existingAddress, onSuccess, onCancel }: AddressFormProps) {
  const { addAddress, updateAddress } = useAccountStore();
  const [formData, setFormData] = useState<Address>(EMPTY_ADDRESS);

  useEffect(() => {
    if (existingAddress) setFormData(existingAddress);
  }, [existingAddress]);

  const set = (field: keyof Address, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (existingAddress) {
      updateAddress(existingAddress.id, formData);
    } else {
      addAddress({ ...formData, id: Date.now().toString() });
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input required type="text" value={formData.full_name} onChange={(e) => set("full_name", e.target.value)} className="w-full p-2 border border-black/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mobile Number</label>
          <input required type="tel" value={formData.phone} onChange={(e) => set("phone", e.target.value)} className="w-full p-2 border border-black/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">PIN Code</label>
          <input required type="text" value={formData.pincode} onChange={(e) => set("pincode", e.target.value)} className="w-full p-2 border border-black/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Town/City</label>
          <input required type="text" value={formData.city} onChange={(e) => set("city", e.target.value)} className="w-full p-2 border border-black/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">State</label>
        <input required type="text" value={formData.state} onChange={(e) => set("state", e.target.value)} className="w-full p-2 border border-black/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Flat / House No. / Building / Street / Area / Landmark *</label>
        <input required type="text" value={formData.street_address} onChange={(e) => set("street_address", e.target.value)} placeholder="dhanalaxmi colony, 8-5-1/14, Mahabubnagar, Near Metro Station" className="w-full p-2 border border-black/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
      </div>

      <div className="flex items-center gap-4 pt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="label" checked={formData.label === "Home"} onChange={() => set("label", "Home")} className="accent-[var(--color-primary)]" />
          <span className="text-sm font-medium">Home</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="label" checked={formData.label === "Office"} onChange={() => set("label", "Office")} className="accent-[var(--color-primary)]" />
          <span className="text-sm font-medium">Office</span>
        </label>
      </div>

      <label className="flex items-center gap-2 cursor-pointer pt-2">
        <input type="checkbox" checked={formData.is_default ?? false} onChange={(e) => set("is_default", e.target.checked)} className="accent-[var(--color-primary)] rounded" />
        <span className="text-sm font-medium">Make this my default address</span>
      </label>

      <div className="flex gap-4 pt-6">
        <button type="button" onClick={onCancel} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold transition-colors">Cancel</button>
        <button type="submit" className="flex-1 py-3 bg-[var(--color-primary)] hover:bg-[#b0451a] text-white rounded-xl font-bold transition-colors">Save Address</button>
      </div>
    </form>
  );
}
