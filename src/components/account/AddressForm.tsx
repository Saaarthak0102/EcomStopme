"use client";

import { useState, useEffect } from "react";
import { Address } from "@/lib/types";
import { useAccountStore } from "@/lib/store/accountStore";

interface AddressFormProps {
  existingAddress?: Address;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddressForm({ existingAddress, onSuccess, onCancel }: AddressFormProps) {
  const { addAddress, updateAddress } = useAccountStore();
  
  const [formData, setFormData] = useState<Address>({
    id: "",
    label: "Home",
    fullName: "",
    mobileNumber: "",
    pinCode: "",
    flatHouse: "",
    areaStreet: "",
    landmark: "",
    city: "",
    state: "",
    isDefault: false
  });

  useEffect(() => {
    if (existingAddress) {
      setFormData(existingAddress);
    }
  }, [existingAddress]);

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
          <input required type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full p-2 border border-black/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mobile Number</label>
          <input required type="tel" value={formData.mobileNumber} onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})} className="w-full p-2 border border-black/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">PIN Code</label>
          <input required type="text" value={formData.pinCode} onChange={(e) => setFormData({...formData, pinCode: e.target.value})} className="w-full p-2 border border-black/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Town/City</label>
          <input required type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full p-2 border border-black/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">State</label>
        <input required type="text" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="w-full p-2 border border-black/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Flat, House no., Building, Company, Apartment</label>
        <input required type="text" value={formData.flatHouse} onChange={(e) => setFormData({...formData, flatHouse: e.target.value})} className="w-full p-2 border border-black/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Area, Street, Sector, Village</label>
        <input required type="text" value={formData.areaStreet} onChange={(e) => setFormData({...formData, areaStreet: e.target.value})} className="w-full p-2 border border-black/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Landmark (Optional)</label>
        <input type="text" value={formData.landmark || ""} onChange={(e) => setFormData({...formData, landmark: e.target.value})} className="w-full p-2 border border-black/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
      </div>

      <div className="flex items-center gap-4 pt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="label" checked={formData.label === "Home"} onChange={() => setFormData({...formData, label: "Home"})} className="accent-[var(--color-primary)]" />
          <span className="text-sm font-medium">Home</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="label" checked={formData.label === "Office"} onChange={() => setFormData({...formData, label: "Office"})} className="accent-[var(--color-primary)]" />
          <span className="text-sm font-medium">Office</span>
        </label>
      </div>

      <label className="flex items-center gap-2 cursor-pointer pt-2">
        <input type="checkbox" checked={formData.isDefault} onChange={(e) => setFormData({...formData, isDefault: e.target.checked})} className="accent-[var(--color-primary)] rounded" />
        <span className="text-sm font-medium">Make this my default address</span>
      </label>

      <div className="flex gap-4 pt-6">
        <button type="button" onClick={onCancel} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold transition-colors">Cancel</button>
        <button type="submit" className="flex-1 py-3 bg-[var(--color-primary)] hover:bg-[#b0451a] text-white rounded-xl font-bold transition-colors">Save Address</button>
      </div>
    </form>
  );
}
