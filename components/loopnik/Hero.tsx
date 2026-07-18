"use client";

import { motion } from "framer-motion";
import OrbitScene from "./OrbitScene";
import StoreButtons from "./StoreButtons";
import { site } from "@/lib/loopnik-site";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16"
    >
      <OrbitScene />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-4 pb-16 pt-4 text-center sm:px-6 lg:px-8">
        <motion.h1
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-display text-[clamp(3.75rem,14vw,7.5rem)] font-black leading-[0.85] tracking-tight"
        >
          <span className="block text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.85)]">
            LOOP
          </span>
          <span className="mt-[-0.08em] block text-[var(--loopnik-accent)] drop-shadow-[0_0_48px_rgba(46,199,250,0.55)]">
            NIK
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mt-5 font-display text-base font-bold tracking-wide text-[var(--loopnik-gold)] sm:text-lg"
        >
          {site.tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-2 max-w-md text-sm text-[var(--loopnik-muted)] sm:text-base"
        >
          {site.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="mt-7"
        >
          <StoreButtons />
        </motion.div>
      </div>
    </section>
  );
}
