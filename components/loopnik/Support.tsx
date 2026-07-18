"use client";

import { motion } from "framer-motion";
import ObfuscatedEmail from "@/components/evomedia/ObfuscatedEmail";
import { site } from "@/lib/loopnik-site";

export default function Support() {
  return (
    <section id="support" className="relative py-24 md:py-28">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
        >
          <p className="mb-3 font-display text-sm font-bold uppercase tracking-[0.2em] text-[var(--loopnik-accent)]">
            Support
          </p>
          <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
            Need a hand?
          </h2>
          <p className="mt-4 text-[var(--loopnik-muted)]">
            Found a bug, or have a suggestion? Email{" "}
            <ObfuscatedEmail encoded={site.supportEmailEncoded} /> and we&apos;ll
            get back to you.
          </p>
          <p className="mt-6 text-sm leading-relaxed text-[var(--loopnik-muted)]">
            If you bought &quot;Remove Ads&quot; and ads are still showing (for
            example, on a new phone), open Loopnik and tap{" "}
            <strong className="font-semibold text-white">Restore Purchases</strong>{" "}
            on the menu screen.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
