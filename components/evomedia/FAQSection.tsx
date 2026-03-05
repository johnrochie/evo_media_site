"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ScrollSection, ScrollItem } from "./ScrollSection";
import { evomediaContent } from "@/lib/evomedia-content";

const c = evomediaContent.faq;

export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(0);

  return (
    <ScrollSection id="faq" className="py-20 md:py-28 bg-[#0d0d12]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollItem className="text-center mb-16">
          <p className="text-[#ffb800] font-semibold tracking-widest uppercase text-sm mb-2">
            {c.label}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {c.title} <span className="evomedia-gradient-text">{c.titleHighlight}</span>
          </h2>
        </ScrollItem>

        <div className="space-y-3">
          {c.items.map((item, i) => (
            <ScrollItem key={i}>
              <div
                className="rounded-xl border border-white/5 bg-[#12121a] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(openId === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="font-semibold text-white pr-4">{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-gray-400 transition-transform ${
                      openId === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openId === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 md:px-5 pb-4 md:pb-5 pt-0">
                        <p className="text-gray-400 text-sm md:text-base">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollItem>
          ))}
        </div>
      </div>
    </ScrollSection>
  );
}
