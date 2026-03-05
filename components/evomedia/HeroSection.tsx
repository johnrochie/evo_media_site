"use client";

import { motion } from "framer-motion";
import { evomediaContent } from "@/lib/evomedia-content";

const c = evomediaContent.hero;

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Animated gradient / strong visual */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00d4ff]/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#ff00aa]/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#ffb800]/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: "0.5s" }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight mb-6"
        >
          <span className="text-white">{c.headline1}</span>
          <br />
          <span className="evomedia-gradient-text">{c.headline2}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10"
        >
          {c.subheadline}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <a
            href="#portfolio"
            className="px-8 py-4 rounded-lg font-semibold border border-[#00d4ff]/50 text-[#00d4ff] hover:bg-[#00d4ff]/10 transition-colors"
          >
            {c.ctaWork}
          </a>
          <a
            href="#contact"
            className="px-8 py-4 rounded-lg font-semibold bg-gradient-to-r from-[#00d4ff] to-[#00a8cc] text-[#0a0a0f] hover:opacity-90 transition-opacity"
          >
            {c.ctaQuote}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
