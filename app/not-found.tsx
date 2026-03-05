import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#0a0a0f] text-gray-100 font-sans">
      <h1 className="text-6xl md:text-8xl font-bold mb-4">
        <span
          className="bg-gradient-to-r from-[#00d4ff] via-[#ff00aa] to-[#ffb800] bg-clip-text text-transparent"
        >
          404
        </span>
      </h1>
      <p className="text-xl text-gray-400 mb-8 text-center max-w-md">
        Page not found. Let&apos;s get you back on track.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-lg font-semibold bg-[#00d4ff] text-[#0a0a0f] hover:opacity-90 transition-opacity"
      >
        Back to home
      </Link>
    </div>
  );
}
