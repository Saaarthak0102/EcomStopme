"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useAccountStore } from "@/lib/store/accountStore";
import { Modal } from "@/components/ui/Modal";
import { AddressForm } from "@/components/account/AddressForm";
import { Address } from "@/lib/types";

export default function AddressesPage() {
  const { addresses, removeAddress } = useAccountStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      removeAddress(id);
    }
  };

  const handleAdd = () => {
    setEditingAddress(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (addr: Address) => {
    setEditingAddress(addr);
    setIsModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-[800px] px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl font-bold italic text-[var(--color-primary)]">Saved Addresses</h1>
        <button onClick={handleAdd} className="flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-4 py-2 rounded-full hover:bg-[var(--color-primary)]/20 transition-colors">
          <Plus className="h-4 w-4" /> Add New
        </button>
      </div>
      
      {addresses.length === 0 ? (
        <div className="text-center py-12 text-[var(--color-text-muted)]">No saved addresses. Add one to checkout faster!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map(addr => (
            <Card key={addr.id} className="p-6 relative group">
              <div className="absolute top-4 right-4 flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(addr)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><Edit2 className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(addr.id)} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold">{addr.fullName}</h3>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-gray-100 rounded-full font-bold">{addr.label}</span>
                {addr.isDefault && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full font-bold">Default</span>}
              </div>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                {addr.flatHouse}, {addr.areaStreet}<br />
                {addr.landmark ? `${addr.landmark}\n` : ""}
                {addr.city}, {addr.state} {addr.pinCode}<br />
                Phone number: {addr.mobileNumber}
              </p>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAddress ? "Edit address" : "Add a new address"}>
        <AddressForm 
          existingAddress={editingAddress}
          onSuccess={() => setIsModalOpen(false)} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}
