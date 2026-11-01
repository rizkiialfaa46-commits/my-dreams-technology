import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.56.1",
    "192.168.133.1",
    "localhost",
  ],
};

export default nextConfig;