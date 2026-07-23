"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

type Props = {
  className?: string;
  label?: string;
};

export default function StartProjectButton({
  className,
  label = "Start your project",
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Couldn't start checkout — try again in a moment.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={
        className ??
        "px-8 py-4 rounded-lg font-semibold bg-gradient-to-r from-[#00d4ff] to-[#00a8cc] text-[#0a0a0f] hover:opacity-90 transition-opacity disabled:opacity-70 inline-flex items-center justify-center gap-2"
      }
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" aria-hidden />
          Starting…
        </>
      ) : (
        label
      )}
    </button>
  );
}
