"use client";

export default function LunaDemo({ accent }: { accent: string }) {
  const products = [
    { name: "Glow Serum", price: "€42", tag: "Bestseller" },
    { name: "Night Cream", price: "€38", tag: "New" },
    { name: "Lip Balm Set", price: "€24", tag: null },
  ];

  return (
    <main className="pt-16">
      <section className="min-h-[70vh] flex items-center px-4 md:px-12">
        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p
              className="text-sm font-semibold tracking-widest uppercase mb-4"
              style={{ color: accent }}
            >
              Clean beauty
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Skin care that
              <span
                className="block"
                style={{
                  background: `linear-gradient(135deg, ${accent}, #ec4899)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                feels like you
              </span>
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Vegan, cruelty-free, and made with care. Discover our bestsellers.
            </p>
            <button
              className="px-8 py-4 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: accent }}
            >
              Shop now
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-600/20 border border-white/5"
              />
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 px-4">
        <h2 className="text-2xl font-bold text-white text-center mb-12">
          Bestsellers
        </h2>
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.name}
              className="group rounded-2xl bg-[#12121a] border border-white/5 overflow-hidden hover:border-pink-500/30 transition-colors"
            >
              <div className="aspect-square bg-gradient-to-br from-pink-500/10 to-rose-600/10" />
              <div className="p-4">
                {p.tag && (
                  <span
                    className="text-xs font-semibold uppercase"
                    style={{ color: accent }}
                  >
                    {p.tag}
                  </span>
                )}
                <h3 className="text-lg font-bold text-white mt-1">{p.name}</h3>
                <p className="text-gray-400">{p.price}</p>
                <button
                  className="mt-3 w-full py-2 rounded-lg text-sm font-medium border transition-colors"
                  style={{
                    borderColor: accent,
                    color: accent,
                  }}
                >
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
