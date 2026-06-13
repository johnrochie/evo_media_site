import type { Metadata } from "next";
import "../evomedia/evomedia.css";

export const metadata: Metadata = {
  title: "iOS Apps | Evolution Media",
  description:
    "Hobby games and iOS side projects built by Evolution Media—casual games made for fun.",
};

export default function AppsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
