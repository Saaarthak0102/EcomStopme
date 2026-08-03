"use client";

import Link from "next/link";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function Footer() {
  // Removing isDesktop check so footer shows on mobile too, but with pb-24 for the BottomNav
  return (
    <footer className="bg-[var(--color-surface-dim)] border-t border-black/5 pt-16 pb-24 lg:pb-12 mt-auto">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div className="md:col-span-2">
            <span className="font-serif text-3xl font-bold text-[var(--color-primary)] italic">Stopme</span>
            <p className="font-sans text-sm text-[var(--color-text-muted)] mt-4 leading-relaxed max-w-sm">
              Preserving life's most intimate milestones with timeless grace. We combine high-end technology with artistic vision.
            </p>
          </div>
          <div className="col-span-1">
            <h4 className="font-sans font-semibold text-[14px] text-[var(--color-primary)] mb-6 uppercase tracking-wider">Explore</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors text-sm">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors text-sm">
                  Account
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h5 className="font-sans font-semibold text-[14px] text-[var(--color-primary)] mb-6 uppercase tracking-wider">Connect</h5>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://www.instagram.com/stopme.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Stopme on Instagram"
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors text-sm"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/spotmeus/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Stopme on LinkedIn"
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors text-sm"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-black/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <p className="text-sm font-medium text-[var(--color-text-muted)]">
              &copy; {new Date().getFullYear()} Stopme Photography. All rights reserved.
            </p>
            <span className="hidden sm:inline text-black/20 text-sm">|</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[var(--color-text-muted)]">Powered by</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/tattvalogo.svg"
                alt="Tattva"
                className="h-6 sm:h-7 w-auto object-contain"
              />
            </div>
          </div>
          <div className="flex gap-6">
            <a href="/privacy-policy" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
