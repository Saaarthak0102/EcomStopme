import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-[800px] px-6 py-20 text-center">
      <div className="flex justify-center mb-6 text-[var(--color-primary)]">
        <CheckCircle2 className="h-20 w-20" />
      </div>
      <h1 className="mb-4 font-serif text-4xl font-bold italic text-[var(--color-primary)]">Order Confirmed!</h1>
      <p className="text-lg text-[var(--color-text-muted)] mb-8">
        Your personalized photo goodies are being prepared. 
        Estimated production time is 2-3 days before shipping.
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link href="/account/orders">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">Track Order</Button>
        </Link>
        <Link href="/shop">
          <Button variant="primary" size="lg" className="w-full sm:w-auto">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
