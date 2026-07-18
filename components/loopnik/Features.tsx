"use client";

import { motion } from "framer-motion";
import { features } from "@/lib/loopnik-site";

export default function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="mb-3 font-display text-sm font-bold uppercase tracking-[0.2em] text-[var(--loopnik-gold)]">
            Features
          </p>
          <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
            Sessions take seconds.
            <br />
            <span className="text-[var(--loopnik-muted)]">
              Beating your best takes forever.
            </span>
          </h2>
        </div>

        <ul className="divide-y divide-white/10 border-y border-white/10">
          {features.map((feature, i) => (
            <motion.li
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="grid gap-2 py-7 sm:grid-cols-[minmax(140px,200px)_1fr] sm:items-baseline sm:gap-8"
            >
              <h3
                className="font-display text-lg font-black tracking-tight"
                style={{ color: feature.accent }}
              >
                {feature.title}
              </h3>
              <p className="text-[var(--loopnik-muted)] sm:text-lg">
                {feature.body}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
