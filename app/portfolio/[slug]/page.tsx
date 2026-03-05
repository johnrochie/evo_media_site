import { notFound } from "next/navigation";
import Link from "next/link";
import { portfolioProjects } from "@/lib/portfolio-projects";
import NexusDemo from "@/components/portfolio-demos/NexusDemo";
import LunaDemo from "@/components/portfolio-demos/LunaDemo";
import ApexDemo from "@/components/portfolio-demos/ApexDemo";
import VerdantDemo from "@/components/portfolio-demos/VerdantDemo";
import FrameDemo from "@/components/portfolio-demos/FrameDemo";
import EmberDemo from "@/components/portfolio-demos/EmberDemo";

const demos: Record<string, React.ComponentType<{ accent: string }>> = {
  nexus: NexusDemo,
  luna: LunaDemo,
  apex: ApexDemo,
  verdant: VerdantDemo,
  frame: FrameDemo,
  ember: EmberDemo,
};

export async function generateStaticParams() {
  return portfolioProjects.map((p) => ({ slug: p.id }));
}

export default async function PortfolioDemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = portfolioProjects.find((p) => p.id === slug);
  const Demo = project ? demos[slug] : null;

  if (!project || !Demo) notFound();

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-gray-500">Evolution Media showcase</span>
          <Link
            href="/evomedia#portfolio"
            className="text-sm text-[#00d4ff] hover:underline"
          >
            ← Back to Evolution Media
          </Link>
        </div>
      </header>
      <Demo accent={project.accent} />
    </div>
  );
}
