"use client";

const CONSENT_KEY = "evomedia-cookie-consent";

export default function CookiePreferencesLink() {
  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.removeItem(CONSENT_KEY);
      window.location.reload();
    }
  }

  return (
    <a
      href="/privacy#cookies"
      onClick={handleClick}
      className="hover:text-gray-400 transition-colors"
    >
      Cookie preferences
    </a>
  );
}
