"use client";
import { useState } from "react";

export default function AccountDetailsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setSaved(false);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-[800px] px-6 py-8">
      <h1 className="mb-8 font-serif text-3xl font-bold italic text-[var(--color-primary)]">Account Details</h1>
      <div className="bg-white p-6 rounded-2xl shadow-soft border border-black/5">
        <p className="text-[var(--color-text-muted)]">Manage your personal information and preferences.</p>
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input type="text" className="w-full p-2 border border-black/10 rounded-lg" defaultValue="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full p-2 border border-black/10 rounded-lg" defaultValue="john@example.com" />
          </div>
          <div className="flex items-center gap-4 mt-6">
            <button onClick={handleSave} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-full font-medium min-w-[140px] transition-all disabled:opacity-70" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
            {saved && <span className="text-sm text-green-600 font-medium">Successfully saved!</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
