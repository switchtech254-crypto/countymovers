
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,

  // Allow devices on your local network to access dev resources.
  allowedDevOrigins: ["192.168.3.*"],
};

export default nextConfig;
