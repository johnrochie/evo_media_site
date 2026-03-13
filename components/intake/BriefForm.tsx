"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { submitIntakeStage2, type Stage2Payload } from "@/app/actions/submit-intake-stage2";

const SECTIONS_OPTIONS = [
  "Hero",
  "About",
  "Services",
  "Gallery",
  "Testimonials",
  "Contact",
  "Other",
];
const FUNCTIONALITY_OPTIONS = [
  "Contact form",
  "Booking link",
  "Social links",
  "WhatsApp button",
  "Embedded map",
];
const DOMAIN_OPTIONS = [
  "Yes — I'll provide it",
  "No — I need one",
];

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function BriefForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sections, setSections] = useState<string[]>([]);
  const [functionality, setFunctionality] = useState<string[]>([]);

  function toggleSection(s: string) {
    setSections((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }
  function toggleFunctionality(s: string) {
    setFunctionality((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setErrors({});

    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = (fd.get("name") as string)?.trim();
    const businessName = (fd.get("businessName") as string)?.trim();
    const domainStatus = fd.get("domainStatus") as string;
    const contactEmail = (fd.get("contactEmail") as string)?.trim();

    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = "Required";
    if (!businessName) newErrors.businessName = "Required";
    if (!domainStatus) newErrors.domainStatus = "Please select an option";
    if (!contactEmail) newErrors.contactEmail = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      newErrors.contactEmail = "Invalid email address";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    const payload: Stage2Payload & { website_url?: string } = {
      name,
      businessName,
      brandColours: (fd.get("brandColours") as string)?.trim() ?? "",
      websiteLike1: (fd.get("websiteLike1") as string)?.trim() ?? "",
      websiteLike2: (fd.get("websiteLike2") as string)?.trim() ?? "",
      websiteLike3: (fd.get("websiteLike3") as string)?.trim() ?? "",
      sectionsNeeded: sections,
      keyCompetitors: (fd.get("keyCompetitors") as string)?.trim() ?? "",
      whatMakesDifferent: (fd.get("whatMakesDifferent") as string)?.trim() ?? "",
      functionalityNeeded: functionality,
      domainStatus,
      contactEmail,
      website_url: (fd.get("website_url") as string) || undefined,
    };

    const result = await submitIntakeStage2(payload);
    setLoading(false);

    if (result.ok) {
      setSubmitted(true);
      form.reset();
      setSections([]);
      setFunctionality([]);
    } else {
      setError(result.error ?? "Something went wrong. Please try again.");
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 px-6 rounded-2xl bg-[#12121a] border border-[#00d4ff]/30"
      >
        <p className="text-[#00d4ff] font-semibold mb-2">Brief received</p>
        <p className="text-gray-400">
          We&apos;ll be in touch shortly to confirm your build start date.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial="initial"
      animate="animate"
      variants={{ animate: { transition: { staggerChildren: 0.05 } } }}
    >
      <div className="absolute -left-[9999px] w-1 h-1 overflow-hidden" aria-hidden>
        <label htmlFor="brief_website_url">Leave blank</label>
        <input id="brief_website_url" name="website_url" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {error && (
        <p className="text-red-400 text-sm" role="alert">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <motion.div variants={fadeIn}>
          <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
            Name <span className="text-red-400">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className={`w-full px-4 py-3 rounded-lg bg-[#12121a] border text-white placeholder-gray-500 focus:ring-1 outline-none transition-colors ${
              errors.name ? "border-red-500" : "border-white/10 focus:border-[#00d4ff]/50 focus:ring-[#00d4ff]/50"
            }`}
            placeholder="Your name"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </motion.div>
        <motion.div variants={fadeIn}>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-400 mb-2">
            Business Name <span className="text-red-400">*</span>
          </label>
          <input
            id="businessName"
            name="businessName"
            type="text"
            required
            className={`w-full px-4 py-3 rounded-lg bg-[#12121a] border text-white placeholder-gray-500 focus:ring-1 outline-none transition-colors ${
              errors.businessName ? "border-red-500" : "border-white/10 focus:border-[#00d4ff]/50 focus:ring-[#00d4ff]/50"
            }`}
            placeholder="Your business"
          />
          {errors.businessName && <p className="text-red-400 text-xs mt-1">{errors.businessName}</p>}
        </motion.div>
      </div>

      <motion.div variants={fadeIn}>
        <label htmlFor="brandColours" className="block text-sm font-medium text-gray-400 mb-2">
          Brand colours — hex codes or describe the vibe
        </label>
        <textarea
          id="brandColours"
          name="brandColours"
          rows={3}
          className="w-full px-4 py-3 rounded-lg bg-[#12121a] border border-white/10 text-white placeholder-gray-500 focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/50 outline-none transition-colors resize-none"
          placeholder="e.g. #00d4ff, #ff00aa or 'clean, minimal, blue tones'"
        />
      </motion.div>

      <motion.div variants={fadeIn}>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          2–3 websites you like
        </label>
        <div className="space-y-3">
          <input
            name="websiteLike1"
            type="url"
            placeholder="https://"
            className="w-full px-4 py-3 rounded-lg bg-[#12121a] border border-white/10 text-white placeholder-gray-500 focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/50 outline-none transition-colors"
          />
          <input
            name="websiteLike2"
            type="url"
            placeholder="https://"
            className="w-full px-4 py-3 rounded-lg bg-[#12121a] border border-white/10 text-white placeholder-gray-500 focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/50 outline-none transition-colors"
          />
          <input
            name="websiteLike3"
            type="url"
            placeholder="https://"
            className="w-full px-4 py-3 rounded-lg bg-[#12121a] border border-white/10 text-white placeholder-gray-500 focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/50 outline-none transition-colors"
          />
        </div>
      </motion.div>

      <motion.div variants={fadeIn}>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Sections needed
        </label>
        <div className="flex flex-wrap gap-2">
          {SECTIONS_OPTIONS.map((s) => (
            <label
              key={s}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#12121a] border border-white/10 cursor-pointer hover:border-[#00d4ff]/30 transition-colors"
            >
              <input
                type="checkbox"
                checked={sections.includes(s)}
                onChange={() => toggleSection(s)}
                className="rounded border-white/20 bg-[#0a0a0f] text-[#00d4ff] focus:ring-[#00d4ff]/50"
              />
              <span className="text-sm text-gray-300">{s}</span>
            </label>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeIn}>
        <label htmlFor="keyCompetitors" className="block text-sm font-medium text-gray-400 mb-2">
          Key competitors
        </label>
        <input
          id="keyCompetitors"
          name="keyCompetitors"
          type="text"
          className="w-full px-4 py-3 rounded-lg bg-[#12121a] border border-white/10 text-white placeholder-gray-500 focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/50 outline-none transition-colors"
          placeholder="Short description"
        />
      </motion.div>

      <motion.div variants={fadeIn}>
        <label htmlFor="whatMakesDifferent" className="block text-sm font-medium text-gray-400 mb-2">
          What makes your business different — one or two sentences
        </label>
        <textarea
          id="whatMakesDifferent"
          name="whatMakesDifferent"
          rows={3}
          className="w-full px-4 py-3 rounded-lg bg-[#12121a] border border-white/10 text-white placeholder-gray-500 focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/50 outline-none transition-colors resize-none"
          placeholder="Your unique selling points..."
        />
      </motion.div>

      <motion.div variants={fadeIn}>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Specific functionality needed
        </label>
        <div className="flex flex-wrap gap-2">
          {FUNCTIONALITY_OPTIONS.map((s) => (
            <label
              key={s}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#12121a] border border-white/10 cursor-pointer hover:border-[#00d4ff]/30 transition-colors"
            >
              <input
                type="checkbox"
                checked={functionality.includes(s)}
                onChange={() => toggleFunctionality(s)}
                className="rounded border-white/20 bg-[#0a0a0f] text-[#00d4ff] focus:ring-[#00d4ff]/50"
              />
              <span className="text-sm text-gray-300">{s}</span>
            </label>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeIn}>
        <label htmlFor="domainStatus" className="block text-sm font-medium text-gray-400 mb-2">
          Domain — do you have one? <span className="text-red-400">*</span>
        </label>
        <select
          id="domainStatus"
          name="domainStatus"
          required
          className={`w-full px-4 py-3 rounded-lg bg-[#12121a] border text-white focus:ring-1 outline-none transition-colors [&>option]:bg-[#12121a] ${
            errors.domainStatus ? "border-red-500" : "border-white/10 focus:border-[#00d4ff]/50 focus:ring-[#00d4ff]/50"
          }`}
        >
          <option value="">Select one</option>
          {DOMAIN_OPTIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        {errors.domainStatus && <p className="text-red-400 text-xs mt-1">{errors.domainStatus}</p>}
      </motion.div>

      <motion.div variants={fadeIn}>
        <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-400 mb-2">
          Email address for contact form enquiries <span className="text-red-400">*</span>
        </label>
        <input
          id="contactEmail"
          name="contactEmail"
          type="email"
          required
          className={`w-full px-4 py-3 rounded-lg bg-[#12121a] border text-white placeholder-gray-500 focus:ring-1 outline-none transition-colors ${
            errors.contactEmail ? "border-red-500" : "border-white/10 focus:border-[#00d4ff]/50 focus:ring-[#00d4ff]/50"
          }`}
          placeholder="enquiries@yourbusiness.com"
        />
        {errors.contactEmail && <p className="text-red-400 text-xs mt-1">{errors.contactEmail}</p>}
      </motion.div>

      <motion.div variants={fadeIn}>
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-8 py-4 rounded-lg font-semibold bg-gradient-to-r from-[#00d4ff] to-[#00a8cc] text-[#0a0a0f] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Sending…" : "Submit brief"}
          {!loading && <Send className="w-4 h-4" />}
        </button>
      </motion.div>
    </motion.form>
  );
}
