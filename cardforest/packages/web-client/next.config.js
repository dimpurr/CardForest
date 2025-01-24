/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/graphql',
        destination: 'http://localhost:3030/graphql',
      },
      {
        source: '/auth/:path*',
        destination: 'http://localhost:3030/user/auth/:path*',
      },
    ]
  },
}

module.exports = nextConfig
