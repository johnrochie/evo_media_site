/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/", destination: "/evomedia", permanent: true },
    ];
  },
};

module.exports = nextConfig;
