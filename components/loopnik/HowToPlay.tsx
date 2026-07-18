"use client";

import { motion } from "framer-motion";

export default function HowToPlay() {
  return (
    <section id="play" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          className="mb-3 font-display text-sm font-bold uppercase tracking-[0.2em] text-[var(--loopnik-accent)]"
        >
          How to play
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="font-display text-3xl font-black tracking-tight sm:text-4xl md:text-5xl"
        >
          Tap to reverse.
          <br />
          <span className="text-[var(--loopnik-hazard)]">Dodge the spikes.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mx-auto mt-6 max-w-xl text-lg text-[var(--loopnik-muted)]"
        >
          You&apos;re a little satellite locked in orbit. Tap anywhere to reverse
          direction. That&apos;s it — that&apos;s the whole game. Sound easy? The
          spikes disagree.
        </motion.p>
      </div>
    </section>
  );
}
