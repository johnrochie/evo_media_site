"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] text-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="text-gray-400 mb-6 text-center max-w-md">
          We&apos;ve been notified. Please try again or return home.
        </p>
        <Link
          href="/evomedia"
          className="px-6 py-3 rounded-lg font-semibold bg-[#00d4ff] text-[#0a0a0f] hover:opacity-90"
        >
          Back to home
        </Link>
      </body>
    </html>
  );
}
