import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['motion'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.cosmic.beesocialpk.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'partner.visitsaudi.com',
      },
      // MUST HAVE THIS FOR YOUTUBE THUMBNAILS
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/ziyarat-packages',
        destination: '/packages/ziyarat-packages',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;