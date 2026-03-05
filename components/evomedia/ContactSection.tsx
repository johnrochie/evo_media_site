"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { ScrollSection, ScrollItem } from "./ScrollSection";
import { evomediaContent } from "@/lib/evomedia-content";
import { sendContactEmail } from "@/app/actions/send-contact";

const c = evomediaContent.contact;

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const result = await sendContactEmail(formData);

      if (result.ok) {
        setSubmitted(true);
        form.reset();
      } else {
        setError(result.error ?? "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Failed to send. Please try again or check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollSection id="contact" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <ScrollItem className="text-center mb-12">
            <p className="text-[#00d4ff] font-semibold tracking-widest uppercase text-sm mb-2">
              {c.label}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              {c.title} <span className="evomedia-gradient-text">{c.titleHighlight}</span>
            </h2>
            <p className="text-gray-400 mb-2">
              {c.subtitle}
            </p>
            <p className="text-[#00d4ff] text-sm font-medium">
              {c.promise}
            </p>
          </ScrollItem>

          <ScrollItem>
            {error && (
              <p className="text-red-400 text-sm mb-6">
                {error}
              </p>
            )}
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 px-6 rounded-2xl bg-[#12121a] border border-[#00d4ff]/30"
              >
                <p className="text-[#00d4ff] font-semibold mb-2">{c.submitSuccess}</p>
                <p className="text-gray-400">
                  {c.submitMessage}
                </p>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {/* Honeypot - hidden from users, bots fill it */}
                <div className="absolute -left-[9999px] w-1 h-1 overflow-hidden" aria-hidden="true">
                  <label htmlFor="website_url">Website URL</label>
                  <input
                    id="website_url"
                    name="website_url"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-[#12121a] border border-white/10 text-white placeholder-gray-500 focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/50 outline-none transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-[#12121a] border border-white/10 text-white placeholder-gray-500 focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/50 outline-none transition-colors"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="website-type" className="block text-sm font-medium text-gray-400 mb-2">
                    Website type
                  </label>
                  <select
                    id="website-type"
                    name="websiteType"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-[#12121a] border border-white/10 text-white focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/50 outline-none transition-colors [&>option]:bg-[#12121a]"
                  >
                    <option value="">Select type</option>
                    {c.websiteTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-400 mb-2">
                    Budget range
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-[#12121a] border border-white/10 text-white focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/50 outline-none transition-colors [&>option]:bg-[#12121a]"
                  >
                    <option value="">Select range</option>
                    {c.budgetRanges.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-[#12121a] border border-white/10 text-white placeholder-gray-500 focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/50 outline-none transition-colors resize-none"
                    placeholder="Tell us about your project and goals..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-4 rounded-lg font-semibold bg-gradient-to-r from-[#00d4ff] to-[#00a8cc] text-[#0a0a0f] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending…" : "Send message"}
                  {!loading && <Send className="w-4 h-4" />}
                </button>
              </motion.form>
            )}
          </ScrollItem>
        </div>
      </div>
    </ScrollSection>
  );
}
