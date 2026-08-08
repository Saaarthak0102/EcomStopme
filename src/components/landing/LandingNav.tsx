"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Story", href: "#why-different" },
  { label: "FAQ", href: "#faq" },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.getElementById(href.replace("#", ""));
      if (el) el.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#FBF7F4]/90 backdrop-blur-md shadow-sm border-b border-[#e8ddd7]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold italic font-serif text-[#94492c]">
          Stopme
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-[14px] font-medium text-[#54433d] hover:text-[#94492c] transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-[#94492c] transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/shop"
            className="hidden md:inline-flex items-center gap-2 bg-[#94492c] hover:bg-[#7a3b22] text-white text-[13px] font-semibold px-5 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Order Now
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-1"
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 w-5 bg-[#94492c] transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 bg-[#94492c] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 bg-[#94492c] transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#FBF7F4]/95 backdrop-blur-md border-t border-[#e8ddd7] px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-[15px] font-medium text-[#54433d] hover:text-[#94492c] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/shop"
            onClick={() => setMenuOpen(false)}
            className="inline-flex items-center justify-center gap-2 bg-[#94492c] text-white text-[13px] font-semibold px-5 py-2.5 rounded-full mt-2"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Order Now
          </Link>
        </div>
      )}
    </header>
  );
}
