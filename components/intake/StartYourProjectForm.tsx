"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

type FormState = {
  businessName: string;
  industry: string;
  description: string;
  existingDomain: string;
  logoNote: string;
  colours: string;
  inspiration: string;
  pagesNeeded: string;
  existingContent: string;
  photos: string;
  functionality: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
};

const initialState: FormState = {
  businessName: "",
  industry: "",
  description: "",
  existingDomain: "",
  logoNote: "",
  colours: "",
  inspiration: "",
  pagesNeeded: "",
  existingContent: "",
  photos: "",
  functionality: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
};

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

const inputClass =
  "w-full px-4 py-3 rounded-lg bg-[#12121a] border border-white/10 text-white placeholder-gray-500 focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/50 outline-none transition-colors";

type Props = {
  sessionId: string;
};

export default function StartYourProjectForm({ sessionId }: Props) {
  const [form, setForm] = useState<FormState>(initialState);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          sessionId,
          website_url: honeypot || undefined,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 px-6 rounded-2xl bg-[#12121a] border border-[#00d4ff]/30"
      >
        <p className="text-[#00d4ff] font-semibold mb-2">Brief received</p>
        <p className="text-gray-400">
          Thanks — that&apos;s everything we need to get started. We&apos;ll follow up
          shortly to confirm the build and next steps.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-10"
      initial="initial"
      animate="animate"
      variants={{ animate: { transition: { staggerChildren: 0.04 } } }}
    >
      <div className="absolute -left-[9999px] w-1 h-1 overflow-hidden" aria-hidden>
        <label htmlFor="website_url">Leave blank</label>
        <input
          id="website_url"
          name="website_url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <motion.fieldset variants={fadeIn}>
        <legend className="text-lg font-semibold text-white">The basics</legend>
        <div className="mt-4 space-y-4">
          <Field label="Business name">
            <input
              required
              type="text"
              value={form.businessName}
              onChange={(e) => update("businessName", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Industry">
            <input
              required
              type="text"
              placeholder="e.g. bridal boutique, restaurant, holiday home"
              value={form.industry}
              onChange={(e) => update("industry", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="What do you do, in a line or two?">
            <textarea
              required
              rows={2}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </Field>
          <Field label="Existing domain, if you have one" required={false}>
            <input
              type="text"
              placeholder="yourbusiness.ie"
              value={form.existingDomain}
              onChange={(e) => update("existingDomain", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      </motion.fieldset>

      <motion.fieldset variants={fadeIn}>
        <legend className="text-lg font-semibold text-white">Branding</legend>
        <div className="mt-4 space-y-4">
          <Field label="Do you have a logo already?" required={false}>
            <input
              type="text"
              placeholder="e.g. yes, I'll send it over / no, need one designed"
              value={form.logoNote}
              onChange={(e) => update("logoNote", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Any colours you'd like used" required={false}>
            <input
              type="text"
              placeholder="e.g. navy and gold, or none — open to suggestions"
              value={form.colours}
              onChange={(e) => update("colours", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Any site you like the look of" required={false}>
            <input
              type="text"
              placeholder="a link, or a business name we can look up"
              value={form.inspiration}
              onChange={(e) => update("inspiration", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      </motion.fieldset>

      <motion.fieldset variants={fadeIn}>
        <legend className="text-lg font-semibold text-white">Content</legend>
        <div className="mt-4 space-y-4">
          <Field label="What pages do you need?">
            <textarea
              required
              rows={2}
              placeholder="e.g. home, about, menu, contact"
              value={form.pagesNeeded}
              onChange={(e) => update("pagesNeeded", e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </Field>
          <Field label="Existing text you'd like reused" required={false}>
            <textarea
              rows={2}
              placeholder="paste it here, or let us know if you'd like it written for you"
              value={form.existingContent}
              onChange={(e) => update("existingContent", e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </Field>
          <Field label="Photos" required={false}>
            <input
              type="text"
              placeholder="e.g. I have my own / I'll need some sourced"
              value={form.photos}
              onChange={(e) => update("photos", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      </motion.fieldset>

      <motion.fieldset variants={fadeIn}>
        <legend className="text-lg font-semibold text-white">
          Functionality and contact
        </legend>
        <div className="mt-4 space-y-4">
          <Field label="Anything beyond a standard site?" required={false}>
            <textarea
              rows={2}
              placeholder="e.g. bookings, an online menu, a small shop"
              value={form.functionality}
              onChange={(e) => update("functionality", e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </Field>
          <Field label="Your name">
            <input
              required
              type="text"
              value={form.contactName}
              onChange={(e) => update("contactName", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Email">
            <input
              required
              type="email"
              value={form.contactEmail}
              onChange={(e) => update("contactEmail", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Phone" required={false}>
            <input
              type="tel"
              value={form.contactPhone}
              onChange={(e) => update("contactPhone", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      </motion.fieldset>

      {status === "error" && (
        <p className="text-red-400 text-sm" role="alert">
          Something went wrong sending that. Mind trying again, or emailing us
          directly?
        </p>
      )}

      <motion.div variants={fadeIn}>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full sm:w-auto px-8 py-4 rounded-lg font-semibold bg-gradient-to-r from-[#00d4ff] to-[#00a8cc] text-[#0a0a0f] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "Sending…" : "Send brief"}
          {status !== "submitting" && <Send className="w-4 h-4" />}
        </button>
      </motion.div>
    </motion.form>
  );
}

function Field({
  label,
  required = true,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-400">
        {label}
        {required ? (
          <span className="text-red-400"> *</span>
        ) : (
          <span className="ml-1 font-normal text-gray-500">(optional)</span>
        )}
      </span>
      {children}
    </label>
  );
}
