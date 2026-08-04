"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([
    { id: 1, label: "Home", text: "123 Main St, Apartment 4B\nMumbai, Maharashtra 400001\nIndia" },
    { id: 2, label: "Office", text: "WeWork BKC, 5th Floor\nMumbai, Maharashtra 400051\nIndia" },
  ]);

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this address?")) {
      setAddresses(addresses.filter(a => a.id !== id));
    }
  };

  const handleAdd = () => {
    alert("This would open an 'Add Address' form modal.");
  };

  const handleEdit = () => {
    alert("This would open an 'Edit Address' form modal.");
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
                <button onClick={handleEdit} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><Edit2 className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(addr.id)} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
              <h3 className="font-bold mb-2">{addr.label}</h3>
              <p className="whitespace-pre-line text-sm text-[var(--color-text-muted)] leading-relaxed">
                {addr.text}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
