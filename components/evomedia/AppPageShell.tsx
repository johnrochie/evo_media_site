import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { evomediaContent } from "@/lib/evomedia-content";

export function AppContentCard({
  title,
  children,
  accent,
}: {
  title: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <section className="rounded-2xl bg-[#12121a] border border-white/5 p-6 md:p-8">
      <h2
        className="text-lg md:text-xl font-bold text-white mb-4"
        style={accent ? { color: accent } : undefined}
      >
        {title}
      </h2>
      <div className="text-gray-300 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export function AppPageShell({
  appName,
  appNameHighlight,
  tagline,
  accent,
  backHref,
  backLabel,
  children,
}: {
  appName: string;
  appNameHighlight?: string;
  tagline?: string;
  accent?: string;
  backHref: string;
  backLabel: string;
  children: React.ReactNode;
}) {
  const footer = evomediaContent.footer;

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] evomedia-page text-gray-100 flex flex-col overflow-hidden">
      <header className="border-b border-white/5 bg-[#0a0a0f]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="font-bold text-lg md:text-xl tracking-tight shrink-0"
          >
            <span className="evomedia-gradient-text">{evomediaContent.nav.logoHighlight}</span>
            <span className="text-white">{evomediaContent.nav.logoRest}</span>
          </Link>
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#00d4ff] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">{backLabel}</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </header>

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 opacity-30"
        style={{
          background: accent
            ? `radial-gradient(ellipse 80% 60% at 50% -10%, ${accent}33, transparent)`
            : "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,212,255,0.15), transparent)",
        }}
        aria-hidden
      />

      <main
        id="main-content"
        tabIndex={-1}
        className="relative flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 md:py-16 outline-none"
      >
        <p
          className="font-semibold tracking-widest uppercase text-sm mb-2"
          style={{ color: accent ?? "#00d4ff" }}
        >
          iOS App
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
          {appNameHighlight ? (
            <>
              {appName.replace(appNameHighlight, "")}
              <span className="evomedia-gradient-text">{appNameHighlight}</span>
            </>
          ) : (
            appName
          )}
        </h1>
        {tagline && (
          <p className="text-gray-400 text-lg mb-10">{tagline}</p>
        )}

        <div className="space-y-6">{children}</div>
      </main>

      <footer className="border-t border-white/5 mt-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} {footer.copyright}
          </p>
          <div className="flex gap-4">
            <Link href="/apps" className="hover:text-[#00d4ff] transition-colors">
              iOS Apps
            </Link>
            <Link href="/" className="hover:text-[#00d4ff] transition-colors">
              Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
