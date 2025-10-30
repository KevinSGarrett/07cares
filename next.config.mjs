/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // optional, but safe defaults
  experimental: {
    // Turn off Turbopack in the hosted build if you want to be extra safe:
    // turbo: { resolveAlias: {} },
  },
};
export default nextConfig;
