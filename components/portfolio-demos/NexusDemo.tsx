"use client";

import { Shield, Zap, BarChart3 } from "lucide-react";

export default function NexusDemo({ accent }: { accent: string }) {
  return (
    <main className="pt-16">
      <section className="min-h-[80vh] flex items-center justify-center px-4 bg-gradient-to-b from-cyan-500/10 to-transparent">
        <div className="text-center max-w-3xl">
          <p
            className="text-sm font-semibold tracking-widest uppercase mb-4"
            style={{ color: accent }}
          >
            Smart money for startups
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Banking that
            <span
              className="block"
              style={{
                background: `linear-gradient(135deg, ${accent}, #0891b2)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              scales with you
            </span>
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Open accounts, manage treasury, and move money—all in one place.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              className="px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: accent }}
            >
              Get started
            </button>
            <button className="px-6 py-3 rounded-lg font-medium border border-white/20 text-gray-300 hover:border-white/40 transition-colors">
              Book a demo
            </button>
          </div>
        </div>
      </section>
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { icon: Shield, title: "Bank-grade security", desc: "256-bit encryption and SOC 2 compliance." },
            { icon: Zap, title: "Instant setup", desc: "Open an account in minutes, not weeks." },
            { icon: BarChart3, title: "Real-time analytics", desc: "Track cash flow and forecast with clarity." },
          ].map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-xl bg-[#12121a] border border-white/5"
            >
              <item.icon className="w-10 h-10 mb-4" style={{ color: accent }} />
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
