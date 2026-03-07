"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import ChatWidget from "@/components/ChatWidget";

const CONSENT_KEY = "evomedia-cookie-consent";

type ConsentState = "pending" | "accepted" | "rejected" | null;

export default function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY) as ConsentState | null;
    setConsent(stored === "accepted" || stored === "rejected" ? stored : "pending");
    setMounted(true);
  }, []);

  function handleAccept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setConsent("accepted");
  }

  function handleReject() {
    localStorage.setItem(CONSENT_KEY, "rejected");
    setConsent("rejected");
  }

  if (!mounted) return null;

  return (
    <>
      {consent === "accepted" && (
        <>
          <Analytics />
          <GoogleAnalytics />
          <ChatWidget />
        </>
      )}
      {consent === "pending" && (
        <div
          role="dialog"
          aria-label="Cookie consent"
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-[#12121a] border-t border-white/10 shadow-[0_-4px_24px_rgba(0,0,0,0.4)]"
        >
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-gray-300 text-sm">
              We use analytics to improve our site. No personal data is sold.{" "}
              <Link
                href="/privacy#cookies"
                className="text-[#00d4ff] hover:underline"
              >
                Learn more
              </Link>
            </p>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleReject}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#00d4ff] text-[#0a0a0f] hover:opacity-90 transition-opacity"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
