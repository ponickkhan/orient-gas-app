/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow ngrok origins for development
  allowedDevOrigins: [
    '*.ngrok-free.app',
    '*.ngrok.app',
    '*.ngrok.io'
  ],
  images: {
    unoptimized: true,
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif']
  }
};

module.exports = nextConfig;
