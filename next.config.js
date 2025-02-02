/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  output: 'standalone',
}

module.exports = nextConfig 