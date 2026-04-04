"use client";

import EvomediaNav from "@/components/evomedia/EvomediaNav";
import BriefForm from "@/components/intake/BriefForm";
import FooterSection from "@/components/evomedia/FooterSection";
import Link from "next/link";

export default function BriefPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <EvomediaNav />
      <main id="main-content" tabIndex={-1} className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 outline-none">
        <div className="text-center mb-12">
          <p className="text-[#00d4ff] font-semibold tracking-widest uppercase text-sm mb-2">
            Build brief
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Your <span className="evomedia-gradient-text">build brief</span>
          </h1>
          <p className="text-gray-400">
            Share the details so we can create your perfect site.
          </p>
        </div>
        <div className="rounded-2xl bg-[#0d0d12] border border-white/5 p-6 md:p-8">
          <BriefForm />
        </div>
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
