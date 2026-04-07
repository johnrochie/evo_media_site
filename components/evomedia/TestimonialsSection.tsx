"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { ScrollSection, ScrollItem } from "./ScrollSection";
import { evomediaContent } from "@/lib/evomedia-content";

const c = evomediaContent.testimonials;

export default function TestimonialsSection() {
  if (c.enabled === false) {
    return null;
  }

  return (
    <ScrollSection id="testimonials" className="py-20 md:py-28 bg-[#0d0d12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollItem className="text-center mb-16">
          <p className="text-[#ff00aa] font-semibold tracking-widest uppercase text-sm mb-2">
            {c.label}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {c.title} <span className="evomedia-gradient-text">{c.titleHighlight}</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {c.subtitle}
          </p>
        </ScrollItem>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {c.items.map((t, i) => (
            <ScrollItem key={i} delay={i * 0.1}>
              <motion.div
                className="h-full p-6 md:p-8 rounded-2xl bg-[#12121a] border border-white/5 hover:border-[#00d4ff]/20 transition-colors"
                whileHover={{ y: -2 }}
              >
                <Quote className="w-10 h-10 text-[#00d4ff]/40 mb-4" />
                <p className="text-gray-300 mb-6 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00d4ff]/30 to-[#ff00aa]/30 flex items-center justify-center text-sm font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{t.author}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            </ScrollItem>
          ))}
        </div>
      </div>
    </ScrollSection>
  );
}
