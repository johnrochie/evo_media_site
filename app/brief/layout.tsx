import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build brief | Evolution Media",
  description:
    "Share your project details after your deposit so we can build your one-page site. Evolution Media build brief form.",
};

export default function BriefLayout({ children }: { children: React.ReactNode }) {
  return children;
}
