"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { evomediaContent } from "@/lib/evomedia-content";
import ThemeToggle from "@/components/ThemeToggle";

const nav = evomediaContent.nav;
const navLinks =
  evomediaContent.testimonials.enabled === false
    ? nav.links.filter((link) => link.href !== "#testimonials")
    : nav.links;

export default function EvomediaNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="evomedia-nav fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/5"
      data-theme-aware
    >
      <a href="#main-content" className="evomedia-skip-link">
        Skip to main content
      </a>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a
            href="#hero"
            className="font-bold text-xl md:text-2xl tracking-tight"
          >
            <span className="evomedia-gradient-text">{nav.logoHighlight}</span>
            <span className="text-white evomedia-nav-logo">{nav.logoRest}</span>
          </a>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <ul className="flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#00d4ff] evomedia-nav-link transition-colors text-sm font-medium"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="p-2 text-gray-400 hover:text-white evomedia-nav-btn"
              aria-label="Toggle menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="evomedia-nav-dropdown md:hidden border-t border-white/5 bg-[#0a0a0f]"
          >
            <ul className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="evomedia-nav-link block py-2 text-gray-400 hover:text-[#00d4ff] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
