"use client";

import { UtensilsCrossed, Clock, MapPin } from "lucide-react";

const menu = [
  { name: "Grilled octopus", price: "€14", desc: "Chorizo, lemon, olive oil" },
  { name: "Lamb shoulder", price: "€28", desc: "Slow-cooked, rosemary, jus" },
  { name: "Tiramisu", price: "€9", desc: "House-made, espresso-soaked" },
];

export default function EmberDemo({ accent }: { accent: string }) {
  return (
    <main className="pt-16">
      <section className="min-h-[60vh] flex items-center justify-center px-4 bg-gradient-to-b from-orange-600/10 to-transparent">
        <div className="text-center max-w-3xl">
          <p
            className="text-sm font-semibold tracking-widest uppercase mb-4"
            style={{ color: accent }}
          >
            Farm-to-table dining
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ember
            <span
              className="block"
              style={{
                background: `linear-gradient(135deg, ${accent}, #ea580c)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Kitchen
            </span>
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Seasonal ingredients. Open fire. A place to gather.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-gray-400 text-sm">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: accent }} />
              Tue–Sun, 5pm–11pm
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" style={{ color: accent }} />
              12 Oak Street
            </span>
          </div>
          <button
            className="mt-8 px-8 py-4 rounded-lg font-semibold text-[#0a0a0f] transition-opacity hover:opacity-90"
            style={{ backgroundColor: accent }}
          >
            Book a table
          </button>
        </div>
      </section>
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-12">
            <UtensilsCrossed className="w-8 h-8" style={{ color: accent }} />
            <h2 className="text-2xl font-bold text-white">Sample menu</h2>
          </div>
          <div className="space-y-6">
            {menu.map((item) => (
              <div
                key={item.name}
                className="flex justify-between items-start py-4 border-b border-white/5"
              >
                <div>
                  <h3 className="font-bold text-white">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
                <span
                  className="font-semibold"
                  style={{ color: accent }}
                >
                  {item.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
