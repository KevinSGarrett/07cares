// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // DO NOT set output: 'standalone' for Amplify SSR
  reactStrictMode: true,
  // No assetPrefix, no basePath for now
  experimental: {
    // leave empty (Amplify supports App Router)
  },
};

export default nextConfig;
