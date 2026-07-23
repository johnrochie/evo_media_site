"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import EvomediaNav from "@/components/evomedia/EvomediaNav";
import StartYourProjectForm from "@/components/intake/StartYourProjectForm";
import StartProjectButton from "@/components/evomedia/StartProjectButton";
import FooterSection from "@/components/evomedia/FooterSection";
import Link from "next/link";

export default function StartYourProjectPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <EvomediaNav />
      <main
        id="main-content"
        tabIndex={-1}
        className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 outline-none"
      >
        <Suspense
          fallback={
            <p className="text-center text-gray-400 py-24">Loading…</p>
          }
        >
          <PaidIntakeGate />
        </Suspense>
        <p className="text-center text-gray-500 text-sm mt-8">
          <Link href="/" className="text-[#00d4ff] hover:underline">
            ← Back to home
          </Link>
        </p>
      </main>
      <FooterSection />
    </div>
  );
}

function PaidIntakeGate() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [access, setAccess] = useState<"checking" | "granted" | "denied">(
    sessionId ? "checking" : "denied"
  );

  useEffect(() => {
    if (!sessionId) {
      setAccess("denied");
      return;
    }
    fetch(`/api/verify-session?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then((data) => setAccess(data.paid ? "granted" : "denied"))
      .catch(() => setAccess("denied"));
  }, [sessionId]);

  if (access === "checking") {
    return (
      <div className="text-center py-24">
        <p className="text-gray-400">Confirming your payment…</p>
      </div>
    );
  }

  if (access === "denied") {
    return (
      <div className="text-center py-16">
        <p className="text-[#00d4ff] font-semibold tracking-widest uppercase text-sm mb-2">
          Deposit required
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          This link isn&apos;t valid
        </h1>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          This page only unlocks after a project deposit. If you&apos;ve just paid
          and landed here by mistake, check the email confirmation from Stripe, or
          start checkout again below.
        </p>
        <StartProjectButton />
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-12">
        <p className="text-[#00d4ff] font-semibold tracking-widest uppercase text-sm mb-2">
          EvoMedia
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Tell us about your{" "}
          <span className="evomedia-gradient-text">project</span>
        </h1>
        <p className="text-gray-400">
          Deposit received — a few details up front means we can get straight into
          building. Ten minutes, roughly.
        </p>
      </div>
      <div className="rounded-2xl bg-[#0d0d12] border border-white/5 p-6 md:p-8">
        <StartYourProjectForm sessionId={sessionId!} />
      </div>
    </>
  );
}
