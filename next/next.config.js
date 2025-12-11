/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb'
    }
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: '**.cdn.cloudflare.net' },
      { protocol: 'https', hostname: '**' }
    ]
  }
}

module.exports = nextConfig



