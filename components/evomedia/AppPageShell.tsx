import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function AppPageShell({
  appName,
  backHref,
  backLabel,
  children,
}: {
  appName: string;
  backHref: string;
  backLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] evomedia-page text-gray-100">
      <header className="border-b border-white/5 bg-[#0a0a0f]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#00d4ff] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </Link>
        </div>
      </header>
      <main
        id="main-content"
        tabIndex={-1}
        className="max-w-3xl mx-auto px-4 sm:px-6 py-12 outline-none"
      >
        <p className="text-[#00d4ff] font-semibold tracking-widest uppercase text-sm mb-2">
          iOS App
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">{appName}</h1>
        {children}
      </main>
    </div>
  );
}
