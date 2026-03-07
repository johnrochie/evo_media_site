import Link from "next/link";

export const metadata = {
  title: "Payment cancelled | Evolution Media",
  description: "Your payment was cancelled. No charges were made.",
};

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Payment cancelled</h1>
        <p className="text-gray-400 mb-8">
          No charges were made. If you&apos;d like to discuss your project or
          have questions, feel free to get in touch.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/#pricing"
            className="inline-block px-6 py-3 rounded-lg font-semibold bg-[#00d4ff]/20 text-[#00d4ff] hover:bg-[#00d4ff]/30 transition-colors"
          >
            Back to pricing
          </Link>
          <Link
            href="/#contact"
            className="inline-block px-6 py-3 rounded-lg font-semibold border border-white/20 text-gray-300 hover:border-[#00d4ff]/50 hover:text-[#00d4ff] transition-colors"
          >
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
