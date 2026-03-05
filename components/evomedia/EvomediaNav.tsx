"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { evomediaContent } from "@/lib/evomedia-content";

const nav = evomediaContent.nav;

export default function EvomediaNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a
            href="#hero"
            className="font-bold text-xl md:text-2xl tracking-tight"
          >
            <span className="evomedia-gradient-text">{nav.logoHighlight}</span>
            <span className="text-white">{nav.logoRest}</span>
          </a>

          <ul className="hidden md:flex items-center gap-6 lg:gap-8">
            {nav.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-gray-400 hover:text-[#00d4ff] transition-colors text-sm font-medium"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 bg-[#0a0a0f]"
          >
            <ul className="px-4 py-4 space-y-2">
              {nav.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-2 text-gray-400 hover:text-[#00d4ff] transition-colors"
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
