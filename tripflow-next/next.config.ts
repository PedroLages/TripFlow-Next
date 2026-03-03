import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'http', hostname: '127.0.0.1', port: '54421' },
    ],
    imageSizes: [400, 800, 1200, 1600],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
