"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/loopnik-site";

const links = [
  { href: "#play", label: "Play" },
  { href: "#features", label: "Features" },
  { href: "#support", label: "Support" },
] as const;

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-white/5 bg-[var(--loopnik-bg)]/85 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#hero" className="font-display text-lg font-black tracking-tight">
          <span className="text-white">LOOP</span>
          <span className="text-[var(--loopnik-accent)]">NIK</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-[var(--loopnik-muted)] transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={site.appStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-[var(--loopnik-accent)] px-4 py-2 text-sm font-bold text-[var(--loopnik-bg)] transition-opacity hover:opacity-90"
        >
          App Store
        </a>
      </div>
    </header>
  );
}
