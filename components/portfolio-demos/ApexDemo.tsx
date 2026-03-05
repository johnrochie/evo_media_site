"use client";

import { Dumbbell, Clock, MapPin } from "lucide-react";

export default function ApexDemo({ accent }: { accent: string }) {
  const classes = [
    { name: "HIIT", time: "6:00 AM", spots: 3 },
    { name: "Yoga", time: "9:00 AM", spots: 8 },
    { name: "Strength", time: "12:00 PM", spots: 5 },
    { name: "Spin", time: "6:00 PM", spots: 2 },
  ];

  return (
    <main className="pt-16">
      <section className="min-h-[70vh] flex items-center justify-center px-4 bg-gradient-to-b from-amber-500/10 to-transparent">
        <div className="text-center max-w-3xl">
          <p
            className="text-sm font-semibold tracking-widest uppercase mb-4"
            style={{ color: accent }}
          >
            Your local gym
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Train harder.
            <span
              className="block"
              style={{
                background: `linear-gradient(135deg, ${accent}, #f59e0b)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Feel stronger.
            </span>
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Classes, equipment, and a community that pushes you. Book your first
            session free.
          </p>
          <button
            className="px-8 py-4 rounded-lg font-semibold text-[#0a0a0f] transition-opacity hover:opacity-90"
            style={{ backgroundColor: accent }}
          >
            Book a class
          </button>
        </div>
      </section>
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <span className="flex items-center gap-2 text-gray-400">
              <Dumbbell className="w-5 h-5" style={{ color: accent }} />
              20+ classes/week
            </span>
            <span className="flex items-center gap-2 text-gray-400">
              <MapPin className="w-5 h-5" style={{ color: accent }} />
              City centre
            </span>
            <span className="flex items-center gap-2 text-gray-400">
              <Clock className="w-5 h-5" style={{ color: accent }} />
              Open 6am–10pm
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-6">Today&apos;s classes</h2>
          <div className="space-y-3">
            {classes.map((c) => (
              <div
                key={c.name}
                className="flex items-center justify-between p-4 rounded-xl bg-[#12121a] border border-white/5 hover:border-amber-500/20 transition-colors"
              >
                <div>
                  <h3 className="font-bold text-white">{c.name}</h3>
                  <p className="text-sm text-gray-500">{c.time}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-400">{c.spots} spots left</span>
                  <button
                    className="block mt-1 text-sm font-medium"
                    style={{ color: accent }}
                  >
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
