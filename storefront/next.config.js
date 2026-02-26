/** @type {import('next').NextConfig} */
const nextConfig = {
  // Contournement temporaire : Next.js 16 canary génère validator.ts qui importe
  // ./routes.js inexistant. À retirer après passage en Next.js 15 stable.
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: true,
  transpilePackages: ['@simpshopy/shared'],
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  },
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks', '@mantine/carousel'],
  },
};

module.exports = nextConfig;
