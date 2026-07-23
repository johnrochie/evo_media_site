import type { Metadata } from "next";
import "../evomedia/evomedia.css";

export const metadata: Metadata = {
  title: "Start your project | Evolution Media",
  description:
    "Tell us about your business, branding, and content so we can get straight into building your site.",
};

export default function StartYourProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
