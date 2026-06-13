import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppContentCard, AppPageShell } from "@/components/evomedia/AppPageShell";
import ObfuscatedEmail from "@/components/evomedia/ObfuscatedEmail";
import { getIosAppById, iosAppsData } from "@/lib/ios-apps-data";
import { getIosAppPageContent } from "@/lib/ios-app-pages";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return iosAppsData.map((app) => ({ slug: app.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const app = getIosAppById(slug);
  if (!app) return { title: "App not found" };

  return {
    title: `${app.name} — Support`,
    description: `${app.description} Support and help for ${app.name}.`,
  };
}

export default async function AppSupportPage({ params }: Props) {
  const { slug } = await params;
  const app = getIosAppById(slug);
  const pageContent = getIosAppPageContent(slug);
  if (!app || !pageContent) notFound();

  return (
    <AppPageShell
      appName={app.name}
      tagline={app.tagline}
      accent={app.accent}
      backHref="/apps"
      backLabel="All iOS apps"
    >
      <AppContentCard title="About" accent={app.accent}>
        <p>{app.description}</p>
      </AppContentCard>

      <AppContentCard title="Support">
        <p>
          Found a bug, or have a suggestion? Email{" "}
          <ObfuscatedEmail encoded={app.supportEmailEncoded} />
          {" "}and we&apos;ll get back to you.
        </p>
      </AppContentCard>

      <AppContentCard title="Restore purchases">
        <p>{pageContent.restorePurchasesNote}</p>
      </AppContentCard>

      <p className="text-center pt-2">
        <Link
          href={`/apps/${app.id}/privacy`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#00d4ff]/15 text-[#00d4ff] hover:bg-[#00d4ff]/25 transition-colors"
        >
          Privacy Policy
        </Link>
      </p>
    </AppPageShell>
  );
}
