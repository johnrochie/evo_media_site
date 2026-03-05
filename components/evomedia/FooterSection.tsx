"use client";

import { motion } from "framer-motion";
import { MapPin, Twitter, Instagram } from "lucide-react";
import CookiePreferencesLink from "@/components/CookiePreferencesLink";
import { evomediaContent } from "@/lib/evomedia-content";

const c = evomediaContent.footer;
const footerLinks = evomediaContent.nav.links.slice(1);

const social = [
  { icon: Twitter, href: "https://x.com/evomediax", label: "X" },
  { icon: Instagram, href: "https://instagram.com/evomedia_gram", label: "Instagram" },
];

export default function FooterSection() {
  return (
    <footer className="border-t border-white/5 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <a href="#hero" className="inline-block mb-4">
              <span className="font-bold text-2xl">
                <span className="evomedia-gradient-text">{c.logoHighlight}</span>
                <span className="text-white">{c.logoRest}</span>
              </span>
            </a>
            <p className="text-gray-400 text-sm max-w-sm mb-4">
              {c.tagline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-400">
              <a
                href="#contact"
                className="flex items-center gap-2 hover:text-[#00d4ff] transition-colors"
              >
                Get in touch
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {c.location}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
          >
            <h4 className="text-white font-semibold mb-4">{c.quickLinksTitle}</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#00d4ff] transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-white font-semibold mb-4">{c.followTitle}</h4>
            <div className="flex gap-4">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-lg bg-[#12121a] border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#00d4ff] hover:border-[#00d4ff]/30 transition-colors"
                >
                  <s.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500"
        >
          <p>© {new Date().getFullYear()} {c.copyright}. All rights reserved.</p>
          <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6">
            <a href="/privacy" className="hover:text-gray-400 transition-colors">
              {c.privacy}
            </a>
            <a href="/terms" className="hover:text-gray-400 transition-colors">
              {c.terms}
            </a>
            <CookiePreferencesLink />
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
