// next.config.js
import withNextIntl from 'next-intl/plugin';

const withNextIntlConfig = withNextIntl();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
  serverExternalPackages: ['mongoose'],
};

export default withNextIntlConfig(nextConfig);