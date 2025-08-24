import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@content-assistant/shared"],
  outputFileTracingRoot: require('path').join(__dirname, '../../'),
};

export default nextConfig;
