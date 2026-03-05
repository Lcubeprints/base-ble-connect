import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Basescan and Etherscan images if needed
  images: {
    remotePatterns: [],
  },
  // Required for @coinbase/onchainkit and wagmi SSR
  transpilePackages: ['@coinbase/onchainkit'],
};

export default nextConfig;
