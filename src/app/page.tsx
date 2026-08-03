import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-[var(--color-surface-dim)]">
        <div className="absolute inset-0 gradient-hero-dash z-0" />
        
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold font-serif italic text-[var(--color-primary)] mb-6 tracking-tight">
            See your photo on it <br/> before you buy.
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-text-muted)] mb-10 max-w-2xl mx-auto">
            Premium personalized gifts, home decor, and photo goodies crafted with love.
          </p>
          <Link href="/shop">
            <Button size="lg" className="px-12 py-4 text-lg rounded-full shadow-soft-lift hover:-translate-y-1 transition-transform">
              Start Creating
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Short mock trending section */}
      <section className="w-full max-w-[1200px] mx-auto px-6 py-20">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-bold font-serif italic text-[var(--color-primary)]">Trending Now</h2>
          <Link href="/shop" className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">
            View All →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Mock empty states linking to shop */}
          {[1, 2, 3, 4].map(i => (
            <Link href="/shop" key={i}>
              <div className="aspect-[4/5] bg-[var(--color-surface-dim)] rounded-[26px] mb-4 hover:shadow-soft-lift hover:-translate-y-2 transition-all cursor-pointer" />
              <div className="h-4 w-3/4 bg-[var(--color-surface-dim)] rounded mb-2" />
              <div className="h-4 w-1/4 bg-[var(--color-surface-dim)] rounded" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
