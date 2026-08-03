import { Card } from "@/components/ui/Card";

export default function AddressesPage() {
  const addresses = [
    { id: 1, label: "Home", text: "123 Main St, Apartment 4B\nMumbai, Maharashtra 400001\nIndia" },
    { id: 2, label: "Office", text: "WeWork BKC, 5th Floor\nMumbai, Maharashtra 400051\nIndia" },
  ];

  return (
    <div className="mx-auto max-w-[800px] px-6 py-8">
      <h1 className="mb-8 font-serif text-3xl font-bold italic text-[var(--color-primary)]">Saved Addresses</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map(addr => (
          <Card key={addr.id} className="p-6">
            <h3 className="font-bold mb-2">{addr.label}</h3>
            <p className="whitespace-pre-line text-sm text-[var(--color-text-muted)] leading-relaxed">
              {addr.text}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
