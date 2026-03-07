import Link from "next/link";

export const metadata = {
  title: "Payment successful | Evolution Media",
  description: "Thank you for your payment. We'll be in touch soon.",
};

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Payment successful</h1>
        <p className="text-gray-400 mb-8">
          Thank you for your payment. We&apos;ll be in touch within 24 hours to
          discuss your project and next steps.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-lg font-semibold bg-[#00d4ff]/20 text-[#00d4ff] hover:bg-[#00d4ff]/30 transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
