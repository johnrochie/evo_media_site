"use client";

const projects = [
  { title: "Brand Identity", category: "Branding" },
  { title: "App Redesign", category: "Product" },
  { title: "Editorial", category: "Print" },
];

export default function FrameDemo({ accent }: { accent: string }) {
  return (
    <main className="pt-16">
      <section className="min-h-[70vh] flex items-end px-4 md:px-12 pb-20">
        <div className="max-w-6xl w-full">
          <p
            className="text-sm font-semibold tracking-widest uppercase mb-4"
            style={{ color: accent }}
          >
            Design studio
          </p>
          <h1 className="text-5xl md:text-8xl font-bold text-white">
            We make
            <br />
            <span
              style={{
                background: `linear-gradient(135deg, ${accent}, #a855f7)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              stuff that
              <br />
              sticks
            </span>
          </h1>
        </div>
      </section>
      <section className="px-4 md:px-12 pb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {projects.map((p, i) => (
            <div
              key={p.title}
              className="group cursor-pointer"
              style={{ paddingTop: i === 1 ? "4rem" : 0 }}
            >
              <div className="aspect-[4/5] rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-white/5 group-hover:border-violet-500/30 transition-colors mb-4" />
              <span
                className="text-xs font-semibold uppercase"
                style={{ color: accent }}
              >
                {p.category}
              </span>
              <h3 className="text-xl font-bold text-white mt-1">{p.title}</h3>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
