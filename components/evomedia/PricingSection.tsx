"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { ScrollSection, ScrollItem } from "./ScrollSection";
import { evomediaContent } from "@/lib/evomedia-content";
import { createCheckoutSession } from "@/app/actions/create-checkout-session";

const c = evomediaContent.pricing;

export default function PricingSection() {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  async function handleCheckout(tierName: string, amountCents: number) {
    setLoadingTier(tierName);
    const { ok, url, error } = await createCheckoutSession(tierName, amountCents);
    setLoadingTier(null);
    if (ok && url) {
      window.location.href = url;
    } else {
      alert(error ?? "Something went wrong. Please try again or contact us.");
    }
  }

  return (
    <ScrollSection id="pricing" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollItem className="text-center mb-16">
          <p className="text-[#ffb800] font-semibold tracking-widest uppercase text-sm mb-2">
            {c.label}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {c.title} <span className="evomedia-gradient-text">{c.titleHighlight}</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {c.subtitle}
          </p>
        </ScrollItem>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {c.tiers.map((tier, i) => (
            <ScrollItem key={tier.name} delay={i * 0.1}>
              <motion.div
                className={`relative h-full rounded-2xl border p-6 md:p-8 flex flex-col ${
                  tier.highlighted
                    ? "border-[#ff00aa]/50 bg-[#12121a] evomedia-glow-magenta"
                    : "border-white/10 bg-[#0d0d12]"
                }`}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <h3 className="text-xl font-bold text-white mb-0.5">{tier.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{tier.subtitle}</p>
                <div className="mb-6">
                  <span className="text-3xl md:text-4xl font-bold text-white">
                    {tier.price}
                  </span>
                  <span className="text-gray-400 text-sm ml-1">{tier.period}</span>
                </div>
                <ul className="space-y-3 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-gray-300 text-sm">
                      <Check className="w-5 h-5 shrink-0" style={{ color: tier.accent }} />
                      {feature}
                    </li>
                  ))}
                </ul>
                {tier.amountCents != null ? (
                  <button
                    type="button"
                    onClick={() => handleCheckout(tier.name, tier.amountCents!)}
                    disabled={loadingTier !== null}
                    className={`mt-6 w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                      tier.highlighted
                        ? "bg-[#ff00aa] text-white hover:bg-[#ff00aa]/90 disabled:opacity-70"
                        : "border border-white/20 text-white hover:border-[#00d4ff]/50 hover:text-[#00d4ff] disabled:opacity-70"
                    }`}
                  >
                    {loadingTier === tier.name ? (
                      <Loader2 className="w-5 h-5 animate-spin" aria-hidden />
                    ) : (
                      tier.cta
                    )}
                  </button>
                ) : (
                  <a
                    href="#contact"
                    className={`mt-6 block text-center py-3 rounded-lg font-semibold transition-colors ${
                      tier.highlighted
                        ? "bg-[#ff00aa] text-white hover:bg-[#ff00aa]/90"
                        : "border border-white/20 text-white hover:border-[#00d4ff]/50 hover:text-[#00d4ff]"
                    }`}
                  >
                    {tier.cta}
                  </a>
                )}
              </motion.div>
            </ScrollItem>
          ))}
        </div>

        <ScrollItem className="text-center mt-10">
          <p className="text-gray-400 mb-4">{c.customCta}</p>
          <a
            href="#contact"
            className="inline-block px-6 py-3 rounded-lg font-semibold border border-[#00d4ff]/50 text-[#00d4ff] hover:bg-[#00d4ff]/10 transition-colors"
          >
            {c.customCtaButton}
          </a>
        </ScrollItem>
      </div>
    </ScrollSection>
  );
}
