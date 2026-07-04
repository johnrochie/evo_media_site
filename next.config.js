const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/evomedia", destination: "/", permanent: true },
      { source: "/loopnik", destination: "/apps/loopnik", permanent: true },
      { source: "/loopnik/privacy", destination: "/apps/loopnik/privacy", permanent: true },
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
