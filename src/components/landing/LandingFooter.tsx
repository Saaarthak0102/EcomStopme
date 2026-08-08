import Link from "next/link";
import { Share2, Mail } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-[#1B1C1C] text-white py-14">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-2xl font-bold italic font-serif text-[#F5C5A3] mb-3">
              Stopme
            </p>
            <p className="text-white/60 text-[13px] leading-relaxed max-w-[180px]">
              Preserving bonds through technology. One Rakhi at a time.
            </p>
            <div className="flex items-center gap-4 mt-5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#94492c] flex items-center justify-center transition-colors duration-200"
                aria-label="Instagram"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="mailto:hello@stopme.in"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#94492c] flex items-center justify-center transition-colors duration-200"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="font-semibold text-[13px] uppercase tracking-wider text-white/40 mb-4">
              Product
            </p>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Shop", href: "/shop" },
                { label: "How It Works", href: "#how-it-works" },
                { label: "Features", href: "#features" },
                { label: "Reviews", href: "#reviews" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-[#F5C5A3] text-[13px] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="font-semibold text-[13px] uppercase tracking-wider text-white/40 mb-4">
              Support
            </p>
            <ul className="flex flex-col gap-3">
              {[
                { label: "FAQ", href: "#faq" },
                { label: "Shipping & Delivery", href: "#" },
                { label: "Returns", href: "#" },
                { label: "Contact Us", href: "mailto:hello@stopme.in" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-[#F5C5A3] text-[13px] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="font-semibold text-[13px] uppercase tracking-wider text-white/40 mb-4">
              Legal
            </p>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
                { label: "Refund Policy", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-[#F5C5A3] text-[13px] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-[12px]">
            © {new Date().getFullYear()} Stopme. All rights reserved.
          </p>
          <p className="text-white/30 text-[12px]">
            Made with ❤️ for every sibling bond.
          </p>
        </div>
      </div>
    </footer>
  );
}
