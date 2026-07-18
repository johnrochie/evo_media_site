const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/app-ads.txt",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "evomedia.site" }],
        destination: "https://www.evomedia.site/:path*",
        permanent: true,
      },
      { source: "/evomedia", destination: "/", permanent: true },
      // Loopnik marketing lives at /loopnik — keep old /apps URLs working
      { source: "/apps/loopnik", destination: "/loopnik", permanent: true },
      {
        source: "/apps/loopnik/privacy",
        destination: "/loopnik/privacy",
        permanent: true,
      },
      { source: "/puff-pop-panic", destination: "/apps/puff-pop-panic", permanent: true },
      {
        source: "/puff-pop-panic/privacy",
        destination: "/apps/puff-pop-panic/privacy",
        permanent: true,
      },
      { source: "/neon-blocks", destination: "/apps/neon-blocks", permanent: true },
      {
        source: "/neon-blocks/privacy",
        destination: "/apps/neon-blocks/privacy",
        permanent: true,
      },
    ];
  },
};

module.exports = withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
});
