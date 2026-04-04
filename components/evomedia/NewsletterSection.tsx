"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { ScrollSection, ScrollItem } from "./ScrollSection";
import { evomediaContent } from "@/lib/evomedia-content";
import { subscribeNewsletter } from "@/app/actions/subscribe-newsletter";

const c = evomediaContent.newsletter;

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const result = await subscribeNewsletter(email);

    if (result.ok) {
      setStatus("success");
      setEmail("");
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? c.error);
    }
  }

  return (
    <ScrollSection id="newsletter" className="py-20 md:py-28">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollItem>
          <p className="text-[#00d4ff] font-semibold tracking-widest uppercase text-sm mb-2">
            {c.label}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {c.title}
          </h2>
          <p className="text-gray-400 mb-8">
            {c.subtitle}
          </p>

          {status === "success" ? (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#00d4ff] font-medium"
            >
              {c.success}
            </motion.p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address for newsletter
                </label>
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" aria-hidden />
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={c.placeholder}
                  required
                  disabled={status === "loading"}
                  autoComplete="email"
                  aria-label="Email address for newsletter"
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-[#12121a] border border-white/10 text-white placeholder-gray-500 focus:border-[#00d4ff]/50 focus:outline-none disabled:opacity-60"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-6 py-3 rounded-lg font-semibold bg-[#00d4ff] text-[#0a0a0f] hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "…" : c.button}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="mt-3 text-sm text-red-400">{errorMsg}</p>
          )}
        </ScrollItem>
      </div>
    </ScrollSection>
  );
}
