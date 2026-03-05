"use client";

import { Leaf, Recycle, Droplets } from "lucide-react";

export default function VerdantDemo({ accent }: { accent: string }) {
  return (
    <main className="pt-16">
      <section className="min-h-[85vh] flex flex-col items-center justify-center px-4 text-center">
        <p
          className="text-sm font-semibold tracking-widest uppercase mb-4"
          style={{ color: accent }}
        >
          For the planet
        </p>
        <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 max-w-4xl">
          A future where
          <span
            className="block mt-2"
            style={{
              background: `linear-gradient(135deg, ${accent}, #10b981)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            business gives back
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mb-12">
          We fund reforestation and ocean clean-up for every product sold. Join
          the movement.
        </p>
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          {[
            { icon: Leaf, label: "2M+ trees planted" },
            { icon: Recycle, label: "Zero waste packaging" },
            { icon: Droplets, label: "Ocean plastic removed" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 text-gray-300"
            >
              <item.icon className="w-8 h-8" style={{ color: accent }} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <div className="w-full max-w-md">
          <input
            type="email"
            placeholder="Your email"
            className="w-full px-4 py-3 rounded-lg bg-[#12121a] border border-white/10 text-white placeholder-gray-500 focus:border-emerald-500/50 focus:outline-none"
          />
          <button
            className="w-full mt-3 px-6 py-3 rounded-lg font-semibold text-[#0a0a0f] transition-opacity hover:opacity-90"
            style={{ backgroundColor: accent }}
          >
            Join the newsletter
          </button>
        </div>
      </section>
    </main>
  );
}
