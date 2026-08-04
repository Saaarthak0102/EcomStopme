"use client";

export function Footer() {
  return (
    <footer className="bg-[var(--color-surface-dim)] border-t border-black/5 pt-8 pb-16 lg:pb-8 mt-auto">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-8">
          <span className="font-serif text-3xl font-bold text-[var(--color-primary)] italic">Stopme</span>
          <p className="font-sans text-sm text-[var(--color-text-muted)] mt-4 leading-relaxed max-w-sm">
            Preserving life's most intimate milestones with timeless grace. We combine high-end technology with artistic vision.
          </p>
        </div>
        <div className="border-t border-black/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <p className="text-sm font-medium text-[var(--color-text-muted)]">
              &copy; {new Date().getFullYear()} Stopme Photography. All rights reserved.
            </p>
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
