"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { submitIntakeStage1, type Stage1Payload } from "@/app/actions/submit-intake-stage1";

const SITE_PURPOSE_OPTIONS = [
  "Get enquiries",
  "Showcase work",
  "Sell products",
  "Just look credible",
];
const HAS_LOGO_OPTIONS = ["Yes", "No — I'll need one"];
const CONTENT_READINESS_OPTIONS = ["Ready to go", "Mostly ready", "Starting from scratch"];

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function InterestForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasCurrentWebsite, setHasCurrentWebsite] = useState(true);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setErrors({});

    const form = e.currentTarget;
    const fd = new FormData(form);
    const fullName = (fd.get("fullName") as string)?.trim();
    const businessName = (fd.get("businessName") as string)?.trim();
    const sitePurpose = fd.get("sitePurpose") as string;
    const hasLogo = fd.get("hasLogo") as string;
    const contentReadiness = fd.get("contentReadiness") as string;

    const newErrors: Record<string, string> = {};
    if (!fullName) newErrors.fullName = "Required";
    if (!businessName) newErrors.businessName = "Required";
    if (!sitePurpose) newErrors.sitePurpose = "Please select an option";
    if (!hasLogo) newErrors.hasLogo = "Please select an option";
    if (!contentReadiness) newErrors.contentReadiness = "Please select an option";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    const payload: Stage1Payload & { website_url?: string } = {
      fullName,
      businessName,
      industry: (fd.get("industry") as string)?.trim() ?? "",
      currentWebsiteUrl: (fd.get("currentWebsiteUrl") as string)?.trim() ?? "",
      hasCurrentWebsite,
      sitePurpose,
      hasLogo,
      contentReadiness,
      anythingElse: (fd.get("anythingElse") as string)?.trim() ?? "",
      website_url: (fd.get("website_url") as string) || undefined,
    };

    const result = await submitIntakeStage1(payload);
    setLoading(false);

    if (result.ok) {
      setSubmitted(true);
      form.reset();
      setHasCurrentWebsite(true);
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
        <p className="text-[#00d4ff] font-semibold mb-2">Thanks — we&apos;ll review your details</p>
        <p className="text-gray-400">
          We&apos;ll be in touch within 24 hours about next steps.
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
        <label htmlFor="website_url">Leave blank</label>
        <input id="website_url" name="website_url" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {error && (
        <p className="text-red-400 text-sm" role="alert">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <motion.div variants={fadeIn}>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-400 mb-2">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            className={`w-full px-4 py-3 rounded-lg bg-[#12121a] border text-white placeholder-gray-500 focus:ring-1 outline-none transition-colors ${
              errors.fullName ? "border-red-500" : "border-white/10 focus:border-[#00d4ff]/50 focus:ring-[#00d4ff]/50"
            }`}
            placeholder="Your name"
          />
          {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
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
        <label htmlFor="industry" className="block text-sm font-medium text-gray-400 mb-2">
          Industry / what do you do?
        </label>
        <input
          id="industry"
          name="industry"
          type="text"
          className="w-full px-4 py-3 rounded-lg bg-[#12121a] border border-white/10 text-white placeholder-gray-500 focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/50 outline-none transition-colors"
          placeholder="e.g. Hair salon, Tech startup"
        />
      </motion.div>

      <motion.div variants={fadeIn}>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
          <input
            type="checkbox"
            checked={!hasCurrentWebsite}
            onChange={(e) => setHasCurrentWebsite(!e.target.checked)}
            className="rounded border-white/20 bg-[#12121a] text-[#00d4ff] focus:ring-[#00d4ff]/50"
          />
          I don&apos;t have a website
        </label>
        <input
          id="currentWebsiteUrl"
          name="currentWebsiteUrl"
          type="url"
          disabled={!hasCurrentWebsite}
          placeholder="https://"
          className={`w-full px-4 py-3 rounded-lg bg-[#12121a] border border-white/10 text-white placeholder-gray-500 focus:ring-1 outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            hasCurrentWebsite ? "focus:border-[#00d4ff]/50 focus:ring-[#00d4ff]/50" : ""
          }`}
        />
      </motion.div>

      <motion.div variants={fadeIn}>
        <label htmlFor="sitePurpose" className="block text-sm font-medium text-gray-400 mb-2">
          What do you mainly need the site to do? <span className="text-red-400">*</span>
        </label>
        <select
          id="sitePurpose"
          name="sitePurpose"
          required
          className={`w-full px-4 py-3 rounded-lg bg-[#12121a] border text-white focus:ring-1 outline-none transition-colors [&>option]:bg-[#12121a] ${
            errors.sitePurpose ? "border-red-500" : "border-white/10 focus:border-[#00d4ff]/50 focus:ring-[#00d4ff]/50"
          }`}
        >
          <option value="">Select one</option>
          {SITE_PURPOSE_OPTIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        {errors.sitePurpose && <p className="text-red-400 text-xs mt-1">{errors.sitePurpose}</p>}
      </motion.div>

      <motion.div variants={fadeIn}>
        <label htmlFor="hasLogo" className="block text-sm font-medium text-gray-400 mb-2">
          Do you have a logo? <span className="text-red-400">*</span>
        </label>
        <select
          id="hasLogo"
          name="hasLogo"
          required
          className={`w-full px-4 py-3 rounded-lg bg-[#12121a] border text-white focus:ring-1 outline-none transition-colors [&>option]:bg-[#12121a] ${
            errors.hasLogo ? "border-red-500" : "border-white/10 focus:border-[#00d4ff]/50 focus:ring-[#00d4ff]/50"
          }`}
        >
          <option value="">Select one</option>
          {HAS_LOGO_OPTIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        {errors.hasLogo && <p className="text-red-400 text-xs mt-1">{errors.hasLogo}</p>}
      </motion.div>

      <motion.div variants={fadeIn}>
        <label htmlFor="contentReadiness" className="block text-sm font-medium text-gray-400 mb-2">
          Content readiness <span className="text-red-400">*</span>
        </label>
        <select
          id="contentReadiness"
          name="contentReadiness"
          required
          className={`w-full px-4 py-3 rounded-lg bg-[#12121a] border text-white focus:ring-1 outline-none transition-colors [&>option]:bg-[#12121a] ${
            errors.contentReadiness ? "border-red-500" : "border-white/10 focus:border-[#00d4ff]/50 focus:ring-[#00d4ff]/50"
          }`}
        >
          <option value="">Select one</option>
          {CONTENT_READINESS_OPTIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        {errors.contentReadiness && <p className="text-red-400 text-xs mt-1">{errors.contentReadiness}</p>}
      </motion.div>

      <motion.div variants={fadeIn}>
        <label htmlFor="anythingElse" className="block text-sm font-medium text-gray-400 mb-2">
          Anything else we should know?
        </label>
        <textarea
          id="anythingElse"
          name="anythingElse"
          rows={4}
          className="w-full px-4 py-3 rounded-lg bg-[#12121a] border border-white/10 text-white placeholder-gray-500 focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/50 outline-none transition-colors resize-none"
          placeholder="Optional..."
        />
      </motion.div>

      <motion.div variants={fadeIn}>
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-8 py-4 rounded-lg font-semibold bg-gradient-to-r from-[#00d4ff] to-[#00a8cc] text-[#0a0a0f] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Sending…" : "Submit"}
          {!loading && <Send className="w-4 h-4" />}
        </button>
      </motion.div>
    </motion.form>
  );
}
