"use client";

import { Mail } from "lucide-react";
import { decodeEmail, maskEmail } from "@/lib/obfuscate-email";

export default function ObfuscatedEmail({
  encoded,
  className = "",
}: {
  encoded: string;
  className?: string;
}) {
  const masked = maskEmail(encoded);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    window.location.href = `mailto:${decodeEmail(encoded)}`;
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 text-[#00d4ff] hover:underline font-medium transition-colors ${className}`}
    >
      <Mail className="w-4 h-4 shrink-0 opacity-80" aria-hidden />
      <span>{masked}</span>
    </button>
  );
}
