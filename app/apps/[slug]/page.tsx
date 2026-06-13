import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppPageShell } from "@/components/evomedia/AppPageShell";
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
    <AppPageShell appName={app.name} backHref="/apps" backLabel="All iOS apps">
      <p className="text-lg text-gray-300 mb-10 leading-relaxed">
        {app.description}{" "}
        <span className="text-white font-medium">{app.tagline}</span>
      </p>

      <section className="space-y-4 mb-10">
        <h2 className="text-xl font-semibold text-white">Support</h2>
        <p className="text-gray-300 leading-relaxed">
          Found a bug, or have a suggestion? Email{" "}
          <a
            href={`mailto:${app.supportEmail}`}
            className="text-[#00d4ff] hover:underline"
          >
            {app.supportEmail}
          </a>{" "}
          and we&apos;ll get back to you.
        </p>
      </section>

      <section className="space-y-4 mb-10">
        <h2 className="text-xl font-semibold text-white">Restore purchases</h2>
        <p className="text-gray-300 leading-relaxed">{pageContent.restorePurchasesNote}</p>
      </section>

      <p className="text-gray-400">
        <Link href={`/apps/${app.id}/privacy`} className="text-[#00d4ff] hover:underline">
          Privacy Policy
        </Link>
      </p>
    </AppPageShell>
  );
}
