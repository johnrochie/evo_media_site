/** Full-bleed orbital scene matching Loopnik gameplay visuals. */

export default function OrbitScene() {
  const stars = [
    [8, 12],
    [18, 28],
    [72, 18],
    [88, 32],
    [12, 62],
    [28, 78],
    [65, 70],
    [82, 58],
    [45, 22],
    [55, 85],
    [92, 78],
    [38, 48],
    [6, 42],
    [78, 8],
    [48, 6],
    [22, 50],
    [60, 40],
    [85, 48],
  ] as const;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {/* Atmospheric glows — behind brand type */}
      <div className="absolute left-1/2 top-[48%] h-[min(90vw,640px)] w-[min(90vw,640px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(46,199,250,0.16)_0%,transparent_62%)]" />
      <div className="absolute bottom-[8%] right-[6%] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,209,64,0.07)_0%,transparent_70%)]" />
      <div className="absolute left-[8%] top-[22%] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(255,69,89,0.06)_0%,transparent_70%)]" />

      {/* Starfield */}
      {stars.map(([x, y], i) => (
        <span
          key={`${x}-${y}`}
          className="star-drift absolute rounded-full bg-white"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            opacity: 0.22 + (i % 4) * 0.12,
            animationDelay: `${(i % 7) * 0.35}s`,
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
          }}
        />
      ))}

      {/* Orbit as full-bleed atmosphere behind brand type */}
      <div className="absolute left-1/2 top-[52%] h-[min(95vw,620px)] w-[min(95vw,620px)] -translate-x-1/2 -translate-y-1/2 opacity-55 md:opacity-65">
        <div className="absolute inset-[10%] rounded-full border border-white/15" />

        <div className="core-pulse absolute left-1/2 top-1/2 h-[12%] w-[12%] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[var(--loopnik-accent)] bg-white/[0.06] shadow-[0_0_28px_rgba(46,199,250,0.55)]" />

        <div className="orbit-spin absolute inset-[10%]">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-[140%] -translate-y-1/2 rounded-full bg-[var(--loopnik-accent)] opacity-35 blur-[1px]" />
              <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-[220%] -translate-y-1/2 rounded-full bg-[var(--loopnik-accent)] opacity-20" />
              <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-[300%] -translate-y-1/2 rounded-full bg-[var(--loopnik-accent)] opacity-10" />
              <span className="block h-5 w-5 rounded-full border-2 border-white bg-[var(--loopnik-accent)] shadow-[0_0_18px_rgba(46,199,250,0.9)] md:h-6 md:w-6" />
            </div>
          </div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
            <span className="block h-3.5 w-3.5 rounded-full border border-white bg-[var(--loopnik-gold)] shadow-[0_0_16px_rgba(255,209,64,0.85)] md:h-4 md:w-4" />
          </div>

          <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="block h-2.5 w-2.5 rotate-45 bg-[var(--loopnik-hazard)] opacity-70 shadow-[0_0_12px_rgba(255,69,89,0.7)]" />
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[var(--loopnik-bg)] to-transparent" />
    </div>
  );
}
