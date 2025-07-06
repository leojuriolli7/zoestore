import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  images: {
    remotePatterns: [
      { hostname: "y6fxvyrmbwt4n2rt.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
