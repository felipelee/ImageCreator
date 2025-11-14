import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable ESLint during builds (can cause failures)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript errors during builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Optimize for Netlify
  output: 'standalone',
};

export default nextConfig;
