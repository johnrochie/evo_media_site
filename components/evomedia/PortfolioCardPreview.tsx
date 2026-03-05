"use client";

type PreviewProps = { accent: string };

function NexusPreview({ accent }: PreviewProps) {
  return (
    <div className="absolute inset-0 p-3 flex flex-col">
      <div className="flex-1 rounded-lg bg-[#0a0a0f]/80 overflow-hidden">
        <div className="h-full flex flex-col items-center justify-center p-4">
          <div className="w-8 h-1 rounded mb-3" style={{ backgroundColor: accent }} />
          <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: accent }}>
            Smart money
          </p>
          <h3 className="text-sm font-bold text-white text-center leading-tight mb-3">
            Banking that
            <br />
            <span style={{ color: accent }}>scales</span>
          </h3>
          <div className="flex gap-1.5 mt-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 h-8 rounded bg-white/5" style={{ borderLeft: `2px solid ${accent}` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LunaPreview({ accent }: PreviewProps) {
  return (
    <div className="absolute inset-0 p-3 flex flex-col">
      <div className="flex-1 rounded-lg bg-[#0a0a0f]/80 overflow-hidden">
        <div className="h-full p-3 flex flex-col">
          <div className="flex gap-2 mb-2">
            <div className="w-1/3 aspect-square rounded bg-pink-500/20" />
            <div className="w-1/3 aspect-square rounded bg-rose-500/20" />
            <div className="w-1/3 aspect-square rounded bg-pink-500/20" />
          </div>
          <p className="text-[10px] font-semibold uppercase" style={{ color: accent }}>
            Clean beauty
          </p>
          <p className="text-xs text-white font-bold">Skin care</p>
          <div className="mt-auto flex gap-1">
            <div className="flex-1 h-4 rounded bg-white/5" />
            <div className="w-12 h-4 rounded" style={{ backgroundColor: accent }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ApexPreview({ accent }: PreviewProps) {
  return (
    <div className="absolute inset-0 p-3 flex flex-col">
      <div className="flex-1 rounded-lg bg-[#0a0a0f]/80 overflow-hidden">
        <div className="h-full p-3 flex flex-col">
          <p className="text-[10px] font-semibold uppercase mb-1" style={{ color: accent }}>
            Your local gym
          </p>
          <h3 className="text-sm font-bold text-white leading-tight mb-3">
            Train harder.
            <br />
            <span style={{ color: accent }}>Feel stronger.</span>
          </h3>
          <div className="space-y-1.5 flex-1">
            {["HIIT 6am", "Yoga 9am", "Spin 6pm"].map((c) => (
              <div key={c} className="flex justify-between text-[10px] text-gray-400 py-1 border-b border-white/5">
                <span>{c}</span>
                <span style={{ color: accent }}>Book</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function VerdantPreview({ accent }: PreviewProps) {
  return (
    <div className="absolute inset-0 p-3 flex flex-col">
      <div className="flex-1 rounded-lg bg-[#0a0a0f]/80 overflow-hidden">
        <div className="h-full flex flex-col items-center justify-center p-4 text-center">
          <p className="text-[10px] font-semibold uppercase mb-2" style={{ color: accent }}>
            For the planet
          </p>
          <h3 className="text-sm font-bold text-white leading-tight mb-3">
            A future where
            <br />
            <span style={{ color: accent }}>business gives back</span>
          </h3>
          <div className="w-full h-6 rounded bg-white/5 flex items-center px-2">
            <span className="text-[10px] text-gray-500">Your email</span>
          </div>
          <div className="w-full h-6 rounded mt-2" style={{ backgroundColor: accent }} />
        </div>
      </div>
    </div>
  );
}

function FramePreview({ accent }: PreviewProps) {
  return (
    <div className="absolute inset-0 p-3 flex flex-col">
      <div className="flex-1 rounded-lg bg-[#0a0a0f]/80 overflow-hidden">
        <div className="h-full p-3 flex flex-col">
          <p className="text-[10px] font-semibold uppercase mb-2" style={{ color: accent }}>
            Design studio
          </p>
          <h3 className="text-sm font-bold text-white leading-tight mb-3">
            We make
            <br />
            <span style={{ color: accent }}>stuff that sticks</span>
          </h3>
          <div className="grid grid-cols-3 gap-1.5 flex-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded bg-violet-500/10 border border-white/5" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmberPreview({ accent }: PreviewProps) {
  return (
    <div className="absolute inset-0 p-3 flex flex-col">
      <div className="flex-1 rounded-lg bg-[#0a0a0f]/80 overflow-hidden">
        <div className="h-full p-3 flex flex-col">
          <p className="text-[10px] font-semibold uppercase mb-1" style={{ color: accent }}>
            Farm-to-table
          </p>
          <h3 className="text-sm font-bold text-white leading-tight mb-3">
            Ember
            <br />
            <span style={{ color: accent }}>Kitchen</span>
          </h3>
          <div className="space-y-1 flex-1">
            {["Grilled octopus €14", "Lamb shoulder €28"].map((m) => (
              <div key={m} className="flex justify-between text-[10px] text-gray-400 py-1 border-b border-white/5">
                <span>{m.split(" €")[0]}</span>
                <span style={{ color: accent }}>{m.split("€")[1]}</span>
              </div>
            ))}
          </div>
          <div className="h-5 rounded mt-2" style={{ backgroundColor: accent }} />
        </div>
      </div>
    </div>
  );
}

const previews: Record<string, React.ComponentType<PreviewProps>> = {
  nexus: NexusPreview,
  luna: LunaPreview,
  apex: ApexPreview,
  verdant: VerdantPreview,
  frame: FramePreview,
  ember: EmberPreview,
};

export default function PortfolioCardPreview({
  projectId,
  accent,
  gradient,
}: {
  projectId: string;
  accent: string;
  gradient: string;
}) {
  const Preview = previews[projectId] ?? NexusPreview;

  return (
    <>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-40`} />
      <Preview accent={accent} />
    </>
  );
}
