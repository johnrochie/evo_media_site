"use client";

import { motion } from "framer-motion";
import StoreButtons from "./StoreButtons";

export default function Download() {
  return (
    <section id="download" className="relative py-24 md:py-28">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,rgba(46,199,250,0.12)_0%,rgba(13,15,26,0.9)_45%,rgba(255,209,64,0.08)_100%)] px-6 py-14 sm:px-12"
        >
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--loopnik-accent)]/20 blur-3xl"
            aria-hidden
          />
          <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
            How far can you push your orbit?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[var(--loopnik-muted)]">
            Pure reflexes, no tutorials, no waiting. Free on the App Store —
            Google Play coming soon.
          </p>

          <StoreButtons className="mt-8" />
        </motion.div>
      </div>
    </section>
  );
}
