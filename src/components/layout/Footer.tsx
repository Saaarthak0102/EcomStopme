"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";

export function Footer() {
  const isDesktop = useMediaQuery("lg");
  if (!isDesktop) return null;

  return (
    <footer className="mt-20 border-t border-black/5 bg-[var(--color-surface-white)] py-12">
      <div className="mx-auto max-w-[1200px] px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[var(--color-text-muted)]">
        <div>
          <span className="text-xl font-bold italic font-serif text-[var(--color-primary)]">Stopme</span>
          <p className="mt-2">Personalized photo goodies.</p>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-[var(--color-primary)]">Terms</a>
          <a href="#" className="hover:text-[var(--color-primary)]">Privacy</a>
          <a href="#" className="hover:text-[var(--color-primary)]">Contact</a>
        </div>
      </div>
    </footer>
  );
}
